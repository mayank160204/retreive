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

  // Active Session ID
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;

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
  const [pdfData, setPdfDataState] = useState<PdfParseResult | null>(null);
  const [currentPassageIndex, setCurrentPassageIndexState] = useState(0);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<StudyMetrics>(defaultMetrics);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const storedPdf = localStorage.getItem('retreive_pdf_data');
      if (storedPdf) {
        setPdfDataState(JSON.parse(storedPdf));
      }
      const storedIndex = localStorage.getItem('retreive_current_passage_index');
      if (storedIndex) {
        setCurrentPassageIndexState(parseInt(storedIndex, 10));
      }
      const storedSessionId = localStorage.getItem('retreive_active_session_id');
      if (storedSessionId) {
        setActiveSessionIdState(storedSessionId);
      }
      const storedMetrics = localStorage.getItem('retreive_metrics');
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      }
    } catch (e) {
      console.error('Error loading study session from localStorage:', e);
    }
  }, []);

  const setPdfData = (data: PdfParseResult | null) => {
    setPdfDataState(data);
    try {
      if (data) {
        localStorage.setItem('retreive_pdf_data', JSON.stringify(data));
      } else {
        localStorage.removeItem('retreive_pdf_data');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setCurrentPassageIndex = (index: number) => {
    setCurrentPassageIndexState(index);
    try {
      localStorage.setItem('retreive_current_passage_index', index.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const setActiveSessionId = (id: string | null) => {
    setActiveSessionIdState(id);
    try {
      if (id) {
        localStorage.setItem('retreive_active_session_id', id);
      } else {
        localStorage.removeItem('retreive_active_session_id');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateMetrics = (newMetrics: Partial<StudyMetrics>) => {
    setMetrics((prev) => {
      const updated = { ...prev, ...newMetrics };
      try {
        localStorage.setItem('retreive_metrics', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const resetMetrics = () => {
    const fresh = { ...defaultMetrics, startTime: Date.now() };
    setMetrics(fresh);
    try {
      localStorage.setItem('retreive_metrics', JSON.stringify(fresh));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        pdfData,
        setPdfData,
        currentPassageIndex,
        setCurrentPassageIndex,
        activeSessionId,
        setActiveSessionId,
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
