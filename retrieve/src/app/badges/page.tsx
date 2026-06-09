'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AppShell from '@/components/AppShell';

import { useUserStats } from '@/lib/hooks';

export default function BadgesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { stats } = useUserStats();
  
  const userBadges = (stats?.badges && stats.badges.length > 0)
    ? stats.badges
    : ['first-session', 'words-1k', 'accuracy-95'];

  const allBadges = [
    { id: 'first-session', name: 'First Steps', icon: '🎯', description: 'Complete your first reading session.' },
    { id: 'laser_focus', name: 'Laser Focus', icon: '🔍', description: 'Read 1,000+ words in a single session.' },
    { id: 'accuracy_expert', name: 'Accuracy Expert', icon: '⚡', description: 'Get 90%+ accuracy in last 5 sessions.' },
    { id: 'speed_reader', name: 'Speed Reader', icon: '🚀', description: 'Average 50+ words/minute across last 3 sessions.' },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🎓', description: 'Achieve 90%+ MCQ accuracy for 7 consecutive days.' },
    { id: 'consistency_pro', name: 'Consistency Pro', icon: '📅', description: 'Maintain a 30-day study streak.' },
    { id: 'brain_athlete', name: 'Brain Athlete', icon: '🧠', description: 'Improve MCQ accuracy by 15%+ week-over-week.' },
    { id: 'streak_7', name: 'Weekly Warrior', icon: '⚔️', description: 'Maintain a 7-day study streak.' },
    { id: 'streak_30', name: 'Streak Champion', icon: '🏆', description: 'Maintain a 30-day study streak.' },
    { id: 'streak_100', name: 'Century Club', icon: '💯', description: 'Maintain a 100-day study streak.' },
    { id: 'words-1k', name: 'Emerging Scholar', icon: '📖', description: 'Read 1,000 words total.' },
    { id: 'words-10k', name: 'Voracious Reader', icon: '📚', description: 'Read 10,000 words total.' },
    { id: 'words-50k', name: 'Academic Star', icon: '✨', description: 'Read 50,000 words total.' },
    { id: 'words-100k', name: 'MCAT Scholar', icon: '🏫', description: 'Read 100,000 words total.' }
  ].map(b => ({
    ...b,
    isEarned: userBadges.includes(b.id),
    earnedDate: userBadges.includes(b.id) ? 'Unlocked' : null
  }));

  const earnedBadges = allBadges.filter(b => b.isEarned);
  const lockedBadges = allBadges.filter(b => !b.isEarned);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <svg className="w-12 h-12 animate-spin text-[#58CC02]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppShell>
      {/* Header section with unlock count */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-[#1A1C1C] tracking-tight">Your Achievements</h2>
          <p className="text-sm font-bold text-[#5F6A59] mt-0.5">
            Unlock badges by reading passages, keeping streaks, and maintaining high accuracy.
          </p>
        </div>
        
        <div className="px-4 py-2 bg-[#E8F9DB] border-2 border-[#B7EB8F] text-[#2B6C00] rounded-full text-sm font-extrabold flex items-center gap-1.5 self-center sm:self-auto shadow-[0_2px_0_0_#B7EB8F]">
          <span className="material-symbols-outlined text-base">emoji_events</span>
          <span>{earnedBadges.length} / {allBadges.length} Unlocked</span>
        </div>
      </div>

      {/* Earned Badges Section */}
      <section className="mb-8">
        <h3 className="text-xl font-extrabold text-[#1A1C1C] mb-6 flex items-center gap-2">
          <span className="text-[#58CC02]">🏆</span> Unlocked Badges
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {earnedBadges.map((badge) => (
            <div 
              key={badge.id}
              className="bg-white border-2 border-[#58CC02] rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_4px_0_0_#58CC02] transition-transform hover:-translate-y-1 relative overflow-hidden group min-h-[200px]"
            >
              <div className="w-16 h-16 bg-[#E8F9DB] border-2 border-[#B7EB8F] rounded-full flex items-center justify-center text-3xl mb-3 shadow-[0_2px_0_0_#B7EB8F]">
                {badge.icon}
              </div>
              
              <h4 className="text-base font-extrabold text-[#1A1C1C] mb-1">{badge.name}</h4>
              <p className="text-xs font-bold text-[#5F6A59] mb-4 flex-1">{badge.description}</p>
              
              <p className="text-xxs font-extrabold text-[#2B6C00] bg-[#E8F9DB] px-3 py-1 rounded-full border border-[#B7EB8F]">
                Earned {badge.earnedDate}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="border-[#E5E5E5] border-t-2 my-8" />

      {/* Locked Badges Section */}
      <section>
        <h3 className="text-xl font-extrabold text-[#5F6A59] mb-6 flex items-center gap-2">
          <span>🔒</span> Locked Achievements
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lockedBadges.map((badge) => (
            <div 
              key={badge.id}
              className="bg-[#FAFAF9] border-2 border-[#E5E5E5] rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_4px_0_0_#E5E5E5] opacity-85 hover:opacity-100 transition-all min-h-[200px]"
            >
              <div className="w-16 h-16 bg-[#EEEEEE] border-2 border-[#E5E5E5] rounded-full flex items-center justify-center text-3xl mb-3 grayscale">
                {badge.icon}
              </div>
              
              <h4 className="text-base font-extrabold text-[#5F6A59] mb-1">{badge.name}</h4>
              <p className="text-xs font-bold text-[#A6A6A6] mb-4 flex-1">{badge.description}</p>
              
              <div className="flex items-center gap-1 text-xxs font-extrabold text-[#A6A6A6] bg-[#EEEEEE] px-3 py-1 rounded-full border border-[#E5E5E5]">
                <span className="material-symbols-outlined text-[12px] font-bold">lock</span>
                <span>Locked</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
