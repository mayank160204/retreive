'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import { parsePdfFile } from '@/lib/pdf-parser';

export default function UploadPage() {
  const router = useRouter();
  const { setPdfData, resetMetrics } = useStudySession();
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const result = await parsePdfFile(file);
      setPdfData(result);
      resetMetrics();
      router.push('/reader');
    } catch (err) {
      console.error('PDF parsing failed:', err);
      setError('Failed to parse PDF. Please try a different file.');
      setIsParsing(false);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    []
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-md">
      <div className="max-w-2xl w-full text-center space-y-md">
        <h1 className="font-headline-lg text-on-background">Upload Study Material</h1>
        <p className="font-body-md text-on-surface-variant">
          Upload a PDF chapter or article to begin your voice-guided study session.
        </p>

        {error && (
          <div className="bg-error-container text-on-error-container p-sm rounded-md font-body-md">
            {error}
          </div>
        )}

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary-container/10'
              : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <span className="material-symbols-outlined text-4xl text-primary mb-3">
              upload_file
            </span>
            {isParsing ? (
              <p className="font-label-bold text-primary animate-pulse">
                Parsing document...
              </p>
            ) : (
              <>
                <p className="mb-2 font-label-bold text-on-surface">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-on-surface-variant">PDF up to 10MB</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={onFileChange}
            disabled={isParsing}
          />
        </label>
        
        <div className="mt-xl">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary font-label-bold hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
