'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';

interface Question {
  id: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    questionText: "A 45-year-old male presents with acute severe joint pain in his right big toe. Which medication is the most appropriate initial treatment?",
    options: {
      A: "Acetaminophen",
      B: "Indomethacin",
      C: "Colchicine",
      D: "Allopurinol"
    },
    correctAnswer: 'B',
    explanation: "Acute gouty arthritis is typically treated initially with NSAIDs such as Indomethacin, assuming there are no contraindications (like renal failure or active peptic ulcer disease)."
  },
  {
    id: 2,
    questionText: "What is the primary rate-limiting enzyme of glycolysis?",
    options: {
      A: "Hexokinase",
      B: "Phosphofructokinase-1 (PFK-1)",
      C: "Pyruvate Kinase",
      D: "Glucose-6-Phosphate Dehydrogenase"
    },
    correctAnswer: 'B',
    explanation: "Phosphofructokinase-1 (PFK-1) catalyzes the phosphorylation of fructose-6-phosphate to fructose-1,6-bisphosphate, which is the key rate-limiting and committed step of glycolysis."
  },
  {
    id: 3,
    questionText: "A patient presents with metabolic acidosis and a high anion gap. Which of the following is a potential cause?",
    options: {
      A: "Severe Diarrhea",
      B: "Renal Tubular Acidosis",
      C: "Diabetic Ketoacidosis (DKA)",
      D: "Pancreatic Fistula"
    },
    correctAnswer: 'C',
    explanation: "Diabetic ketoacidosis (DKA) leads to accumulation of beta-hydroxybutyrate and acetoacetate (ketoacids), which consume bicarbonate, resulting in a high anion gap metabolic acidosis."
  },
  {
    id: 4,
    questionText: "Which of the following cellular changes is characteristic of irreversible cell injury?",
    options: {
      A: "Cellular Swelling",
      B: "Ribosome Detachment",
      C: "Karyorrhexis",
      D: "Fatty Change"
    },
    correctAnswer: 'C',
    explanation: "Irreversible cell injury is characterized by severe membrane damage, calcium influx, and nuclear changes like karyorrhexis (fragmentation), pyknosis (condensation), or karyolysis (dissolution)."
  },
  {
    id: 5,
    questionText: "Which phase of the cardiac action potential is primarily mediated by the influx of calcium ions through L-type calcium channels?",
    options: {
      A: "Phase 0",
      B: "Phase 1",
      C: "Phase 2 (Plateau Phase)",
      D: "Phase 3"
    },
    correctAnswer: 'C',
    explanation: "Phase 2 (the plateau phase) of the cardiac action potential is characterized by a balance between the inward calcium current (via L-type Ca2+ channels) and outward potassium currents."
  }
];

export default function QuizPage() {
  const router = useRouter();
  const { updateMetrics } = useStudySession();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isGraded, setIsGraded] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleOptionClick = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isGraded) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isGraded) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setIsGraded(true);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      updateMetrics({ mcqCorrect: correctCount + 1 });
    } else {
      setIncorrectCount((prev) => prev + 1);
      updateMetrics({ mcqIncorrect: incorrectCount + 1 });
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsGraded(false);
    } else {
      router.push('/summary');
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col font-sans selection:bg-[#58cc02] selection:text-white overflow-x-hidden relative pb-[120px]">
      
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#0f0f0f]/80 backdrop-blur-md flex justify-between items-center h-20 px-6 max-w-5xl mx-auto border-b border-white/10">
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
          
          <div className="flex-grow px-4">
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative">
              <div 
                className="absolute inset-0 bg-[#58cc02] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 font-bold text-[#58cc02] shrink-0 ml-4">
          <span className="material-symbols-outlined fill-current">favorite</span>
          <span>5</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 py-8 flex flex-col items-center relative z-10">
        
        {/* Question Heading */}
        <div className="w-full text-center mb-8 animate-fade-in">
          <span className="text-xs uppercase tracking-widest text-[#58cc02] font-semibold mb-2 block">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            {currentQuestion.questionText}
          </h1>
        </div>

        {/* Options Area */}
        <div className="w-full grid gap-4 mb-8">
          {(Object.keys(currentQuestion.options) as Array<'A' | 'B' | 'C' | 'D'>).map((optionKey) => {
            const optionText = currentQuestion.options[optionKey];
            const isSelected = selectedOption === optionKey;
            const isCorrectAnswer = currentQuestion.correctAnswer === optionKey;
            
            let cardStyle = "border-white/10 bg-white/5 hover:bg-white/10";
            let checkIcon = null;

            if (isGraded) {
              if (isCorrectAnswer) {
                cardStyle = "border-[#58cc02] bg-[#58cc02]/10 text-white font-semibold";
                checkIcon = <span className="material-symbols-outlined text-[#58cc02] fill-current">check_circle</span>;
              } else if (isSelected) {
                cardStyle = "border-red-500 bg-red-500/10 text-white line-through";
                checkIcon = <span className="material-symbols-outlined text-red-500">cancel</span>;
              } else {
                cardStyle = "border-white/5 bg-white/5 opacity-50";
              }
            } else if (isSelected) {
              cardStyle = "border-[#58cc02] bg-white/10 text-white";
            }

            return (
              <button
                key={optionKey}
                disabled={isGraded}
                onClick={() => handleOptionClick(optionKey)}
                className={`w-full p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-200 transform active:scale-[0.99] ${cardStyle}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                    isGraded && isCorrectAnswer ? 'bg-[#58cc02] text-black' : isSelected ? 'bg-white text-black' : 'bg-white/5 text-slate-400'
                  }`}>
                    {optionKey}
                  </div>
                  <span className="text-lg text-slate-200">{optionText}</span>
                </div>
                {checkIcon}
              </button>
            );
          })}
        </div>

        {/* Feedback Raccoon Nudge Card */}
        {isGraded && (
          <div className="w-full flex flex-col md:flex-row items-center gap-6 bg-yellow-500/5 p-6 rounded-3xl border-2 border-yellow-500/15 animate-slide-up">
            <div className="w-28 h-28 flex-shrink-0 relative animate-pulse-glow">
              <img 
                alt="Encouraging Raccoon Mascot" 
                className="w-full h-full object-contain drop-shadow-xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1Y8MF3z0lec_iBNfxnSsse__32KANWIYXBaOOxLzAlM6xQ0JRAtfq0DUgiYZlkeLF5-es3vONsP2jKpNy_KpogjxAUbnSWkTIg7Ks_nmM3RYx_FGEDjxg344RzoZd876zzRLnalnUypdQ0OJbehZ58Scwf1DoC9EF4YU2m-VIZ5Pks5nS5x6PfwNASmeDadMBlODa9XGdxikuO2OonwpbrP1mDawaq9aKmXEU_0ptTdEE-o8VlcP6CDRQQ3yYpv1KbNqMDYJpGgs"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-yellow-500 font-bold uppercase tracking-wider text-xs mb-1">
                <span className="material-symbols-outlined text-sm">lightbulb</span>
                High-Yield Explanation
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {selectedOption === currentQuestion.correctAnswer ? "Raccoon Celebrates! 🎉" : "The Raccoon Remembers... 💡"}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Footer Check/Next Button Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#0f0f0f] border-t-2 border-white/10 py-4 px-6 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          
          <button 
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex((prev) => prev - 1);
                setSelectedOption(null);
                setIsGraded(false);
              }
            }}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3.5 rounded-full font-bold transition-all border border-white/10 ${
              currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed text-slate-500' : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            PREVIOUS
          </button>

          {!isGraded ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`px-8 py-3.5 rounded-full font-bold shadow-[0_4px_0_#2b6c00] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 ${
                selectedOption ? 'bg-[#58cc02] text-black hover:bg-[#58cc02]/95' : 'bg-white/10 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              CHECK ANSWER
              <span className="material-symbols-outlined font-bold">check</span>
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="px-8 py-3.5 rounded-full bg-[#58cc02] text-black font-bold shadow-[0_4px_0_#2b6c00] active:translate-y-1 active:shadow-none hover:bg-[#58cc02]/95 transition-all flex items-center gap-2"
            >
              {currentQuestionIndex === quizQuestions.length - 1 ? 'FINISH SESSION' : 'NEXT QUESTION'}
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          )}

        </div>
      </footer>

    </div>
  );
}
