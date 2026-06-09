'use client';

import React, { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import { parsePdfFile } from '@/lib/pdf-parser';
import { useAuth } from '@/lib/auth-context';
import { usePaywall } from '@/lib/usePaywall';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { setPdfData, resetMetrics } = useStudySession();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { showPaywall, setShowPaywall, checkPaywall } = usePaywall();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUploadClick = () => {
    if (checkPaywall()) return;
    fileInputRef.current?.click();
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setIsParsing(true);
    try {
      const result = await parsePdfFile(file);
      setPdfData(result);
      resetMetrics();
      router.push('/preview');
    } catch (err) {
      console.error('PDF parsing failed:', err);
      alert('Failed to parse PDF. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: 'home' },
    { name: 'Leaderboard', path: '/leaderboard', icon: 'leaderboard' },
    { name: 'Upload', path: '/upload', icon: 'add_circle', isCenter: true },
    { name: 'Badges', path: '/badges', icon: 'workspace_premium' },
    { name: 'Profile', path: '/profile', icon: 'person' },
  ];

  return (
    <>
      {isParsing && (
        <div className="fixed inset-0 bg-[#1a1c1c]/45 z-[9999] flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <div className="bg-white text-[#1a1c1c] p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 border-2 border-[#eeeeed]">
            <span className="material-symbols-outlined text-4xl text-[#58cc02] animate-bounce">cloud_upload</span>
            <p className="font-extrabold text-sm animate-pulse">Analyzing document...</p>
          </div>
        </div>
      )}

      {/* Paywall Lock Modal for Free Tier Users */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#1a1c1c]">
          <div className="bg-white border-4 border-[#E5E5E5] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_8px_0_0_#E5E5E5]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F9DB] opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            {/* Top Close Button */}
            <button
              onClick={() => setShowPaywall(false)}
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
              onClick={() => setShowPaywall(false)}
              className="text-xs font-extrabold text-[#5F6A59] hover:text-[#1A1C1C] transition-colors mb-2 block mx-auto"
            >
              Maybe Later
            </button>

            <p className="text-[10px] text-[#A6A6A6] font-mono">Secure stripe billing</p>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#E5E5E5] px-4 py-2 z-50 flex justify-around items-center md:max-w-xl md:mx-auto md:rounded-t-2xl md:border-x-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={handleUploadClick}
                disabled={isParsing}
                className="flex flex-col items-center justify-center -translate-y-4 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
              >
                <div className="w-14 h-14 bg-[#58CC02] border-b-4 border-[#2B6C00] rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-3xl font-bold">add</span>
                </div>
                <span className="text-xs font-bold text-[#5F6A59] mt-1">{item.name}</span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#58CC02] scale-105 font-bold' : 'text-[#5F6A59] hover:text-[#1A1C1C]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="text-xs mt-0.5">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
