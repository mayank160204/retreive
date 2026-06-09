'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUserStats, useLeaderboard } from '@/lib/hooks';
import AppShell from '@/components/AppShell';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { stats } = useUserStats();
  const { entries: leaderboard } = useLeaderboard('weekly', 5);

  const mascotQuotes = [
    "Squeak! I'm your MCAT guide! Tap me or hover over this card to see me lift up! Let's keep studying! 🌰",
    "Did you know? Recall accuracy is key to crushing MCAT passage retrieval! 🧬",
    "Squeak! A 7-day streak gives you a bonus multiplier on your sessions! 🔥",
    "Keep reading! Every word counts toward reaching the Elite Strategist level! 📚",
    "Acorns are great, but scoring 528 on the MCAT is even better! 🐿️",
  ];

  const [mascotQuote, setMascotQuote] = useState(mascotQuotes[0]);

  const handleMascotClick = () => {
    const currentIndex = mascotQuotes.indexOf(mascotQuote);
    const nextIndex = (currentIndex + 1) % mascotQuotes.length;
    setMascotQuote(mascotQuotes[nextIndex]);
  };

  // Combine real leaderboard entries with fallback ones for display
  const combinedLeaderboard = [...leaderboard];
  const fallbackLeaderboard = [
    { displayName: 'Sarah M.', username: 'Sarah M.', weeklyXP: 450, points: 450 },
    { displayName: 'Marcus K.', username: 'Marcus K.', weeklyXP: 320, points: 320 },
    { displayName: 'Jessica T.', username: 'Jessica T.', weeklyXP: 280, points: 280 },
    { displayName: 'Jordan R.', username: 'Jordan R.', weeklyXP: 180, points: 180 },
  ];
  
  // Add fallback users if not present
  fallbackLeaderboard.forEach(f => {
    if (!combinedLeaderboard.some(e => e.displayName === f.displayName || e.username === f.username)) {
      combinedLeaderboard.push(f);
    }
  });

  // Ensure current user is on the display board
  const hasUser = combinedLeaderboard.some(e => e.user_id === user?.id || e.displayName === stats?.displayName);
  if (!hasUser && stats) {
    combinedLeaderboard.push({
      user_id: user?.id,
      displayName: stats.displayName || stats.name || user?.name || 'You',
      username: stats.displayName || stats.name || user?.name || 'You',
      weeklyXP: stats.weeklyXP || 0,
      points: stats.weeklyXP || 0
    });
  }

  const displayLeaderboard = combinedLeaderboard
    .sort((a, b) => (b.weeklyXP || b.points || 0) - (a.weeklyXP || a.points || 0))
    .slice(0, 5);

  // Verify authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-[#58CC02] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[#5F6A59] font-bold">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppShell>
      {/* Welcome Hero */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 shadow-[0_4px_0_0_#E5E5E5]">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1A1C1C] mb-1">
            Welcome back, {user.name || user.email?.split('@')[0]}! 👋
          </h2>
          <p className="text-[#5F6A59] font-medium">Ready to master another MCAT passage today?</p>
        </div>

        <button
          onClick={() => router.push('/upload')}
          className="btn-3d px-6 py-4 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white rounded-xl font-extrabold hover:bg-[#62e002] active:translate-y-1 active:border-b-0 transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined font-bold">rocket_launch</span>
          Start a Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Level Progress Card */}
          <section className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 shadow-[0_4px_0_0_#E5E5E5] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5F6A59] mb-0.5">Your Level</p>
                <h3 className="text-2xl font-extrabold text-[#1A1C1C]">{stats?.levelTitle || 'Rookie'}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5F6A59] mb-0.5">Total XP</p>
                <p className="text-xl font-extrabold text-[#58CC02]">
                  {stats?.total_xp?.toLocaleString() || 0} <span className="text-xs text-[#5F6A59]">XP</span>
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#5F6A59] mb-1">
                <span>Level {stats?.levelInfo?.currentLevel || 1}</span>
                <span>Level {(stats?.levelInfo?.currentLevel || 1) + 1}</span>
              </div>
              <div className="h-4 w-full bg-[#E5E5E5] rounded-full overflow-hidden border border-[#E5E5E5]">
                <div
                  className="h-full bg-[#58CC02] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stats?.levelInfo?.progressPercent || 0}%` }}
                />
              </div>
              <p className="text-xs font-bold text-[#5F6A59] mt-2 text-center">
                {stats?.levelInfo?.xpToNextLevel?.toLocaleString() || 0} XP needed to level up
              </p>
            </div>
          </section>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-[0_4px_0_0_#E5E5E5] text-center">
              <span className="text-2xl">🔥</span>
              <p className="text-xs font-bold text-[#5F6A59] uppercase tracking-wider mt-1">Streak</p>
              <p className="text-xl font-extrabold text-[#755B00] mt-0.5">{stats?.current_streak || 0} Days</p>
            </div>

            <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-[0_4px_0_0_#E5E5E5] text-center">
              <span className="text-2xl">📚</span>
              <p className="text-xs font-bold text-[#5F6A59] uppercase tracking-wider mt-1">Sessions</p>
              <p className="text-xl font-extrabold text-[#1A1C1C] mt-0.5">{stats?.sessions_completed || 0}</p>
            </div>

            <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-[0_4px_0_0_#E5E5E5] text-center">
              <span className="text-2xl">🎯</span>
              <p className="text-xs font-bold text-[#5F6A59] uppercase tracking-wider mt-1">Accuracy</p>
              <p className="text-xl font-extrabold text-[#58CC02] mt-0.5">{stats?.average_accuracy || 0}%</p>
            </div>

            <div className={`border-2 rounded-2xl p-4 text-center transition-all ${
              stats?.tier === 'unlimited' 
                ? 'bg-[#E0F5FF] border-[#88ceff] shadow-[0_4px_0_0_#88ceff]' 
                : 'bg-white border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5]'
            }`}>
              <span className="text-2xl">{stats?.tier === 'unlimited' ? '👑' : '⚡'}</span>
              <p className="text-xs font-bold text-[#5F6A59] uppercase tracking-wider mt-1">Tier</p>
              <p className={`text-xl font-extrabold mt-0.5 capitalize ${
                stats?.tier === 'unlimited' ? 'text-[#006590]' : 'text-[#755B00]'
              }`}>
                {stats?.tier || 'Free'}
              </p>
            </div>
          </div>

          {/* How to Use Card */}
          <section className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 shadow-[0_4px_0_0_#E5E5E5]">
            <h3 className="text-xl font-extrabold text-[#1A1C1C] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#58CC02]">menu_book</span>
              How It Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: 'upload_file', step: '1', title: 'Upload a PDF', desc: 'Upload any MCAT passage, textbook chapter, or article.' },
                { icon: 'record_voice_over', step: '2', title: 'Read Aloud', desc: 'Read each passage aloud while the app tracks your accuracy.' },
                { icon: 'quiz', step: '3', title: 'Answer MCQs', desc: 'Test your comprehension with AI-generated questions.' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center p-4 bg-[#FAFAF9] border-2 border-[#E5E5E5] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#58CC02] border-b-2 border-[#2B6C00] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-white text-lg font-bold">{item.icon}</span>
                  </div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5F6A59] mb-1">Step {item.step}</p>
                  <h4 className="font-extrabold text-sm text-[#1A1C1C] mb-1">{item.title}</h4>
                  <p className="text-xs font-semibold text-[#5F6A59]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar (1 col) */}
        <div className="space-y-6">

          {/* Interactive Mascot Card */}
          <div 
            onClick={handleMascotClick}
            className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 shadow-[0_4px_0_0_#E5E5E5] hover:-translate-y-2 hover:shadow-[0_8px_0_0_#E5E5E5] active:translate-y-0 active:shadow-[0_2px_0_0_#E5E5E5] transition-all duration-300 group cursor-pointer overflow-hidden relative select-none"
          >
            <div className="absolute top-2 right-2 bg-[#E8F9DB] text-[#2B6C00] text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-[#B7EB8F]">
              MASCOT
            </div>
            <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 border border-[#E5E5E5] bg-[#FFF9E0]">
              <video 
                src="/assets/mascot_video.mp4" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <h3 className="font-extrabold text-[#1A1C1C] flex items-center gap-1.5 mb-1.5">
              <span>🐿️</span> Scratten
            </h3>
            <div className="relative bg-[#FAFAF9] border-2 border-[#E5E5E5] p-3 rounded-xl">
              {/* Talk bubble arrow tail */}
              <div className="absolute top-[-7px] left-5 w-3 h-3 bg-[#FAFAF9] border-t-2 border-l-2 border-[#E5E5E5] rotate-45" />
              <p className="text-xs font-bold text-[#5F6A59] leading-relaxed">
                {mascotQuote}
              </p>
            </div>
          </div>

          {/* Weekly Leaderboard */}
          <section className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 shadow-[0_4px_0_0_#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-[#1A1C1C] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#FBB724]">workspace_premium</span>
                Weekly Leaderboard
              </h3>
              <span className="px-2 py-0.5 bg-[#FFF9E0] text-[#755B00] rounded-lg font-bold text-[10px] uppercase border border-[#FFE894]">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {displayLeaderboard.length === 0 ? (
                <div className="py-6 text-center text-[#5F6A59] flex flex-col items-center gap-2">
                  <span className="text-3xl">🏆</span>
                  <p className="font-bold text-xs">No entries yet this week.</p>
                  <p className="text-[10px] text-[#5F6A59]/80">Complete a session to appear here!</p>
                </div>
              ) : (
                displayLeaderboard.map((entry: any, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 text-center font-extrabold text-sm ${
                      i === 0 ? 'text-[#FBB724]' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-[#5F6A59]'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#E5E5E5] flex-shrink-0 flex items-center justify-center font-bold text-xs text-[#5F6A59] uppercase border-2 border-white">
                      {entry.username?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 truncate text-xs font-bold text-[#1A1C1C]">{entry.username || 'Anonymous'}</div>
                    <div className="text-xs font-extrabold text-[#58CC02]">
                      {entry.weekly_xp?.toLocaleString() || entry.points?.toLocaleString() || 0} XP
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 shadow-[0_4px_0_0_#E5E5E5]">
            <h3 className="font-extrabold text-[#1A1C1C] mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#58CC02]">bolt</span>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/upload')}
                className="btn-3d w-full px-4 py-3 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white font-extrabold rounded-xl hover:bg-[#62e002] flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">upload_file</span>
                Upload New PDF
              </button>
              <button
                onClick={() => router.push('/leaderboard')}
                className="btn-3d w-full px-4 py-3 bg-white border-2 border-[#E5E5E5] border-b-4 text-[#5F6A59] font-extrabold rounded-xl hover:bg-[#FAFAF9] flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">leaderboard</span>
                Full Leaderboard
              </button>
              <button
                onClick={() => router.push('/badges')}
                className="btn-3d w-full px-4 py-3 bg-white border-2 border-[#E5E5E5] border-b-4 text-[#5F6A59] font-extrabold rounded-xl hover:bg-[#FAFAF9] flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">military_tech</span>
                My Badges
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="btn-3d w-full px-4 py-3 bg-white border-2 border-[#E5E5E5] border-b-4 text-[#5F6A59] font-extrabold rounded-xl hover:bg-[#FAFAF9] flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">manage_accounts</span>
                My Profile
              </button>
            </div>
          </section>

          {/* Motivation Card */}
          <section className="bg-gradient-to-br from-[#58CC02] to-[#2B6C00] border-2 border-[#2B6C00] rounded-2xl p-5 shadow-[0_4px_0_0_#1a4200]">
            <p className="text-white font-extrabold text-sm mb-1">💡 Daily Tip</p>
            <p className="text-white/90 text-xs font-semibold leading-relaxed">
              Reading aloud improves retention by up to 50% compared to silent reading. Try it for your next passage!
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
