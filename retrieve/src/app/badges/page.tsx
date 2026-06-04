'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BadgeTriggerCheck } from '@/lib/xp-engine';

export default function BadgesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Mock badges matching the design system and xp-engine
  const allBadges = [
    { id: 'first_session', name: 'First Steps', icon: '🎯', description: 'Complete your first reading session.', earnedDate: 'Jun 1, 2026', isEarned: true },
    { id: 'accuracy_master', name: 'Accuracy Ace', icon: '⚡', description: 'Achieve 95%+ transcription accuracy.', earnedDate: 'Jun 10, 2026', isEarned: true },
    { id: 'streak_3', name: 'Consistent Learner', icon: '🔥', description: 'Maintain a 3-day study streak.', earnedDate: 'Jun 12, 2026', isEarned: true },
    { id: 'streak_7', name: 'Weekly Warrior', icon: '⚔️', description: 'Maintain a 7-day study streak.', earnedDate: null, isEarned: false },
    { id: 'words_5k', name: 'Voracious Reader', icon: '📚', description: 'Read over 5,000 words total.', earnedDate: null, isEarned: false },
    { id: 'mcq_perfect', name: 'Quiz Master', icon: '🎓', description: 'Get a perfect score on the MCQ.', earnedDate: null, isEarned: false },
    { id: 'level_5', name: 'Level 5 Achiever', icon: '⭐', description: 'Reach Level 5 in progression.', earnedDate: null, isEarned: false },
    { id: 'streak_30', name: 'Streak Master', icon: '👑', description: 'Maintain a 30-day study streak.', earnedDate: null, isEarned: false },
  ];

  const earnedBadges = allBadges.filter(b => b.isEarned);
  const lockedBadges = allBadges.filter(b => !b.isEarned);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <svg className="w-12 h-12 animate-spin text-[#00D97D]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">←</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Badge Gallery</h1>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D97D]/10 border border-[#00D97D]/20 text-[#00D97D] text-sm font-bold">
            {earnedBadges.length} / {allBadges.length} Unlocked
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 py-8">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Your Achievements</h2>
          <p className="text-slate-400">Unlock badges by reaching milestones, maintaining streaks, and scoring high accuracy.</p>
        </div>

        {/* Earned Badges Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🏆</span> Unlocked Badges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {earnedBadges.map((badge) => (
              <div 
                key={badge.id}
                className="bg-[#111111] border border-[#00D97D]/40 rounded-3xl p-6 flex flex-col items-center text-center hover:translate-y-[-4px] hover:shadow-[0_10px_30px_rgba(0,217,125,0.15)] transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D97D] opacity-10 rounded-full blur-[40px] pointer-events-none group-hover:opacity-20 transition-opacity" />
                
                <div className="w-20 h-20 bg-gradient-to-br from-[#00D97D]/20 to-[#00A85C]/5 border-2 border-[#00D97D] rounded-full flex items-center justify-center text-4xl mb-4 shadow-[0_0_15px_rgba(0,217,125,0.2)]">
                  {badge.icon}
                </div>
                
                <h4 className="text-lg font-bold text-white mb-1">{badge.name}</h4>
                <p className="text-sm text-slate-400 mb-4">{badge.description}</p>
                <p className="text-xs text-[#00D97D] font-bold mt-auto bg-[#00D97D]/10 px-3 py-1 rounded-full">
                  Earned {badge.earnedDate}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

        {/* Locked Badges Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-300">
            <span>🔒</span> Locked Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {lockedBadges.map((badge) => (
              <div 
                key={badge.id}
                className="bg-black border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-4xl mb-4 grayscale filter drop-shadow-none">
                  {badge.icon}
                </div>
                
                <h4 className="text-lg font-bold text-slate-300 mb-1">{badge.name}</h4>
                <p className="text-sm text-slate-500 mb-4">{badge.description}</p>
                <div className="mt-auto flex items-center gap-1.5 text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Locked
                </div>
              </div>
            ))}
          </div>
        </section>
        
      </main>
    </div>
  );
}
