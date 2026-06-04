'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStudySession } from '@/lib/study-context';
import { calculateSessionXP, checkBadgeTriggers, BadgeTriggerCheck } from '@/lib/xp-engine';
import { enqueueWrite } from '@/lib/offline-queue';
import { useAuth } from '@/lib/auth-context';

export default function SessionSummaryPage() {
  const router = useRouter();
  const { metrics } = useStudySession();
  const { user } = useAuth();
  
  const [xpEarned, setXpEarned] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeTriggerCheck[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const hasEnqueued = useRef(false);

  useEffect(() => {
    if (hasEnqueued.current) return;
    hasEnqueued.current = true;

    const currentUserId = user?.id || 'demo-user';

    // 1. Calculate Real XP
    const xpBreakdown = calculateSessionXP({
      wordsRead: metrics.wordsRead,
      accuracyPercent: metrics.accuracyPercent,
      durationSeconds: metrics.durationSeconds,
      mcqCorrect: metrics.mcqCorrect,
      mcqIncorrect: metrics.mcqIncorrect,
      currentStreak: 12, // hardcoded for demo
      isFirstSessionToday: true, 
    });

    setXpEarned(xpBreakdown.totalXP);

    // 2. Enqueue Session Complete
    enqueueWrite({
      type: 'complete_session',
      payload: {
        sessionId: `session-${Date.now()}`,
        userId: currentUserId,
        data: {
          wordsRead: metrics.wordsRead,
          accuracy: metrics.accuracyPercent,
          duration: metrics.durationSeconds,
          xpEarned: xpBreakdown.totalXP,
        },
      },
    });

    // 3. Enqueue Streak & XP Update
    enqueueWrite({ type: 'update_streak', payload: { userId: currentUserId } });
    enqueueWrite({ type: 'add_xp', payload: { userId: currentUserId, xp: xpBreakdown.totalXP, reason: 'Session Completion' } });

    // 4. Check & Award Badges
    const badges = checkBadgeTriggers({
      totalWordsEver: 15000 + metrics.wordsRead,
      totalSessionsEver: 12,
      currentStreak: 12,
      currentLevel: Math.floor(840 / 500) + 1,
      sessionAccuracy: metrics.accuracyPercent,
      sessionWords: metrics.wordsRead,
      mcqCorrect: metrics.mcqCorrect,
      mcqTotal: metrics.mcqCorrect + metrics.mcqIncorrect,
    });

    setUnlockedBadges(badges);

    badges.forEach(badge => {
      enqueueWrite({ type: 'award_badge', payload: { userId: currentUserId, badgeId: badge.badgeId } });
    });
  }, [metrics, user]);

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
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col items-center gap-12">
        <header className="flex flex-col items-center text-center w-full max-w-2xl gap-6 relative animate-slide-up">
          <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
            {/* Confetti simulation elements could go here */}
          </div>
          
          <div className="absolute -top-12 -left-8 w-16 h-16 bg-tertiary-fixed rounded-full opacity-50 blur-xl"></div>
          <div className="absolute top-12 -right-12 w-24 h-24 bg-secondary-fixed rounded-full opacity-50 blur-xl"></div>
          
          <div className="w-48 h-48 md:w-64 md:h-64 relative z-10 animate-bounce-spring">
            <img alt="Mascot celebrating" className="w-full h-full object-cover rounded-full border-4 border-surface shadow-[0_8px_24px_rgba(43,108,0,0.15)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4jkIjA0nEIsv2Z5aYv9rMMNmaDoCJrW_flDPsHPHBd5nRu3lxe1Tn4-kasXUVF7mr3dWBkPtWFT_dluQCYbLQXFaAxRjUPV5ODyOIToEHof8XUzxuBca8GA-ONIKlHim8ZvAl8LG9puuqBOQsNPT22GIUdySKpU6752lr_n8SIaF5Dv4q6OL4goUEjAHRHFQhXtY7redpmdyZc4cEB-hSvAiZwg-4y6drPpP8_3M3nXNaRh4iXBZiNRwDyTqPgusRnNjDNPVsV6lj" />
          </div>
          
          <h1 className="font-headline-lg-mobile md:font-headline-xl text-primary mt-4 z-10">
            Exceptional Performance, Future Physician.
          </h1>
          <p className="font-body-lg text-on-surface-variant z-10">
            You've completed this module with flying colors. Your brain is getting stronger!
          </p>
        </header>

        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
          <div className="bg-surface-bright border-2 border-surface-variant rounded-lg p-6 flex flex-col items-center justify-center gap-2 shadow-[0_4px_0_#e3e2e2] hover:translate-y-[-2px] transition-transform animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-secondary-fixed text-on-secondary-fixed w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">description</span>
            </div>
            <span className="font-headline-lg">{metrics.wordsRead}</span>
            <span className="font-label-bold text-on-surface-variant uppercase tracking-wider">Words Processed</span>
          </div>

          <div className="bg-primary-container text-on-primary-container border-2 border-primary rounded-lg p-6 flex flex-col items-center justify-center gap-2 shadow-[0_6px_0_#2b6c00] transform md:-translate-y-2 hover:translate-y-[-10px] transition-transform animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-primary text-on-primary w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <span className="material-symbols-outlined text-[36px]">target</span>
            </div>
            <span className="font-headline-xl">{Math.round(metrics.accuracyPercent)}%</span>
            <span className="font-label-bold uppercase tracking-wider">Recall Accuracy</span>
            <div className="w-full bg-on-primary-container/20 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-on-primary-container h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.round(metrics.accuracyPercent)}%` }}></div>
            </div>
          </div>

          <div className="bg-tertiary-container text-on-tertiary-container border-2 border-tertiary rounded-lg p-6 flex flex-col items-center justify-center gap-2 shadow-[0_4px_0_#755b00] hover:translate-y-[-2px] transition-transform animate-slide-up relative" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-fade-in pointer-events-none" style={{ animationDelay: '1s' }}>
              <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full font-label-bold text-sm shadow-lg">+{xpEarned} XP</span>
            </div>
            <div className="bg-tertiary text-on-tertiary w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">stars</span>
            </div>
            <span className="font-headline-lg">+{xpEarned}</span>
            <span className="font-label-bold uppercase tracking-wider">XP Gained</span>
          </div>
        </section>

        {unlockedBadges.length > 0 && (
          <section className="w-full max-w-4xl flex flex-col gap-4 mt-6 z-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="font-headline-md text-on-surface flex items-center gap-2 px-2">
              <span className="material-symbols-outlined text-tertiary">military_tech</span>
              Milestone Rewards
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-4 pt-4 px-2 w-full" style={{ scrollbarWidth: 'none' }}>
              {unlockedBadges.map((badge, idx) => (
                <div key={idx} className="flex-shrink-0 flex flex-col items-center w-32 group cursor-pointer hover:translate-y-[-2px] transition-transform">
                  <div className="w-24 h-24 bg-tertiary-fixed border-2 border-tertiary rounded-full flex items-center justify-center shadow-[0_4px_0_#755b00] group-active:shadow-none group-active:translate-y-1 transition-all duration-200 mb-3">
                    <span className="material-symbols-outlined text-[48px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
                  </div>
                  <span className="font-label-bold text-center text-on-surface">{badge.reason}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="w-full max-w-lg flex flex-col sm:flex-row gap-4 mt-6 z-10 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex-1 bg-surface-container-high text-on-surface font-label-bold py-3 px-6 rounded-full border-b-[4px] border-surface-dim hover:bg-surface-variant active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined">analytics</span>
            Back to Dashboard
          </button>
          <button 
            onClick={() => router.push('/upload')}
            className="flex-1 bg-primary text-on-primary font-label-bold py-3 px-6 rounded-full border-b-[4px] border-on-primary-fixed-variant hover:bg-surface-tint active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined">play_arrow</span>
            New Session
          </button>
        </section>
      </main>

      {/* Paywall lock modal for free tier users */}
      {user?.tier === 'free' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-md p-6">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D97D] opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div className="w-24 h-24 bg-gradient-to-tr from-[#58cc02] to-[#a3ff6e]/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#58cc02]/30 shadow-lg relative overflow-hidden animate-pulse-glow">
              <img alt="Mascot lock icon" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUtFogP8GIrwXBYnvZMS3Z51bS-5STpMNyEM2Byy9p-dVbrbmZSvMh-6qgFCYd88Q27HGarXIs1fDYqqPkaEifdw6T6vo17SOYq21qpRfcLtiV3jlxVFkPpxcuK4eCbmFUMLXkVoC3jT2F0FGOW85neTDoY12Na3qFWANepYzYAI8u7OSENGXQH4alNcdm2Z50NJAwaYAaeIYXIQUYMVsV10gOsQxnd1_e76vWJPNAQSGq8rMjvLRd01GtYYzJwcdrxD6p9_bo4ZGE" />
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Limit Reached! ⚡</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              You've completed your first session! Upgrade to <strong>RETREIVE Pro</strong> for unlimited sessions, speech recognition, streak freezes, and weekly leaderboard access.
            </p>

            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full py-4 bg-[#58cc02] text-black font-extrabold rounded-full shadow-[0_4px_0_#2b6c00] active:translate-y-1 active:shadow-none hover:bg-[#58cc02]/95 transition-all flex items-center justify-center gap-2 mb-4"
            >
              {isUpgrading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  PREPARING CHECKOUT...
                </>
              ) : (
                <>
                  UNLOCK UNLIMITED ACCESS — $4.99/MO
                  <span className="material-symbols-outlined font-bold">arrow_forward</span>
                </>
              )}
            </button>
            <p className="text-xs text-slate-500 font-mono">Simulated Secure Stripe Checkout</p>
          </div>
        </div>
      )}
    </div>
  );
}
