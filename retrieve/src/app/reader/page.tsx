'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import { normalizeText } from '@/lib/pdf-parser';
import Mascot3D from '@/components/Mascot3D';

import { useAuth } from '@/lib/auth-context';

// ─── Types ────────────────────────────────────────────────────
interface WordToken {
  word: string;
  norm: string;
  index: number;
}

interface ParagraphToken {
  words: WordToken[];
}

type ReaderMode = 'idle' | 'recording' | 'paused' | 'complete' | 'demo';

// ─── Demo passage for when no PDF is loaded ───────────────────
const DEMO_PASSAGE = `The pathophysiology of acute myocardial infarction involves the sudden occlusion of a coronary artery, typically due to the rupture of an atherosclerotic plaque followed by thrombus formation.

This abrupt cessation of blood flow leads to a profound reduction in regional oxygen delivery, initiating a cascade of cellular events. Within seconds of ischemia onset, aerobic metabolism ceases and the cell switches to anaerobic glycolysis, resulting in rapid depletion of ATP reserves and accumulation of lactic acid.

The resulting intracellular acidosis disrupts enzyme function and ion homeostasis, leading to sodium and calcium overload within the cardiomyocytes. If perfusion is not restored within approximately twenty minutes, irreversible injury begins, characterized by membrane disruption, mitochondrial swelling, and ultimately myocardial necrosis.

The extent of necrosis depends on the duration and severity of ischemia, the presence of collateral circulation, and the metabolic demands of the affected myocardium.`;

// ─── Web Speech API types ─────────────────────────────────────
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// ─── Component ────────────────────────────────────────────────
export default function ReaderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { pdfData, currentPassageIndex, setCurrentPassageIndex, activeSessionId, setActiveSessionId, metrics, updateMetrics } = useStudySession();

  // Word tokens & reader states
  const [words, setWords] = useState<WordToken[]>([]);
  const [paragraphs, setParagraphs] = useState<ParagraphToken[]>([]);
  const [readCursor, setReadCursor] = useState(0);
  const [mode, setMode] = useState<ReaderMode>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [demoSpeed, setDemoSpeed] = useState<1 | 1.5 | 2>(1.5);

  // Refs
  const recognitionRef = useRef<any>(null);
  const demoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeParagraphRef = useRef<HTMLParagraphElement | null>(null);
  const startTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<WordToken[]>([]);
  const cursorRef = useRef(0);
  const resultStartCursorsRef = useRef<number[]>([]);
  const modeRef = useRef<ReaderMode>('idle');

  // Keep refs in sync with state
  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { cursorRef.current = readCursor; }, [readCursor]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  // ─── Session Resume Check & New Session Creation ──────────────────────────────
  const resumeCheckedRef = useRef(false);
  useEffect(() => {
    if (!user?.id || !pdfData || paragraphs.length === 0 || resumeCheckedRef.current) return;
    resumeCheckedRef.current = true;

    import('@/lib/db')
      .then(async ({ getLatestInProgressSession, createInProgressSession }) => {
        try {
          const session = await getLatestInProgressSession(user.id) as any;
          if (session) {
            const confirmResume = window.confirm(`Resume last session of "${session.pdfName || 'document'}"?`);
            if (confirmResume) {
              const resumeIndex = session.lastPassageIndex || 0;
              setCurrentPassageIndex(resumeIndex);
              
              const completedParas = session.paragraphsCompleted || [];
              let targetCursor = 0;
              if (completedParas.length > 0) {
                let nextParaToRead = 0;
                while (completedParas.includes(nextParaToRead)) {
                  nextParaToRead++;
                }
                if (paragraphs[nextParaToRead]) {
                  const firstWord = paragraphs[nextParaToRead].words[0];
                  if (firstWord) {
                    targetCursor = firstWord.index;
                  }
                }
              }
              setReadCursor(targetCursor);
              cursorRef.current = targetCursor;
              setActiveSessionId(session.id);
              return;
            }
          }
          
          const sid = await createInProgressSession(user.id, {
            pdfName: pdfData.fileName || 'Document.pdf',
            startedAt: new Date(),
            completedAt: null,
            wordsRead: 0,
            accuracy: 100,
            mcqAccuracy: 0,
            passagesCompleted: 0,
            totalPassages: pdfData.passages.length || 1,
            durationMinutes: 0,
            paragraphsCompleted: [],
            lastPassageIndex: currentPassageIndex || 0,
            status: 'in-progress'
          });
          setActiveSessionId(sid);
        } catch (err) {
          console.error('Failed to initialize session status:', err);
        }
      });
  }, [user?.id, pdfData, paragraphs, setCurrentPassageIndex, currentPassageIndex, setActiveSessionId]);

  // ─── Auto-save in-progress progress ─────────────────────────
  useEffect(() => {
    if (!user?.id || !activeSessionId || paragraphs.length === 0) return;

    const completedParas: number[] = [];
    paragraphs.forEach((p, idx) => {
      const lastWord = p.words[p.words.length - 1];
      if (lastWord && readCursor > lastWord.index) {
        completedParas.push(idx);
      }
    });

    const elapsedSeconds = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
    const durationMinutes = Math.max(0, Math.round(elapsedSeconds / 60));

    import('@/lib/db')
      .then(({ updateInProgressSession }) => {
        updateInProgressSession(user.id, activeSessionId, {
          wordsRead: readCursor,
          paragraphsCompleted: completedParas,
          lastPassageIndex: currentPassageIndex,
          durationMinutes
        }).catch(err => console.error('Failed to auto-save in-progress progress:', err));
      });
  }, [readCursor, user?.id, activeSessionId, currentPassageIndex, paragraphs]);

  // ─── Initialize passage words ───────────────────────────────
  useEffect(() => {
    let text = DEMO_PASSAGE;
    if (pdfData && pdfData.passages.length > 0 && pdfData.passages[currentPassageIndex]) {
      text = pdfData.passages[currentPassageIndex].text;
    }

    // Split text by paragraph breaks (newlines)
    const paraTexts = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
    
    let globalIndex = 0;
    const mappedParas: ParagraphToken[] = paraTexts.map(pText => {
      const tokens = pText.split(/\s+/).filter(w => w.trim().length > 0);
      const words = tokens.map(w => {
        const token: WordToken = {
          word: w,
          norm: normalizeText(w),
          index: globalIndex
        };
        globalIndex++;
        return token;
      });
      return { words };
    });

    const flatWords = mappedParas.flatMap(p => p.words);
    setWords(flatWords);
    wordsRef.current = flatWords;
    setParagraphs(mappedParas);
    setReadCursor(0);
    cursorRef.current = 0;
    resultStartCursorsRef.current = [];
    setMode('idle');
    setErrorMsg('');
  }, [pdfData, currentPassageIndex]);

  // ─── Spotify-style Auto-scroll to active paragraph ──────────
  const activeParagraphIndex = paragraphs.findIndex(para => 
    para.words.some(w => w.index === readCursor)
  );

  useEffect(() => {
    if (activeParagraphRef.current) {
      activeParagraphRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeParagraphIndex]);

  // ─── Sequential word matcher ────────────────────────────────
  const matchSpokenWordsForResult = useCallback((transcript: string, startCursor: number) => {
    const spokenWords = transcript.toLowerCase().split(/\s+/).filter(w => w.trim().length > 0);

    let cursor = startCursor;
    const allWords = wordsRef.current;
    if (cursor >= allWords.length) return cursor;

    for (const spoken of spokenWords) {
      const normSpoken = normalizeText(spoken);
      if (!normSpoken) continue;

      // Look ahead up to 12 words for fuzzy matching
      const lookahead = Math.min(cursor + 12, allWords.length);
      for (let i = cursor; i < lookahead; i++) {
        if (allWords[i].norm === normSpoken) {
          cursor = i + 1;
          break;
        }
      }
    }
    return cursor;
  }, []);

  // ─── Handle passage completion ──────────────────────────────
  const handleComplete = useCallback((wordsRead: number) => {
    setMode('complete');
    stopRecognition();
    stopDemo();

    const duration = (Date.now() - startTimeRef.current) / 1000;
    updateMetrics({
      accuracyPercent: Math.round((wordsRead / wordsRef.current.length) * 100),
      wordsRead,
      durationSeconds: duration,
    });

    setTimeout(() => router.push('/quiz'), 2000);
  }, [router, updateMetrics]);

  // ─── Web Speech API recognition ─────────────────────────────
  const startRecognition = useCallback(() => {
    setErrorMsg('');
    resultStartCursorsRef.current = [];

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let latestCursor = cursorRef.current;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (!transcript.trim()) continue;

          if (resultStartCursorsRef.current[i] === undefined) {
            resultStartCursorsRef.current[i] = i > 0 ? (resultStartCursorsRef.current[i - 1] ?? latestCursor) : latestCursor;
          }

          const startCursor = resultStartCursorsRef.current[i];
          const nextCursor = matchSpokenWordsForResult(transcript, startCursor);

          if (result.isFinal) {
            resultStartCursorsRef.current[i + 1] = nextCursor;
          }

          if (nextCursor > latestCursor) {
            latestCursor = nextCursor;
          }
        }

        if (latestCursor !== cursorRef.current) {
          cursorRef.current = latestCursor;
          setReadCursor(latestCursor);

          if (latestCursor >= wordsRef.current.length) {
            setTimeout(() => handleComplete(latestCursor), 800);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('🎙️ Microphone access denied. Please allow microphone access in your browser settings.');
          setMode('paused');
        } else if (event.error === 'network') {
          setErrorMsg('⚠️ Network error. Speech recognition requires an internet connection.');
          setMode('paused');
        } else {
          // Do not pause for non-fatal transient errors (e.g. no-speech, aborted, audio-capture)
          // so that the onend handler knows to attempt an auto-restart
          console.warn('Transient speech recognition error:', event.error);
        }
      };

      recognition.onend = () => {
        // Only auto-restart if we are intentionally in recording mode and not completed
        if (modeRef.current === 'recording' && cursorRef.current < wordsRef.current.length) {
          setTimeout(() => {
            try {
              if (recognitionRef.current && modeRef.current === 'recording') {
                recognitionRef.current.start();
              }
            } catch (err) {
              console.warn('Failed to restart speech recognition:', err);
            }
          }, 300); // 300ms delay lets browser cleanly release mic resources
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setMode('recording');
      startTimeRef.current = startTimeRef.current || Date.now();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start speech recognition';
      setErrorMsg(msg);
      setMode('paused');
    }
  }, [matchSpokenWordsForResult, handleComplete]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
  }, []);

  // ─── Demo mode (auto-advance words) ─────────────────────────
  const startDemo = useCallback((speedFactor?: number) => {
    stopRecognition();
    setMode('demo');
    startTimeRef.current = startTimeRef.current || Date.now();

    if (demoTimerRef.current) clearInterval(demoTimerRef.current);

    const actualSpeed = speedFactor !== undefined ? speedFactor : demoSpeed;
    const intervalMs = Math.round(350 / actualSpeed);

    demoTimerRef.current = setInterval(() => {
      const cursor = cursorRef.current + 1;
      cursorRef.current = cursor;
      setReadCursor(cursor);

      if (cursor >= wordsRef.current.length) {
        stopDemo();
        setTimeout(() => handleComplete(cursor), 800);
      }
    }, intervalMs);
  }, [handleComplete, stopRecognition, demoSpeed]);

  const stopDemo = useCallback(() => {
    if (demoTimerRef.current) {
      clearInterval(demoTimerRef.current);
      demoTimerRef.current = null;
    }
  }, []);

  // ─── Play/Pause toggle ──────────────────────────────────────
  const togglePlayPause = useCallback(() => {
    if (mode === 'recording') {
      stopRecognition();
      setMode('paused');
    } else if (mode === 'demo') {
      stopDemo();
      setMode('paused');
    } else if (mode === 'idle' || mode === 'paused') {
      startRecognition();
    }
  }, [mode, startRecognition, stopRecognition, stopDemo]);

  // ─── Speed adjustment ───────────────────────────────────────
  const handleSpeedChange = (speed: 1 | 1.5 | 2) => {
    setDemoSpeed(speed);
    if (mode === 'demo') {
      startDemo(speed);
    }
  };

  // ─── Skip passage ───────────────────────────────────────────
  const handleSkip = useCallback(() => {
    stopRecognition();
    stopDemo();
    updateMetrics({
      accuracyPercent: 100,
      wordsRead: wordsRef.current.length,
      durationSeconds: (Date.now() - (startTimeRef.current || Date.now())) / 1000,
    });
    router.push('/quiz');
  }, [router, updateMetrics, stopRecognition, stopDemo]);

  // ─── Exit session ───────────────────────────────────────────
  const handleExit = useCallback(() => {
    stopRecognition();
    stopDemo();
    router.push('/dashboard');
  }, [router, stopRecognition, stopDemo]);

  // ─── Keyboard shortcut (Space) ──────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && mode !== 'complete') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, mode]);

  // ─── Cleanup on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => {
      stopRecognition();
      stopDemo();
    };
  }, [stopRecognition, stopDemo]);

  // ─── Computed values ────────────────────────────────────────
  const progressPercent = words.length > 0 ? Math.min(100, Math.round((readCursor / words.length) * 100)) : 0;
  const isActive = mode === 'recording' || mode === 'demo';

  // Get Mascot Message based on status
  const getMascotMessage = () => {
    if (mode === 'idle') return "Press the mic button or Space to start reading aloud! You've got this.";
    if (mode === 'recording') return "Speak clearly! I am matching your voice word-by-word.";
    if (mode === 'demo') return `Running the demo at ${demoSpeed}x speed. Watch the cursor flow!`;
    if (mode === 'paused') return "Take a deep breath. Press the central play button to resume.";
    if (mode === 'complete') return "Incredible work! Preparing your MCAT quiz questions...";
    return "Keep going, you are doing wonderfully!";
  };

  return (
    <div className="min-h-screen bg-[#faf9f9] text-[#1a1c1c] font-sans flex flex-col select-none overflow-hidden relative selection:bg-[#58cc02]/20 selection:text-[#2b6c00]">
      {/* ─── Styles Inject ─── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.9) translateY(4px); opacity: 0.6; }
          100% { transform: scale(1.05) translateY(-2px); opacity: 1; }
        }
        .tactile-btn {
          border-bottom-width: 4px;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tactile-btn:hover {
          transform: scale(1.03);
        }
        .tactile-btn:active {
          border-bottom-width: 0px;
          transform: scale(0.97) translateY(2px);
        }
        .karaoke-highlight {
          background-color: #58cc02;
          color: #ffffff !important;
          border-radius: 8px;
          padding: 2px 8px;
          box-shadow: 0 4px 0 #2b6c00;
          display: inline-block;
          animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .cylinder-container {
          position: relative;
          width: 16px;
          height: 320px;
          background: #eeeeed;
          border-radius: 20px;
          border: 2px solid #becbb1;
          overflow: hidden;
        }
        .cylinder-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(180deg, #a3ff6e, #58cc02);
          border-radius: 0 0 20px 20px;
          transition: height 0.3s ease-out;
        }
        .cylinder-top {
          position: absolute;
          top: -5px;
          left: 0;
          width: 100%;
          height: 10px;
          background: #87fe45;
          border-radius: 50%;
          opacity: 0.8;
        }
        .cylinder-shine {
          position: absolute;
          top: 0;
          left: 3px;
          width: 4px;
          height: 100%;
          background: rgba(255,255,255,0.4);
          border-radius: 10px;
        }
        .mascot-idle {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* ═══ Sticky Top Progress Header ═══ */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b-4 border-[#eeeeed] px-8 py-4 flex items-center justify-between gap-6 shadow-sm">
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-[#E5E5E5] hover:bg-[#FAFAF9] transition-all shadow-[0_2px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-none pointer-events-auto"
        >
          <span className="material-symbols-outlined text-[#5F6A59] font-bold">close</span>
        </button>
        <div className="flex-1 max-w-[800px] h-4 bg-[#E5E5E5] rounded-full overflow-hidden border border-[#E5E5E5] relative">
          <div 
            className="absolute inset-y-0 left-0 bg-[#58CC02] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-sm font-extrabold text-[#58CC02] shrink-0 min-w-[50px] text-right">
          {progressPercent}%
        </div>
      </header>

      {/* ═══ Error Banner ═══ */}
      {errorMsg && (
        <div className="fixed top-28 left-8 right-8 z-40 bg-[#ba1a1a] text-white px-4 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
          <p className="text-xs font-bold flex-1 min-w-0 truncate">{errorMsg}</p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => { setErrorMsg(''); startRecognition(); }}
              className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-extrabold hover:bg-white/30 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => setErrorMsg('')}
              className="px-2 py-1.5 text-white/60 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ═══ Main Content Area ═══ */}
      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar pt-[110px] pb-[180px] px-8"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="w-full max-w-[1000px] mx-auto flex gap-12 relative items-start">
          
          {/* Mascot (Left Side) */}
          <aside className="hidden xl:flex flex-col items-center sticky top-0 pt-8 mascot-idle w-48 flex-shrink-0">
            <div className="bg-white border-2 border-[#eeeeed] p-4 rounded-2xl rounded-br-none mb-4 w-48 shadow-sm relative text-left">
              <p className="font-semibold text-[#1a1c1c]/80 text-[13px] leading-relaxed">
                {getMascotMessage()}
              </p>
              {/* Message Bubble Tail */}
              <div className="absolute right-0 bottom-[-8px] w-4 h-4 bg-white border-r-2 border-b-2 border-[#eeeeed] rotate-45 transform origin-top-right"></div>
            </div>
            <div className="w-20 h-20 bg-[#c8e6ff] rounded-full border-4 border-[#2fb8ff] flex items-center justify-center overflow-hidden shadow-md relative">
              <Mascot3D
                emotion={mode === 'complete' ? 'celebrating' : isActive ? 'thinking' : 'idle'}
                className="w-full h-full absolute inset-0"
              />
            </div>
          </aside>

          {/* Text Content */}
          <article className="flex-1 flex flex-col gap-10 text-2xl md:text-3xl font-extrabold leading-[2] text-[#1a1c1c] tracking-wide py-8 transition-all duration-300">
            <div className="border-b-2 border-[#eeeeed] pb-6 mb-4">
              <span className="font-extrabold text-xs text-[#58CC02] tracking-[0.2em] uppercase block mb-1">
                {pdfData ? `Passage ${currentPassageIndex + 1} of ${pdfData.passages.length}` : 'Practice Passage'}
              </span>
              <h1 className="font-extrabold text-3xl md:text-4xl text-[#1a1c1c] tracking-tight">
                {pdfData?.fileName ? pdfData.fileName.replace(/\.[^/.]+$/, "") : "Cardiovascular Pathophysiology"}
              </h1>
            </div>
            {paragraphs.map((para, paraIdx) => {
              const hasActiveWord = para.words.some(w => w.index === readCursor);
              const isParaActive = hasActiveWord || (mode === 'idle' && paraIdx === 0);
              const isParaPast = para.words.every(w => w.index < readCursor);

              return (
                <p
                  key={paraIdx}
                  ref={isParaActive ? activeParagraphRef : null}
                  className={`transition-all duration-500 ${
                    isParaActive
                      ? 'opacity-100'
                      : isParaPast
                      ? 'opacity-40'
                      : 'opacity-20'
                  }`}
                >
                  {para.words.map((token) => {
                    const isRead = token.index < readCursor;
                    const isCurrent = token.index === readCursor && isActive;
                    const isNextUp = token.index === readCursor && !isActive;

                    return (
                      <span
                        key={token.index}
                        className={`inline-block mr-[8px] mb-[6px] transition-all duration-200 ${
                          isCurrent
                            ? 'karaoke-highlight'
                            : isRead
                            ? 'text-[#58cc02]/60'
                            : isNextUp
                            ? 'text-[#1a1c1c] border-b-3 border-[#58cc02] pb-0.5'
                            : 'text-[#1a1c1c]'
                        }`}
                      >
                        {token.word}
                      </span>
                    );
                  })}
                </p>
              );
            })}

            {/* Completion Celebration */}
            {mode === 'complete' && (
              <div className="mt-16 text-center animate-bounce">
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-3xl font-extrabold text-[#58cc02] mb-1">Passage Complete!</h2>
                <p className="text-[#1a1c1c]/50 text-sm font-bold">Navigating to your MCAT questions...</p>
              </div>
            )}
          </article>

          {/* Vertical Progress (Right Side) */}
          <aside className="hidden md:flex flex-col items-center gap-4 sticky top-0 pt-8 w-16 flex-shrink-0">
            <div className="font-bold text-[10px] text-[#1a1c1c]/40 uppercase tracking-widest [writing-mode:vertical-lr] mb-2">
              XP Progress
            </div>
            <div className="cylinder-container">
              <div className="cylinder-fill" style={{ height: `${progressPercent}%` }}>
                <div className="cylinder-top" />
                <div className="cylinder-shine" />
              </div>
            </div>
            <div className="font-bold text-sm text-[#2b6c00] mt-1">
              {progressPercent}%
            </div>
          </aside>

        </div>
      </main>

      {/* Ambient Fades */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-[#faf9f9] to-transparent pointer-events-none z-20" />
      <div className="fixed bottom-0 left-0 w-full h-44 bg-gradient-to-t from-[#faf9f9] to-transparent pointer-events-none z-20" />

      {/* ═══ Floating Bottom Controls ═══ */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white border-2 border-[#eeeeed] rounded-full shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] px-8 py-3.5 flex items-center gap-10 backdrop-blur-md">
          
          {/* Speed Selector (Demo Mode speeds) */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1a1c1c]/50 text-lg">speed</span>
            <div className="flex items-center gap-1 bg-[#eeeeed] p-0.5 rounded-full">
              {( [1, 1.5, 2] as const ).map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    demoSpeed === speed
                      ? 'bg-[#2fb8ff] text-white shadow-sm'
                      : 'text-[#1a1c1c]/60 hover:text-[#1a1c1c]'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            <button
              onClick={() => startDemo()}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border-2 transition-all ${
                mode === 'demo'
                  ? 'bg-[#2fb8ff] text-white border-transparent'
                  : 'bg-white text-[#2fb8ff] border-[#2fb8ff] hover:bg-[#2fb8ff]/10'
              }`}
            >
              Demo
            </button>
          </div>

          {/* Separation Line */}
          <div className="w-[2px] h-8 bg-[#eeeeed]" />

          {/* Main Action Button (Record / Play / Pause) */}
          <button
            onClick={togglePlayPause}
            disabled={mode === 'complete'}
            className={`tactile-btn w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all text-white ${
              mode === 'recording'
                ? 'bg-[#ba1a1a] border-[#93000a] hover:bg-[#d42020]'
                : 'bg-[#58cc02] border-[#2b6c00] hover:bg-[#62e002]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {mode === 'recording' ? 'pause_circle' : 'mic'}
            </span>
          </button>

          {/* Separation Line */}
          <div className="w-[2px] h-8 bg-[#eeeeed]" />

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            disabled={mode === 'complete'}
            className="flex flex-col items-center gap-0.5 group text-[#1a1c1c]/50 hover:text-[#58cc02] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:translate-x-0.5 transition-transform duration-300">skip_next</span>
            <span className="font-bold text-[9px] uppercase tracking-wider">Skip</span>
          </button>

          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="flex flex-col items-center gap-0.5 group text-[#1a1c1c]/50 hover:text-[#ba1a1a] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform duration-300">close</span>
            <span className="font-bold text-[9px] uppercase tracking-wider">Exit</span>
          </button>

        </div>
      </nav>
    </div>
  );
}
