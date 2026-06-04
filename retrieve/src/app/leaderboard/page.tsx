'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLeaderboard, useUserStats } from '@/lib/hooks';

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signout } = useAuth();
  const { stats } = useUserStats();
  
  const [dateRange, setDateRange] = useState('This Week');
  const { entries: globalLeaderboard, loading: leaderboardLoading } = useLeaderboard('weekly', 10);
  
  // Mock data for the study group to match the design prompt exactly
  const groupMembers = [
    { rank: 1, name: 'Sarah M.', points: 450, streak: 8, level: 5, recent: '2 min ago', isCurrentUser: false },
    { rank: 2, name: 'Marcus K.', points: 320, streak: 5, level: 4, recent: '45 min ago', isCurrentUser: false },
    { rank: 3, name: 'Jessica T.', points: 280, streak: 3, level: 4, recent: '1 hr ago', isCurrentUser: false },
    { rank: 4, name: 'You (Alex)', points: 245, streak: 12, level: 4, recent: 'Now', isCurrentUser: true },
    { rank: 5, name: 'Jordan R.', points: 180, streak: 2, level: 3, recent: '3 hrs ago', isCurrentUser: false },
  ];

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
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00D97D] selection:text-black pb-24">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">←</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Group Leaderboard</h1>
          </div>
          
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#111111] border border-white/10 text-white text-sm rounded-lg focus:ring-[#00D97D] focus:border-[#00D97D] block p-2 outline-none"
          >
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="Last Month">Last Month</option>
          </select>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 py-8">
        
        {/* Leaderboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dr. Smith's MCAT Biology</h2>
          <p className="text-slate-400 mb-6">5 members studying</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#111111] border border-white/10 rounded-2xl p-4 gap-4">
            <div>
              <p className="text-[#00D97D] font-bold text-lg flex items-center gap-2">
                <span>📊</span> This Week's Rankings (June 17–23)
              </p>
              <p className="text-sm text-slate-400 mt-1">Earn points via sessions (words read + accuracy bonus + MCQ bonus)</p>
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[#FBB724] font-bold text-sm bg-[#FBB724]/10 px-3 py-1 rounded-full border border-[#FBB724]/20">
                Resets in 2 days
              </span>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden mb-8 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-black/40 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-3xl">Rank</th>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4 text-right">Points</th>
                  <th className="px-6 py-4 text-center">Streak</th>
                  <th className="px-6 py-4 text-center">Level</th>
                  <th className="px-6 py-4 text-right rounded-tr-3xl">Recent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {groupMembers.map((member) => (
                  <tr 
                    key={member.rank}
                    className={`
                      group transition-all duration-200
                      ${member.isCurrentUser ? 'bg-[#00D97D]/10 border-l-4 border-l-[#00D97D]' : 'hover:bg-white/[0.03]'}
                      ${member.rank === 1 ? 'bg-gradient-to-r from-[#FBB724]/10 to-transparent' : ''}
                      ${member.rank === 2 ? 'bg-gradient-to-r from-slate-300/10 to-transparent' : ''}
                      ${member.rank === 3 ? 'bg-gradient-to-r from-orange-400/10 to-transparent' : ''}
                    `}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 font-bold text-lg">
                        <span className={`
                          ${member.rank === 1 ? 'text-[#FBB724]' : ''}
                          ${member.rank === 2 ? 'text-slate-300' : ''}
                          ${member.rank === 3 ? 'text-orange-400' : ''}
                          ${member.rank > 3 ? 'text-slate-500' : ''}
                        `}>
                          {member.rank}
                        </span>
                        {member.rank === 1 && <span>🥇</span>}
                        {member.rank === 2 && <span>🥈</span>}
                        {member.rank === 3 && <span>🥉</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-slate-300">
                          {member.name.charAt(0)}
                        </div>
                        <span className={`font-medium text-base ${member.isCurrentUser ? 'text-white font-bold' : 'text-slate-200'}`}>
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-[#00D97D] text-lg">
                      {member.points.toLocaleString()} <span className="text-xs text-[#00D97D]/70 font-normal">pts</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/30 rounded-full">
                        <span className="text-[#FBB724]">🔥</span>
                        <span className="font-bold">{member.streak}d</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-slate-400 font-medium">Lvl {member.level}</span>
                    </td>
                    <td className="px-6 py-5 text-right text-slate-500 text-xs">
                      {member.recent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section (Challenge & Archive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Challenge Card */}
          <div className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-[#00D97D]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,217,125,0.05)] relative overflow-hidden group hover:border-[#00D97D]/60 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D97D] opacity-10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📢</span> Weekly Challenge
            </h3>
            <p className="text-white font-medium mb-4">Read 5,000 words this week</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">3,200 / 5,000 words</span>
                <span className="text-[#00D97D] font-bold">64%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2.5">
                <div className="bg-[#00D97D] h-2.5 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="text-sm font-medium text-slate-300">Reward: Accuracy Master</span>
              </div>
              <button className="text-[#00D97D] text-sm font-bold hover:underline">
                View Details →
              </button>
            </div>
          </div>

          {/* Historical Rankings */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-white/[0.02] transition-colors cursor-pointer border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Historical Rankings</h3>
            <p className="text-slate-400 text-sm mb-4">Look back at previous weeks and see how your study group has progressed over time.</p>
            <button className="px-6 py-2 border border-white/20 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
              View Archive
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
