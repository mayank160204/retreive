'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStats } from '@/lib/hooks';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

export default function AppShell({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter();
  const { stats, loading } = useUserStats();

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1C1C] flex flex-col font-sans select-none pb-24 md:pb-28">
      {/* Top Sticky Header */}
      <header className="w-full top-0 sticky bg-white border-b-4 border-[#E5E5E5] z-50">
        <div className="flex justify-between items-center w-full px-6 max-w-6xl mx-auto h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[#58CC02] border-b-2 border-[#2B6C00] flex items-center justify-center font-bold text-white text-sm">
              R
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#58CC02]">RETREIVE</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak Widget */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF9E0] border-2 border-[#FFE894] text-sm">
              <span className="text-[#FBB724] font-bold text-lg leading-none">🔥</span>
              <span className="font-extrabold text-[#755B00]">{stats?.current_streak || 0}</span>
            </div>

            {/* Level Widget */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E8F9DB] border-2 border-[#B7EB8F] text-sm">
              <span className="material-symbols-outlined text-[#58CC02] text-lg font-bold">stars</span>
              <span className="font-extrabold text-[#2B6C00]">LVL {stats?.levelInfo?.currentLevel || stats?.level || 1}</span>
            </div>

            {/* Tier Widget */}
            {stats?.tier === 'unlimited' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E0F5FF] border-2 border-[#88ceff] text-sm shadow-[0_1.5px_0_0_#88ceff] font-bold">
                <span className="text-blue-500 text-sm leading-none">👑</span>
                <span className="font-extrabold text-[#006590] uppercase tracking-wider text-xs">PRO</span>
              </div>
            ) : (
              <div 
                onClick={() => router.push('/upload')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-[#E5E5E5] text-sm hover:bg-slate-50 cursor-pointer font-bold shadow-[0_1.5px_0_0_#E5E5E5] transition-all"
              >
                <span className="text-gray-400 text-sm leading-none">👑</span>
                <span className="font-extrabold text-[#5F6A59] text-xs">FREE</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6"
      >
        {children}
      </motion.main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
