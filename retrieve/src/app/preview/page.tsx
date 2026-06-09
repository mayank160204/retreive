'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import AppShell from '@/components/AppShell';
import Mascot3D from '@/components/Mascot3D';

export default function PreviewPage() {
  const router = useRouter();
  const { pdfData, setCurrentPassageIndex } = useStudySession();

  // Fallback mock passages if no PDF was uploaded yet (e.g. reload or demo mode)
  const defaultPassages = [
    {
      id: 'mock-1',
      order: 1,
      name: 'Glycolytic Flux',
      word_count: 450,
      read_time: '3m',
      yieldType: 'High Yield',
      yieldClass: 'bg-[#FFDAD6] text-[#BA1A1A] border-[#FFB4AB]',
      text: 'Glycolysis is the metabolic pathway that converts glucose into pyruvate. The free energy released in this process is used to form high-energy molecules like ATP and NADH. This passage explores the rate-limiting steps and regulation of phosphofructokinase-1...'
    },
    {
      id: 'mock-2',
      order: 2,
      name: 'Michaelis-Menten Kinetics',
      word_count: 380,
      read_time: '2m',
      yieldType: 'Medium Yield',
      yieldClass: 'bg-[#FFF9E0] text-[#755B00] border-[#FFE894]',
      text: 'The Michaelis-Menten model describes the rate of enzymatic reactions by relating reaction rate to substrate concentration. It is fundamental for understanding competitive and non-competitive inhibition in MCAT biochemistry questions...'
    },
    {
      id: 'mock-3',
      order: 3,
      name: 'Renal Clearance Mechanisms',
      word_count: 520,
      read_time: '4m',
      yieldType: 'High Yield',
      yieldClass: 'bg-[#FFDAD6] text-[#BA1A1A] border-[#FFB4AB]',
      text: 'The nephron serves as the functional unit of the kidney, managing blood filtration, reabsorption, and secretion. Understanding the osmotic gradients in the Loop of Henle is essential for kidney physiology questions...'
    },
    {
      id: 'mock-4',
      order: 4,
      name: 'Action Potential Propagation',
      word_count: 410,
      read_time: '3m',
      yieldType: 'Medium Yield',
      yieldClass: 'bg-[#FFF9E0] text-[#755B00] border-[#FFE894]',
      text: 'Nerve impulses propagate via voltage-gated ion channels. Depolarization, repolarization, and the refractory period ensure unidirectional flow of information through the central and peripheral nervous systems...'
    }
  ];

  // Map actual PDF passages if available, otherwise use mock
  const displayPassages = pdfData && pdfData.passages && pdfData.passages.length > 0
    ? pdfData.passages.map((p, idx) => ({
      id: p.id || `p-${idx}`,
      order: p.order || idx + 1,
      name: `Passage Segment ${idx + 1}`,
      word_count: p.wordCount || p.text.split(/\s+/).length,
      read_time: `${Math.max(1, Math.round((p.wordCount || p.text.split(/\s+/).length) / 150))}m`,
      yieldType: idx % 2 === 0 ? 'High Yield' : 'Medium Yield',
      yieldClass: idx % 2 === 0 ? 'bg-[#FFDAD6] text-[#BA1A1A] border-[#FFB4AB]' : 'bg-[#FFF9E0] text-[#755B00] border-[#FFE894]',
      text: p.text
    }))
    : defaultPassages;

  const handleStartSession = () => {
    setCurrentPassageIndex(0);
    router.push('/reader');
  };

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row gap-6 items-start relative">

        {/* Left Side Mascot Column */}
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 lg:sticky lg:top-24">
          <div className="w-full bg-[#E0F5FF] rounded-2xl border-4 border-[#88ceff] flex items-center justify-center relative overflow-hidden shadow-sm aspect-square max-w-[280px]">
            {/* Mascot Icon */}
            <Mascot3D emotion="idle" className="w-full h-full absolute inset-0" />

            {/* Glowing sparkles */}
            <div className="absolute top-4 left-4 text-[#88ceff] text-xl font-bold animate-pulse">✨</div>
            <div className="absolute bottom-4 right-4 text-[#88ceff] text-xl font-bold animate-pulse">✨</div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-[#58CC02]">Ready to Crush It?</h1>
            <p className="text-sm font-bold text-[#5F6A59]">
              RETREIVE has successfully analyzed the document. Review the passage segments below to ensure they look perfect for your study session.
            </p>
          </div>

          <div className="w-full p-4 bg-white rounded-2xl border-2 border-[#E5E5E5] shadow-[0_2px_0_0_#E5E5E5]">
            <div className="flex justify-between items-center mb-1.5 font-bold text-xs text-[#5F6A59]">
              <span>Analysis Status</span>
              <span className="text-[#58CC02]">100% Complete</span>
            </div>
            <div className="w-full h-4 bg-[#E5E5E5] rounded-full overflow-hidden border border-[#E5E5E5]">
              <div className="h-full w-full bg-[#58CC02] rounded-full relative" />
            </div>
          </div>
        </div>

        {/* Right Side Passage List Container */}
        <div className="w-full lg:w-2/3 bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 md:p-6 shadow-[0_4px_0_0_#E5E5E5] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#E5E5E5] pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#58CC02] text-3xl font-bold">description</span>
              <h2 className="text-xl font-extrabold text-[#1A1C1C]">Passages Extracted</h2>
            </div>
            <span className="bg-[#E0F5FF] text-[#006590] px-3.5 py-1 rounded-full font-extrabold text-xs border border-[#B3E5FF] shadow-[0_1.5px_0_0_#B3E5FF]">
              {displayPassages.length} passages
            </span>
          </div>

          {/* Scrollable List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {displayPassages.map((passage, i) => (
              <div
                key={passage.id}
                className="p-4 bg-white border-2 border-[#E5E5E5] rounded-xl hover:border-[#58CC02] transition-colors shadow-[0_2px_0_0_#E5E5E5] hover:shadow-[0_2px_0_0_#58CC02] cursor-pointer"
              >
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-extrabold text-[#58CC02]">
                      Passage {passage.order}: {passage.name}
                    </h3>
                    <div className="flex gap-3 items-center mt-1">
                      <div className="flex items-center gap-1 text-[#5F6A59] font-bold text-xxs uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm font-bold">menu_book</span>
                        <span>{passage.word_count} Words</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#5F6A59] font-bold text-xxs uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm font-bold">schedule</span>
                        <span>{passage.read_time} Est</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg font-extrabold text-xxs uppercase border ${passage.yieldClass}`}>
                    {passage.yieldType}
                  </span>
                </div>
                <p className="text-[#5F6A59] text-xs font-medium line-clamp-2 leading-relaxed">
                  {passage.text}
                </p>
              </div>
            ))}
          </div>

          {/* Sticky Actions Footer */}
          <div className="mt-6 pt-5 border-t-2 border-[#E5E5E5] flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleStartSession}
                className="btn-3d flex-1 sm:flex-none px-4 py-2.5 bg-white border-2 border-[#E5E5E5] hover:bg-[#FAFAF9] text-[#5F6A59] rounded-xl font-bold text-xs"
              >
                Edit Segments
              </button>
              <button
                onClick={() => router.push('/upload')}
                className="flex-1 sm:flex-none px-4 py-2.5 text-[#5F6A59] hover:text-[#1A1C1C] rounded-xl font-bold text-xs hover:bg-[#FAFAF9] transition-colors"
              >
                Upload Different
              </button>
            </div>

            <button
              onClick={handleStartSession}
              className="btn-3d w-full sm:w-auto px-6 py-3.5 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white rounded-xl font-extrabold text-sm hover:bg-[#62e002] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Confirm & Continue</span>
              <span className="material-symbols-outlined font-bold text-lg">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
