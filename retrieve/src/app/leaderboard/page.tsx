'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLeaderboard, useUserStats } from '@/lib/hooks';
import AppShell from '@/components/AppShell';

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [dateRange, setDateRange] = useState('This Week');
  const { stats } = useUserStats();
  const { entries: globalLeaderboard, loading: leaderboardLoading } = useLeaderboard('weekly', 10);
  
  // Compute leaderboard members from Firestore data
  const combinedEntries = [...globalLeaderboard];
  
  const fallbackUsers = [
    { id: 'mock-sarah', displayName: 'Sarah M.', weeklyXP: 450, level: 5, currentStreak: 8, updatedAt: new Date(Date.now() - 120000) },
    { id: 'mock-marcus', displayName: 'Marcus K.', weeklyXP: 320, level: 4, currentStreak: 5, updatedAt: new Date(Date.now() - 2700000) },
    { id: 'mock-jessica', displayName: 'Jessica T.', weeklyXP: 280, level: 4, currentStreak: 3, updatedAt: new Date(Date.now() - 3600000) },
    { id: 'mock-jordan', displayName: 'Jordan R.', weeklyXP: 180, level: 3, currentStreak: 2, updatedAt: new Date(Date.now() - 10800000) },
  ];

  fallbackUsers.forEach(f => {
    if (!combinedEntries.some(e => e.displayName === f.displayName || e.user_id === f.id)) {
      combinedEntries.push({
        user_id: f.id,
        displayName: f.displayName,
        weeklyXP: f.weeklyXP,
        level: f.level,
        currentStreak: f.currentStreak,
        updatedAt: f.updatedAt
      });
    }
  });

  const parsedMembers = combinedEntries.map((entry: any) => {
    const isCurrentUser = entry.user_id === user?.id;
    
    // Format the time since last update
    let recentStr = 'Recent';
    if (entry.updatedAt) {
      const date = entry.updatedAt.toDate ? entry.updatedAt.toDate() : new Date(entry.updatedAt);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      if (diffMins < 1) recentStr = 'Now';
      else if (diffMins < 60) recentStr = `${diffMins} min ago`;
      else if (diffHours < 24) recentStr = `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      else recentStr = date.toLocaleDateString();
    }

    return {
      rank: 0, // Assigned after sorting
      name: isCurrentUser ? (stats?.displayName || user?.name || 'You') : (entry.displayName || 'Anonymous User'),
      points: entry.weeklyXP || 0,
      streak: entry.currentStreak || entry.streak || 0,
      level: entry.level || 1,
      recent: recentStr,
      isCurrentUser
    };
  });

  // Ensure current user is on the leaderboard even if they haven't completed any sessions yet
  const hasCurrentUser = parsedMembers.some(m => m.isCurrentUser);
  if (!hasCurrentUser && stats) {
    parsedMembers.push({
      rank: 0,
      name: stats.displayName || stats.name || user?.name || 'You',
      points: stats.weeklyXP || 0,
      streak: stats.current_streak || 0,
      level: stats.level || 1,
      recent: 'Now',
      isCurrentUser: true
    });
  }

  // Sort by points descending and assign ranks
  const groupMembers = [...parsedMembers]
    .sort((a, b) => b.points - a.points)
    .map((m, index) => ({
      ...m,
      rank: index + 1
    }));

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
      {/* Header Info Area */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#1A1C1C]">Dr. Smith's MCAT Biology</h2>
          <p className="text-[#5F6A59] font-bold">5 members studying together</p>
        </div>
        
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white border-2 border-[#E5E5E5] text-[#1A1C1C] text-sm font-bold rounded-xl focus:ring-[#58CC02] focus:border-[#58CC02] block p-2.5 outline-none shadow-[0_2px_0_0_#E5E5E5] cursor-pointer"
        >
          <option value="This Week">This Week</option>
          <option value="Last Week">Last Week</option>
          <option value="Last Month">Last Month</option>
        </select>
      </div>

      {/* Rules Notice */}
      <div className="mb-6 bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-[0_4px_0_0_#E5E5E5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p className="text-[#58CC02] font-extrabold text-base flex items-center gap-1.5">
            <span className="material-symbols-outlined">analytics</span>
            This Week's Rankings (June 17–23)
          </p>
          <p className="text-xs font-bold text-[#5F6A59] mt-0.5">
            Earn points by completing sessions (words read + accuracy + quiz score).
          </p>
        </div>
        <span className="px-3 py-1 bg-[#FFF9E0] text-[#755B00] border border-[#FFE894] rounded-full text-xs font-extrabold whitespace-nowrap">
          Resets in 2 days
        </span>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl overflow-hidden shadow-[0_4px_0_0_#E5E5E5] mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#FAFAF9] border-b-2 border-[#E5E5E5] text-[#5F6A59] uppercase text-xs font-extrabold">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4 text-right">Points</th>
                <th className="px-6 py-4 text-center">Streak</th>
                <th className="px-6 py-4 text-center">Level</th>
                <th className="px-6 py-4 text-right">Recent Session</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#E5E5E5]">
              {groupMembers.map((member) => (
                <tr 
                  key={member.rank}
                  className={`transition-colors font-bold ${
                    member.isCurrentUser 
                      ? 'bg-[#E8F9DB] hover:bg-[#deffd0]' 
                      : 'hover:bg-[#FAFAF9]'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-extrabold ${
                        member.rank === 1 ? 'text-[#FBB724]' : member.rank === 2 ? 'text-slate-400' : member.rank === 3 ? 'text-orange-400' : 'text-[#5F6A59]'
                      }`}>
                        {member.rank}
                      </span>
                      {member.rank === 1 && <span>🥇</span>}
                      {member.rank === 2 && <span>🥈</span>}
                      {member.rank === 3 && <span>🥉</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E5E5E5] flex items-center justify-center font-extrabold text-xs text-[#5F6A59] border-2 border-white">
                        {member.name.charAt(0)}
                      </div>
                      <span className={member.isCurrentUser ? 'text-[#2B6C00] font-extrabold' : 'text-[#1A1C1C]'}>
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-base font-extrabold text-[#58CC02]">
                    {member.points.toLocaleString()} <span className="text-xs font-bold text-[#5F6A59]">XP</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFF9E0] border border-[#FFE894] rounded-full text-xs text-[#755B00]">
                      <span>🔥</span>
                      <span>{member.streak}d</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[#1A1C1C]">
                    Lvl {member.level}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-[#5F6A59]">
                    {member.recent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weekly Challenge */}
        <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 shadow-[0_4px_0_0_#E5E5E5] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#1A1C1C] flex items-center gap-2 mb-1">
              <span className="text-xl">📢</span> Weekly Challenge
            </h3>
            <p className="text-sm font-bold text-[#5F6A59] mb-4">Read 5,000 words this week!</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#5F6A59]">
                <span>3,200 / 5,000 words</span>
                <span className="text-[#58CC02]">64%</span>
              </div>
              <div className="w-full bg-[#E5E5E5] rounded-full h-3 border border-[#E5E5E5] overflow-hidden">
                <div className="bg-[#58CC02] h-full" style={{ width: '64%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-[#E5E5E5]">
            <span className="text-xs font-bold text-[#5F6A59] flex items-center gap-1">
              <span>⚡</span> Reward: Accuracy Master Badge
            </span>
            <button className="text-xs font-extrabold text-[#58CC02] hover:underline">
              Details →
            </button>
          </div>
        </div>

        {/* Historical rankings */}
        <div className="bg-white border-2 border-[#E5E5E5] border-dashed rounded-2xl p-6 shadow-[0_4px_0_0_#E5E5E5] flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#FAFAF9] transition-all">
          <div className="w-12 h-12 rounded-full bg-[#E8F9DB] flex items-center justify-center mb-3">
            <span className="text-xl">📅</span>
          </div>
          <h3 className="text-base font-extrabold text-[#1A1C1C] mb-1">Historical Archive</h3>
          <p className="text-xs font-bold text-[#5F6A59] max-w-sm mb-4">
            Look back at previous weeks and see how your study group has progressed over time.
          </p>
          <button className="btn-3d px-5 py-2.5 bg-white border-2 border-[#E5E5E5] text-[#5F6A59] rounded-xl font-bold text-xs hover:bg-[#FAFAF9] transition-all">
            View Archive
          </button>
        </div>
        
      </div>
    </AppShell>
  );
}
