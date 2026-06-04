'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import { normalizeText } from '@/lib/pdf-parser';
import { getDeepgramClient } from '@/lib/deepgram-client';

export default function ReaderPage() {
  const router = useRouter();
  const { pdfData, currentPassageIndex, metrics, updateMetrics } = useStudySession();
  
  const [isRecording, setIsRecording] = useState(false);
  const [matchedWordsCount, setMatchedWordsCount] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());
  
  const passageWords = useRef<{ word: string; norm: string; elementId: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const deepgramClient = useRef<ReturnType<typeof getDeepgramClient> | null>(null);

  // Initialize passage
  useEffect(() => {
    if (!pdfData || pdfData.passages.length === 0) {
      // For testing without upload
      const dummyText = "The pathophysiology of acute myocardial infarction involves the sudden occlusion of a coronary artery, leading to a profound reduction in regional blood flow. This abrupt cessation of oxygen delivery initiates a cascade of cellular events, beginning with rapid depletion of ATP reserves and progressing toward irreversible occlusion and subsequent myocardial necrosis.";
      const words = dummyText.split(/(\s+)/).filter(w => w.trim().length > 0);
      passageWords.current = words.map((w, i) => ({ word: w, norm: normalizeText(w), elementId: i }));
      setTotalWords(words.length);
    } else {
      const text = pdfData.passages[currentPassageIndex].text;
      const words = text.split(/(\s+)/).filter(w => w.trim().length > 0);
      passageWords.current = words.map((w, i) => ({ word: w, norm: normalizeText(w), elementId: i }));
      setTotalWords(words.length);
    }
  }, [pdfData, currentPassageIndex]);

  // Deepgram integration
  useEffect(() => {
    if (!isRecording) {
      if (deepgramClient.current) {
        deepgramClient.current.stop();
        deepgramClient.current = null;
      }
      return;
    }

    const client = getDeepgramClient();
    deepgramClient.current = client;

    const onTranscript = (spokenWords: string[]) => {
      const normalizedSpoken = spokenWords.map((w) => normalizeText(w));

      setHighlightedWords((prev) => {
        const next = new Set(prev);
        let newMatchCount = next.size;

        passageWords.current.forEach((pw) => {
          if (!next.has(pw.elementId) && normalizedSpoken.includes(pw.norm)) {
            next.add(pw.elementId);
            newMatchCount++;
            
            // Scroll element into view
            const el = document.getElementById(`word-${pw.elementId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });

        setMatchedWordsCount(newMatchCount);

        // Auto-complete at 90%
        if (newMatchCount >= passageWords.current.length * 0.9) {
          setIsRecording(false);
          updateMetrics({
             accuracyPercent: (newMatchCount / passageWords.current.length) * 100,
             wordsRead: newMatchCount,
             durationSeconds: (Date.now() - metrics.startTime) / 1000
          });
          setTimeout(() => router.push('/quiz'), 1000);
        }

        return next;
      });
    };

    const onError = (err: string) => {
      console.error('Deepgram Error:', err);
      setIsRecording(false);
    };

    client.start('mock-id-token', onTranscript, onError).catch(console.error);

    return () => {
      client.stop();
    };
  }, [isRecording, router, updateMetrics]); // React hook deps

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSkip = () => {
    setIsRecording(false);
    updateMetrics({
      accuracyPercent: 100,
      wordsRead: totalWords,
      durationSeconds: (Date.now() - metrics.startTime) / 1000
    });
    router.push('/quiz');
  };

  const exitSession = () => {
    router.push('/dashboard');
  };

  const progressPercent = totalWords > 0 ? Math.min(100, Math.round((matchedWordsCount / totalWords) * 100)) : 0;

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleRecording();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording]);

  return (
    <div className="bg-surface text-on-surface font-body-md h-screen w-full overflow-hidden flex flex-col selection:bg-primary-container selection:text-on-primary-container relative">
      <header className="fixed top-8 left-8 z-30 flex flex-col gap-2">
        <span className="font-label-bold text-primary tracking-[0.2em] uppercase">Reader</span>
        <h2 className="font-headline-lg text-on-surface">Practice Session</h2>
      </header>

      <main className="relative flex-1 flex justify-center items-start overflow-y-auto pt-[180px] pb-[160px] px-margin-mobile md:px-margin-desktop" style={{ scrollbarWidth: 'none' }}>
        <div className="w-full max-w-[800px] flex gap-12 relative" ref={containerRef}>
          <aside className="hidden xl:flex flex-col items-center sticky top-0 h-fit pt-12 animate-pulse-glow">
            <div className="bg-surface-container-highest border-2 border-outline-variant p-4 rounded-xl rounded-br-none mb-4 w-48 shadow-sm relative">
              <p className="font-body-md text-on-surface text-sm">Focus on the highlighted terms! You're doing great.</p>
            </div>
            <div className="w-24 h-24 bg-secondary-fixed rounded-full border-4 border-secondary-container flex items-center justify-center overflow-hidden shadow-lg">
              <img alt="Mascot" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUtFogP8GIrwXBYnvZMS3Z51bS-5STpMNyEM2Byy9p-dVbrbmZSvMh-6qgFCYd88Q27HGarXIs1fDYqqPkaEifdw6T6vo17SOYq21qpRfcLtiV3jlxVFkPpxcuK4eCbmFUMLXkVoC3jT2F0FGOW85neTDoY12Na3qFWANepYzYAI8u7OSENGXQH4alNcdm2Z50NJAwaYAaeIYXIQUYMVsV10gOsQxnd1_e76vWJPNAQSGq8rMjvLRd01GtYYzJwcdrxD6p9_bo4ZGE" />
            </div>
          </aside>

          <article className="flex-1 animate-fade-in">
            <div className="flex flex-col gap-10 text-on-surface font-headline-md text-headline-md leading-relaxed">
              <p className="transition-all duration-300">
                {passageWords.current.map((pw) => {
                  const isHighlighted = highlightedWords.has(pw.elementId);
                  return (
                    <span 
                      key={pw.elementId} 
                      id={`word-${pw.elementId}`}
                      className={`transition-colors duration-200 ${isHighlighted ? 'bg-[#58cc02] text-white rounded-lg px-2 py-1 shadow-[0_4px_0_#2b6c00] inline-block animate-bounce-spring' : ''}`}
                    >
                      {pw.word}{' '}
                    </span>
                  );
                })}
              </p>
            </div>
          </article>

          <aside className="hidden md:flex flex-col items-center gap-4 sticky top-12 h-fit">
            <div className="font-label-bold text-[10px] text-on-surface-variant uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>XP Progress</div>
            <div className="relative w-4 h-[400px] bg-[#eeeeed] rounded-full border-2 border-[#becbb1] overflow-hidden shadow-inner">
              <div 
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#58cc02] to-[#a3ff6e] transition-all duration-500 ease-out"
                style={{ height: `${progressPercent}%` }}
              >
                <div className="absolute top-[-5px] left-0 w-full h-[10px] bg-[#87fe45] rounded-full opacity-80"></div>
              </div>
            </div>
            <div className="font-label-bold text-primary">{progressPercent}%</div>
          </aside>
        </div>
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-surface-container-lowest border-2 border-surface-container-high rounded-full shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] px-8 py-3 flex items-center gap-12 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">speed</span>
            <div className="flex items-center gap-1">
              <button className="w-10 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-secondary-container text-on-secondary-container border-b-2 border-secondary">1x</button>
            </div>
          </div>
          
          <button 
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all ${isRecording ? 'bg-error border-[#93000a] text-on-error border-b-4' : 'bg-primary border-primary-container text-on-primary border-b-4'}`}
          >
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isRecording ? 'pause_circle' : 'mic'}
            </span>
          </button>

          <button 
            onClick={handleSkip} 
            className="flex flex-col items-center gap-0.5 group text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform duration-300">skip_next</span>
            <span className="font-label-bold text-[10px] uppercase">Skip</span>
          </button>

          <button onClick={exitSession} className="flex flex-col items-center gap-0.5 group text-on-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform duration-300">close</span>
            <span className="font-label-bold text-[10px] uppercase">Exit</span>
          </button>
        </div>
      </nav>

      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-surface to-transparent pointer-events-none z-20"></div>
      <div className="fixed bottom-0 left-0 w-full h-48 bg-gradient-to-t from-surface to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
