'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUserStats, useRecentSessions, useLeaderboard } from '@/lib/hooks';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signout } = useAuth();
  
  const { stats, loading: statsLoading } = useUserStats();
  const { sessions, loading: sessionsLoading } = useRecentSessions(5);
  const { entries: leaderboard } = useLeaderboard('weekly', 5);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    try {
      await signout();
      router.push('/');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-[#00D97D] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-slate-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00D97D] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D97D] to-[#00A85C] flex items-center justify-center font-bold text-black text-sm">
              R
            </div>
            <h1 className="text-xl font-bold tracking-tight">RETREIVE</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 mr-4 text-sm font-bold text-slate-400">
              <button onClick={() => router.push('/dashboard')} className="text-white hover:text-[#00D97D] transition-colors">Dashboard</button>
              <button onClick={() => router.push('/leaderboard')} className="hover:text-[#00D97D] transition-colors">Leaderboard</button>
              <button onClick={() => router.push('/badges')} className="hover:text-[#00D97D] transition-colors">Badges</button>
              <button onClick={() => router.push('/profile')} className="hover:text-[#00D97D] transition-colors">Profile</button>
            </nav>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
              <span className="text-[#FBB724]">🔥</span>
              <span className="font-semibold">{stats?.current_streak || 0} Day Streak</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              Welcome back, {user.name || user.email?.split('@')[0]}
            </h2>
            <p className="text-slate-400">Ready to crush another MCAT passage?</p>
          </div>
          
          <button 
            onClick={() => router.push('/upload')}
            className="flex items-center gap-2 px-6 py-3 bg-[#00D97D] text-black rounded-full font-bold hover:bg-[#00e885] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,217,125,0.3)]"
          >
            Open Simulator →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Progress Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Level Card */}
            <section className="bg-[#111111] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D97D] opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-1">Current Level</p>
                  <h3 className="text-3xl font-bold">{stats?.levelTitle || 'Rookie'}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-[#00D97D]">{stats?.total_xp?.toLocaleString() || 0} <span className="text-sm text-slate-500">XP</span></p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>Level {stats?.levelInfo.currentLevel || 1}</span>
                  <span>Level {(stats?.levelInfo.currentLevel || 1) + 1}</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00D97D] to-[#4DBFFF] rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${stats?.levelInfo.progressPercent || 0}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  {stats?.levelInfo.xpToNextLevel?.toLocaleString() || 0} XP needed to level up
                </p>
              </div>
            </section>

            {/* Recent Sessions */}
            <section>
              <h3 className="text-xl font-bold mb-4 px-1">Recent Activity</h3>
              <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden">
                {sessionsLoading ? (
                  <div className="p-8 text-center text-slate-500 animate-pulse">Loading sessions...</div>
                ) : sessions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-2xl">📚</div>
                    <p>No study sessions yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {sessions.map((session, i) => (
                      <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col">
                          <span className="font-semibold">{session.pdf_id === 'default' ? 'Demo Passage' : session.pdf_id}</span>
                          <span className="text-xs text-slate-400">{session.completed_at ? new Date(session.completed_at).toLocaleDateString() : 'Unknown date'}</span>
                        </div>
                        <div className="text-right flex flex-col">
                          <span className="text-[#00D97D] font-bold">+{session.xp_earned} XP</span>
                          <span className="text-xs text-slate-400">{session.accuracy_percentage}% accuracy</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Streak</span>
                <span className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-[#FBB724]">🔥</span> {stats?.current_streak || 0}
                </span>
              </div>
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Tier</span>
                <span className="text-2xl font-bold flex items-center gap-2 capitalize">
                  {stats?.tier === 'unlimited' ? <span className="text-[#4DBFFF]">⚡</span> : null}
                  {stats?.tier || 'Free'}
                </span>
              </div>
            </div>

            {/* Leaderboard Snippet */}
            <section className="bg-[#111111] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Weekly Top 5</h3>
                <span className="text-xs px-2 py-1 bg-white/5 text-slate-400 rounded-md">Live</span>
              </div>
              
              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No entries yet this week</p>
                ) : (
                  leaderboard.map((entry: any, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-[#FBB724]' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-600'}`}>
                        {i + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                      <div className="flex-1 truncate text-sm font-medium">
                        {entry.username || 'Anonymous'}
                      </div>
                      <div className="text-sm font-bold text-[#00D97D]">
                        {entry.weekly_xp?.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
            
          </div>
        </div>
      </main>
    </div>
  );
}
