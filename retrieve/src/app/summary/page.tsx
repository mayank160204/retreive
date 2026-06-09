'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import { calculateSessionXP, checkBadgeTriggers, BadgeTriggerCheck } from '@/lib/xp-engine';
import { enqueueWrite } from '@/lib/offline-queue';
import { useAuth } from '@/lib/auth-context';
import { usePaywall } from '@/lib/usePaywall';
import AppShell from '@/components/AppShell';
import Mascot3D from '@/components/Mascot3D';

export default function SessionSummaryPage() {
  const router = useRouter();
  const { metrics, pdfData, currentPassageIndex, activeSessionId, setActiveSessionId } = useStudySession();
  const { user } = useAuth();
  
  const [xpEarned, setXpEarned] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeTriggerCheck[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { showPaywall, setShowPaywall, checkPaywall } = usePaywall(false);
  const hasEnqueued = useRef(false);

  useEffect(() => {
    checkPaywall(true);
  }, [user, checkPaywall]);

  useEffect(() => {
    if (hasEnqueued.current) return;
    hasEnqueued.current = true;

    const currentUserId = user?.id;
    if (!currentUserId) {
      // Demo mode / unauthenticated fallback
      setXpEarned(100);
      return;
    }

    const start = new Date(Date.now() - metrics.durationSeconds * 1000);
    const end = new Date();
    const mcqTotal = metrics.mcqCorrect + metrics.mcqIncorrect;
    const mcqAcc = mcqTotal > 0 ? Math.round((metrics.mcqCorrect / mcqTotal) * 100) : 100;

    import('@/lib/db')
      .then(async ({ persistSessionResult }) => {
        try {
          const result = await persistSessionResult(currentUserId, {
            pdfName: pdfData?.fileName || 'Custom Passage.pdf',
            startedAt: start,
            completedAt: end,
            wordsRead: metrics.wordsRead,
            accuracy: metrics.accuracyPercent,
            mcqAccuracy: mcqAcc,
            mcqCorrect: metrics.mcqCorrect,
            mcqIncorrect: metrics.mcqIncorrect,
            passagesCompleted: 1,
            totalPassages: pdfData?.passages?.length || 1,
            durationMinutes: Math.max(1, Math.round(metrics.durationSeconds / 60)),
            paragraphsCompleted: [],
            lastPassageIndex: currentPassageIndex || 0,
            status: 'completed',
          }, activeSessionId || undefined);

          setXpEarned(result.xpEarned);
          setActiveSessionId(null);
          
          const badgeChecks: BadgeTriggerCheck[] = result.newBadgesAwarded.map(badgeId => ({
            badgeId,
            earned: true,
            reason: badgeId.replace(/[-_]/g, ' ')
          }));
          setUnlockedBadges(badgeChecks);
        } catch (err) {
          console.error('Failed to persist session result:', err);
        }
      });

    if (typeof window !== 'undefined') {
      localStorage.setItem('has_completed_session', 'true');
    }
  }, [metrics, user, pdfData, currentPassageIndex, activeSessionId, setActiveSessionId]);

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

  return (
    <AppShell>
      <div className="w-full flex flex-col items-center gap-10 py-6">
        
        {/* Celebration Header */}
        <header className="flex flex-col items-center text-center w-full max-w-2xl gap-4 relative">
          <div className="w-36 h-36 md:w-44 md:h-44 relative z-10 flex items-center justify-center">
            {/* Mascot celebrating */}
            <Mascot3D emotion="celebrating" className="w-full h-full absolute inset-0" />
            <div className="absolute top-0 right-0 text-3xl animate-pulse">🎉</div>
            <div className="absolute top-4 left-0 text-3xl animate-pulse">✨</div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#58CC02] leading-tight">
            Exceptional Performance, Future Physician!
          </h1>
          <p className="text-sm font-bold text-[#5F6A59] max-w-md">
            You've completed this study module with flying colors. Your retention is growing stronger!
          </p>
        </header>

        {/* Stats Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Words read card */}
          <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_0_0_#E5E5E5] hover:-translate-y-0.5 transition-transform">
            <div className="bg-[#E0F5FF] text-[#006590] w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-2xl font-bold">description</span>
            </div>
            <span className="text-3xl font-extrabold text-[#1A1C1C]">{metrics.wordsRead}</span>
            <span className="text-xs font-bold text-[#5F6A59] uppercase tracking-wider">Words Read</span>
          </div>

          {/* Accuracy card */}
          <div className="bg-[#E8F9DB] border-2 border-[#B7EB8F] rounded-2xl p-6 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_0_0_#B7EB8F] transform md:-translate-y-2 hover:-translate-y-3 transition-transform">
            <div className="bg-[#58CC02] text-white w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <span className="material-symbols-outlined text-3xl font-bold">target</span>
            </div>
            <span className="text-4xl font-extrabold text-[#2B6C00]">{Math.round(metrics.accuracyPercent)}%</span>
            <span className="text-xs font-extrabold text-[#2B6C00] uppercase tracking-wider">Recall Accuracy</span>
            <div className="w-full bg-[#B7EB8F]/40 h-2 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-[#2B6C00] h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.round(metrics.accuracyPercent)}%` }}
              />
            </div>
          </div>

          {/* XP gained card */}
          <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 flex flex-col items-center justify-center gap-1.5 shadow-[0_4px_0_0_#E5E5E5] hover:-translate-y-0.5 transition-transform relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-[#FFF9E0] text-[#755B00] border border-[#FFE894] px-3.5 py-0.5 rounded-full font-extrabold text-xs shadow-sm">+{xpEarned} XP</span>
            </div>
            <div className="bg-[#FFF9E0] text-[#755B00] w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-2xl font-bold">stars</span>
            </div>
            <span className="text-3xl font-extrabold text-[#1A1C1C]">+{xpEarned}</span>
            <span className="text-xs font-bold text-[#5F6A59] uppercase tracking-wider">XP Gained</span>
          </div>
        </section>

        {/* Milestone Rewards */}
        {unlockedBadges.length > 0 && (
          <section className="w-full max-w-4xl flex flex-col gap-4 mt-4">
            <h2 className="text-lg font-extrabold text-[#1A1C1C] flex items-center gap-2 px-2">
              <span className="material-symbols-outlined text-[#FBB724]">workspace_premium</span>
              Milestone Rewards Unlocked!
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-2 px-2 w-full custom-scrollbar">
              {unlockedBadges.map((badge, idx) => (
                <div key={idx} className="flex-shrink-0 flex flex-col items-center w-28 group cursor-pointer hover:-translate-y-0.5 transition-transform">
                  <div className="w-16 h-16 bg-[#FFF9E0] border-2 border-[#FFE894] rounded-full flex items-center justify-center shadow-[0_2px_0_0_#FFE894] mb-2">
                    <span className="text-3xl">{badge.badgeId === 'first_session' ? '🎯' : badge.badgeId === 'accuracy_master' ? '⚡' : '🏆'}</span>
                  </div>
                  <span className="text-xxs font-extrabold text-center text-[#5F6A59] leading-tight">{badge.reason}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Actions button bar */}
        <section className="w-full max-w-md flex flex-col sm:flex-row gap-4 mt-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn-3d flex-1 bg-white border-2 border-[#E5E5E5] text-[#5F6A59] font-extrabold py-3.5 px-6 rounded-xl flex justify-center items-center gap-1.5"
          >
            <span className="material-symbols-outlined font-bold text-lg">home</span>
            Dashboard
          </button>
          <button 
            onClick={() => router.push('/upload')}
            className="btn-3d flex-1 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white font-extrabold py-3.5 px-6 rounded-xl flex justify-center items-center gap-1.5"
          >
            <span className="material-symbols-outlined font-bold text-lg">play_arrow</span>
            New Session
          </button>
        </section>

      </div>

      {/* Paywall Lock Modal for Free Tier Users */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
    </AppShell>
  );
}
