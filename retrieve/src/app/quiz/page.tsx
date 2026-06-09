'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';

import { generateQuestionsForPassage, Question } from '@/lib/question-generator';
import Mascot3D from '@/components/Mascot3D';
import MascotChat from '@/components/MascotChat';

export default function QuizPage() {
  const router = useRouter();
  const { pdfData, currentPassageIndex, metrics, updateMetrics } = useStudySession();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isGraded, setIsGraded] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      let text = '';
      if (pdfData && pdfData.passages[currentPassageIndex]) {
        text = pdfData.passages[currentPassageIndex].text;
      }

      const acc = metrics && (metrics.mcqCorrect + metrics.mcqIncorrect > 0)
        ? (metrics.mcqCorrect / (metrics.mcqCorrect + metrics.mcqIncorrect)) * 100
        : 100;

      const calculatedWpm = metrics && metrics.durationSeconds > 0
        ? Math.round((metrics.wordsRead / metrics.durationSeconds) * 60)
        : 150;

      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            passageText: text,
            accuracyPercent: acc,
            wpm: calculatedWpm,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length >= 5) {
            setQuestions(data.questions.slice(0, 5));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Llama MCQ generation failed, falling back to local template:', err);
      }

      // Fallback local questions
      const generated = generateQuestionsForPassage(text);
      setQuestions(generated);
      setIsLoading(false);
    }

    fetchQuestions();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsGraded(false);
    setCorrectCount(0);
    setIncorrectCount(0);
  }, [pdfData, currentPassageIndex]);

  if (isLoading || questions.length === 0) {
    return (
      <div className="bg-[#FAFAF9] text-[#1A1C1C] min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-[#58cc02] animate-bounce">school</span>
          <p className="font-extrabold text-sm animate-pulse text-[#5F6A59]">Analyzing passage and crafting your personalized quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionClick = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isGraded) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isGraded) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsGraded(true);

    if (isCorrect) {
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      updateMetrics({ mcqCorrect: nextCorrect });
    } else {
      const nextIncorrect = incorrectCount + 1;
      setIncorrectCount(nextIncorrect);
      updateMetrics({ mcqIncorrect: nextIncorrect });
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsGraded(false);
    } else {
      router.push('/summary');
    }
  };

  // Determine footer styling based on answer state
  const isAnswerCorrect = selectedOption === currentQuestion.correctAnswer;
  let footerClass = "bg-white border-[#E5E5E5]";
  if (isGraded) {
    footerClass = isAnswerCorrect 
      ? "bg-[#E8F9DB] border-[#B7EB8F]" 
      : "bg-[#FFDAD6] border-[#FFB4AB]";
  }

  return (
    <div className="bg-[#FAFAF9] text-[#1A1C1C] min-h-screen flex flex-col font-sans overflow-x-hidden relative pb-[140px]">
      
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-white border-b-4 border-[#E5E5E5] flex justify-between items-center h-16 px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-[#E5E5E5] hover:bg-[#FAFAF9] transition-all shadow-[0_2px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-none"
          >
            <span className="material-symbols-outlined text-[#5F6A59] font-bold">close</span>
          </button>
          
          <div className="flex-grow px-2">
            <div className="h-4 w-full bg-[#E5E5E5] rounded-full overflow-hidden border border-[#E5E5E5] relative">
              <div 
                className="absolute inset-y-0 left-0 bg-[#58CC02] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 font-extrabold text-[#BA1A1A] shrink-0 ml-4">
          <span className="material-symbols-outlined text-xl">favorite</span>
          <span>5</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 py-8 flex flex-col relative z-10">
        
        {/* Question Heading */}
        <div className="w-full text-center mb-8 animate-fade-in">
          <span className="text-xs uppercase tracking-widest text-[#58CC02] font-extrabold mb-1.5 block">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1A1C1C] leading-snug">
            {currentQuestion.questionText}
          </h1>
        </div>

        {/* Options Area */}
        <div className="w-full grid gap-3.5 mb-8">
          {(Object.keys(currentQuestion.options) as Array<'A' | 'B' | 'C' | 'D'>).map((optionKey) => {
            const optionText = currentQuestion.options[optionKey];
            const isSelected = selectedOption === optionKey;
            const isCorrectAnswer = currentQuestion.correctAnswer === optionKey;
            
            let btnStyle = "border-[#E5E5E5] bg-white text-[#1A1C1C] hover:bg-[#FAFAF9] shadow-[0_2px_0_0_#E5E5E5]";
            let badgeStyle = "bg-white border-2 border-[#E5E5E5] text-[#5F6A59]";
            let checkIcon = null;

            if (isGraded) {
              if (isCorrectAnswer) {
                btnStyle = "border-[#58CC02] bg-[#E8F9DB] text-[#2B6C00] shadow-[0_2px_0_0_#58CC02]";
                badgeStyle = "bg-[#58CC02] text-white border-b-2 border-[#2B6C00]";
                checkIcon = <span className="material-symbols-outlined text-[#58CC02] font-bold">check_circle</span>;
              } else if (isSelected) {
                btnStyle = "border-[#BA1A1A] bg-[#FFDAD6] text-[#BA1A1A] shadow-[0_2px_0_0_#BA1A1A]";
                badgeStyle = "bg-[#BA1A1A] text-white border-b-2 border-[#690005]";
                checkIcon = <span className="material-symbols-outlined text-[#BA1A1A] font-bold">cancel</span>;
              } else {
                btnStyle = "border-[#E5E5E5] bg-white opacity-40";
              }
            } else if (isSelected) {
              btnStyle = "border-[#58CC02] bg-[#E8F9DB] text-[#2B6C00] shadow-[0_2px_0_0_#58CC02]";
              badgeStyle = "bg-[#58CC02] text-white border-b-2 border-[#2B6C00]";
            }

            return (
              <button
                key={optionKey}
                disabled={isGraded}
                onClick={() => handleOptionClick(optionKey)}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all active:translate-y-[2px] active:shadow-none ${btnStyle}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${badgeStyle}`}>
                    {optionKey}
                  </div>
                  <span className="text-base font-bold leading-tight">{optionText}</span>
                </div>
                {checkIcon}
              </button>
            );
          })}
        </div>

        {isGraded && (
          <div className="w-full flex flex-col md:flex-row items-center gap-6 bg-white border-2 border-[#E5E5E5] p-5 rounded-2xl shadow-[0_4px_0_0_#E5E5E5] animate-slide-up">
            <div className="w-20 h-20 bg-[#E8F9DB] rounded-2xl border-2 border-[#b7eb8f] flex items-center justify-center relative overflow-hidden shadow-sm aspect-square shrink-0">
              <Mascot3D emotion={selectedOption === currentQuestion.correctAnswer ? "winner" : "sad"} className="w-full h-full absolute inset-0" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="inline-flex items-center gap-1 bg-[#FFF9E0] text-[#755B00] border border-[#FFE894] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider text-[10px] mb-2">
                <span className="material-symbols-outlined text-xs font-bold">lightbulb</span>
                High-Yield Explanation
              </div>
              <h3 className="text-base font-extrabold text-[#1A1C1C] mb-1">
                {selectedOption === currentQuestion.correctAnswer ? "Scratten Celebrates! 🎉" : "Scratten's Tutoring Nudge... 💡"}
              </h3>
              <p className="text-[#5F6A59] text-xs font-bold leading-relaxed mb-3">
                {currentQuestion.explanation}
              </p>
              
              <button
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white hover:bg-[#62e002] rounded-xl font-extrabold text-[10px] active:translate-y-[2px] active:border-b-0 transition-all shadow-sm uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-xs font-bold">chat</span>
                Ask Scratten 🐿️
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Check/Next Button Bar */}
      <footer className={`fixed bottom-0 left-0 w-full border-t-4 py-6 px-6 z-50 transition-colors duration-300 ${footerClass}`}>
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          
          <button 
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex((prev) => prev - 1);
                setSelectedOption(null);
                setIsGraded(false);
              }
            }}
            disabled={currentQuestionIndex === 0 || isGraded}
            className={`px-5 py-3 rounded-xl font-extrabold text-xs transition-all border-2 border-[#E5E5E5] border-b-4 bg-white text-[#5F6A59] active:translate-y-[2px] active:border-b-2 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            PREVIOUS
          </button>

          {!isGraded ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`btn-3d px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-1.5 ${
                selectedOption 
                  ? 'bg-[#58CC02] border-b-4 border-[#2B6C00] text-white hover:bg-[#62e002] active:translate-y-1 active:border-b-0' 
                  : 'bg-[#E5E5E5] text-[#A6A6A6] cursor-not-allowed border-bottom-0'
              }`}
            >
              CHECK ANSWER
              <span className="material-symbols-outlined font-bold text-lg">check</span>
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={`btn-3d px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-1.5 ${
                isAnswerCorrect 
                  ? 'bg-[#58CC02] border-b-4 border-[#2B6C00] text-white hover:bg-[#62e002]' 
                  : 'bg-[#BA1A1A] border-b-4 border-[#690005] text-white hover:bg-[#c92424]'
              }`}
            >
              <span>{currentQuestionIndex === questions.length - 1 ? 'FINISH SESSION' : 'NEXT QUESTION'}</span>
              <span className="material-symbols-outlined font-bold text-lg">arrow_forward</span>
            </button>
          )}

        </div>
      </footer>

      {/* Mascot Chat Assistant drawer overlay */}
      <MascotChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        passageText={pdfData?.passages?.[currentPassageIndex]?.text || ""}
        question={currentQuestion}
        selectedOption={selectedOption}
        correctOption={currentQuestion.correctAnswer}
        explanation={currentQuestion.explanation}
      />

    </div>
  );
}
