'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { PdfParseResult } from '@/lib/pdf-parser';

export interface StudyMetrics {
  startTime: number;
  durationSeconds: number;
  wordsRead: number;
  accuracyPercent: number;
  mcqCorrect: number;
  mcqIncorrect: number;
}

interface StudyContextType {
  // PDF Data
  pdfData: PdfParseResult | null;
  setPdfData: (data: PdfParseResult | null) => void;
  
  // Active Passage (for the reader)
  currentPassageIndex: number;
  setCurrentPassageIndex: (index: number) => void;

  // Study Metrics
  metrics: StudyMetrics;
  updateMetrics: (newMetrics: Partial<StudyMetrics>) => void;
  resetMetrics: () => void;
}

const defaultMetrics: StudyMetrics = {
  startTime: 0,
  durationSeconds: 0,
  wordsRead: 0,
  accuracyPercent: 0,
  mcqCorrect: 0,
  mcqIncorrect: 0,
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [pdfData, setPdfData] = useState<PdfParseResult | null>(null);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [metrics, setMetrics] = useState<StudyMetrics>(defaultMetrics);

  const updateMetrics = (newMetrics: Partial<StudyMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...newMetrics }));
  };

  const resetMetrics = () => {
    setMetrics({ ...defaultMetrics, startTime: Date.now() });
  };

  return (
    <StudyContext.Provider
      value={{
        pdfData,
        setPdfData,
        currentPassageIndex,
        setCurrentPassageIndex,
        metrics,
        updateMetrics,
        resetMetrics,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudySession() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudySession must be used within a StudyProvider');
  }
  return context;
}
