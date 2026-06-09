'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import { parsePdfFile } from '@/lib/pdf-parser';
import { useAuth } from '@/lib/auth-context';
import { usePaywall } from '@/lib/usePaywall';
import AppShell from '@/components/AppShell';

export default function UploadPage() {
  const router = useRouter();
  const { setPdfData, resetMetrics } = useStudySession();
  const { user } = useAuth();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showPaywall, setShowPaywall } = usePaywall();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleDismiss = () => {
    setShowPaywall(false);
    router.push('/dashboard');
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setIsUpgrading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          plan: 'monthly',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Upgrade error:', err);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error('User authentication required.');
      }

      const { storage, db } = await import('@/lib/firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      if (!storage || !db) {
        throw new Error('Firebase services are not initialized.');
      }

      // Upload file to Firebase Storage
      const timestamp = Date.now();
      const storagePath = `pdfs/${user.id}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // Store download URL in users/{uid}/pdfs/{docId}
      const pdfsCollectionRef = collection(db, 'users', user.id, 'pdfs');
      const docRef = await addDoc(pdfsCollectionRef, {
        name: file.name,
        url: downloadUrl,
        size: file.size,
        uploadedAt: serverTimestamp(),
      });

      // Parse PDF client-side
      const result = await parsePdfFile(file);

      // Attach file info to context payload
      setPdfData({
        ...result,
        pdfDocId: docRef.id,
        storageUrl: downloadUrl,
      } as any);

      resetMetrics();
      router.push('/preview');
    } catch (err: any) {
      console.error('PDF processing/upload failed:', err);
      setError(err.message || 'Failed to process PDF. Please try again.');
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
    <AppShell>
      <div className="max-w-2xl mx-auto py-8 text-center space-y-6 relative">
        {/* Paywall Lock Modal for Free Tier Users */}
        {showPaywall && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#1a1c1c]">
            <div className="bg-white border-4 border-[#E5E5E5] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_8px_0_0_#E5E5E5]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F9DB] opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              
              {/* Top Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-[#eeeeed] hover:bg-slate-200 text-[#1a1c1c]/50 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="w-20 h-20 bg-[#E8F9DB] border-2 border-[#B7EB8F] rounded-full mx-auto mb-5 flex items-center justify-center shadow-md relative animate-bounce">
                <span className="text-5xl select-none">🦝</span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#1A1C1C] tracking-tight mb-2">Limit Reached! ⚡</h2>
              <p className="text-[#5F6A59] font-bold text-xs mb-6 leading-relaxed">
                You've completed your study session! Upgrade to <strong>RETREIVE Unlimited</strong> for unlimited voice-karaoke parsing, real-time feedback, streak freezes, and weekly leaderboard access.
              </p>

              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="btn-3d w-full py-4 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white font-extrabold rounded-xl hover:bg-[#62e002] flex items-center justify-center gap-1.5 mb-3"
              >
                {isUpgrading ? (
                  <span>Preparing Checkout...</span>
                ) : (
                  <>
                    <span>Unlock Unlimited Access — $4.99/mo</span>
                    <span className="material-symbols-outlined font-bold">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Cancel/Dismiss text link */}
              <button
                onClick={handleDismiss}
                className="text-xs font-extrabold text-[#5F6A59] hover:text-[#1A1C1C] transition-colors mb-2 block mx-auto"
              >
                Maybe Later
              </button>

              <p className="text-[10px] text-[#A6A6A6] font-mono">Secure stripe billing</p>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1C1C] tracking-tight">Upload Study Material</h1>
          <p className="text-sm font-bold text-[#5F6A59] mt-1">
            Upload a PDF chapter or article to begin your voice-guided study session.
          </p>
        </div>

        {user?.tier === 'unlimited' ? (
          <div className="bg-[#E0F5FF] border-2 border-[#88ceff] rounded-2xl p-4 text-[#006590] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_2px_0_0_#88ceff]">
            <span className="text-xl">👑</span>
            <span>Unlimited Access Active: You can upload unlimited PDF files!</span>
          </div>
        ) : (
          <div className="bg-[#FFF9E0] border-2 border-[#FFE894] rounded-2xl p-4 text-[#755B00] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_2px_0_0_#FFE894]">
            <span className="text-xl">⚡</span>
            <span>Free Account: Upgrading lets you upload unlimited files.</span>
          </div>
        )}

        {error && (
          <div className="bg-[#FFDAD6] text-[#BA1A1C] p-4 border-2 border-[#FFB4AB] rounded-2xl font-bold text-sm">
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
          className={`flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging
              ? 'border-[#58CC02] bg-[#E8F9DB]/20 scale-[1.01]'
              : 'border-[#E5E5E5] bg-white hover:bg-[#FAFAF9]'
          }`}
        >
          <div className="flex flex-col items-center justify-center px-4 py-8">
            <span className="material-symbols-outlined text-5xl text-[#58CC02] mb-3 font-bold">
              cloud_upload
            </span>
            {isParsing ? (
              <p className="font-extrabold text-[#58CC02] animate-pulse text-base">
                Analyzing document contents...
              </p>
            ) : (
              <>
                <p className="mb-2 font-extrabold text-[#1A1C1C] text-base">
                  <span className="text-[#58CC02] hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs font-bold text-[#A6A6A6]">PDF up to 10MB</p>
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
        
        <div className="pt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm font-extrabold text-[#5F6A59] hover:text-[#1A1C1C] transition-colors"
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </AppShell>
  );
}
