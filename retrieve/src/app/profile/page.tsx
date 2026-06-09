'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUserStats } from '@/lib/hooks';
import AppShell from '@/components/AppShell';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signout } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

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

  const handleUpgrade = async () => {
    if (!user) return;
    if (stats?.tier === 'unlimited') {
      alert("You are already on the Unlimited Pro tier!");
      return;
    }
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

  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <svg className="w-12 h-12 animate-spin text-[#58CC02]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Profile Details Card */}
        <section className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 shadow-[0_4px_0_0_#E5E5E5] flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#58CC02] border-b-4 border-[#2B6C00] flex items-center justify-center font-extrabold text-white text-3xl shadow-md">
            {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-extrabold text-[#1A1C1C] mb-0.5">
              {user.name || user.email?.split('@')[0]}
            </h2>
            <p className="text-[#5F6A59] font-medium text-sm mb-3">{user.email}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <div className="px-3 py-1 rounded-full bg-[#FFF9E0] border border-[#FFE894] text-xs font-bold text-[#755B00] flex items-center gap-1">
                <span>🔥</span>
                <span>{stats?.current_streak || 0} Day Streak</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#E8F9DB] border border-[#B7EB8F] text-xs font-bold text-[#2B6C00] flex items-center gap-1">
                <span className="material-symbols-outlined text-[#58CC02] text-sm font-bold">stars</span>
                <span>Level {stats?.levelInfo?.currentLevel || 1}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lifetime Statistics */}
          <section className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 shadow-[0_4px_0_0_#E5E5E5]">
            <h3 className="text-lg font-extrabold text-[#1A1C1C] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#58CC02]">bar_chart</span>
              Lifetime Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#FAFAF9] border-2 border-[#E5E5E5] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📚</span>
                  <span className="text-sm font-bold text-[#1A1C1C]">Passages Read</span>
                </div>
                <span className="text-lg font-extrabold text-[#1A1C1C]">{stats?.total_sessions || stats?.sessions_completed || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#E8F9DB] border-2 border-[#B7EB8F] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🎯</span>
                  <span className="text-sm font-bold text-[#2B6C00]">Avg Accuracy</span>
                </div>
                <span className="text-lg font-extrabold text-[#2B6C00]">{stats?.average_accuracy || 0}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#FFF9E0] border-2 border-[#FFE894] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">✨</span>
                  <span className="text-sm font-bold text-[#755B00]">Total XP Earned</span>
                </div>
                <span className="text-lg font-extrabold text-[#755B00]">{stats?.total_xp?.toLocaleString() || 0}</span>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="space-y-6">
            <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 shadow-[0_4px_0_0_#E5E5E5]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-extrabold text-[#1A1C1C]">Subscription Tier</h4>
                  <p className="text-xs font-bold text-[#5F6A59]">Manage premium access.</p>
                </div>
                {stats?.tier && stats?.tier !== 'free' && (
                  <div className="px-3 py-1 bg-[#E0F5FF] text-[#006590] border-2 border-[#B3E5FF] rounded-full text-xs font-bold uppercase tracking-wider">
                    {stats.tier}
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="btn-3d w-full py-3 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white disabled:bg-[#E5E5E5] disabled:border-[#becbb1] disabled:text-[#5F6A59] rounded-xl font-extrabold transition-all active:translate-y-1 active:border-b-0 hover:bg-[#62e002] flex items-center justify-center gap-1"
              >
                {isUpgrading 
                  ? 'Preparing Checkout...' 
                  : stats?.tier === 'unlimited' 
                    ? 'Manage Subscription' 
                    : 'Upgrade to Unlimited'}
              </button>
            </div>

            <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-5 shadow-[0_4px_0_0_#E5E5E5]">
              <h4 className="font-extrabold text-[#1A1C1C] mb-3">Settings</h4>
              <button
                onClick={() => setShowSignOutConfirm(true)}
                className="btn-3d w-full py-3 bg-white border-2 border-[#E5E5E5] border-b-4 text-[#BA1A1A] hover:bg-[#FFDAD6] active:translate-y-1 active:border-b-0 rounded-xl font-extrabold transition-all"
              >
                Sign Out
              </button>
            </div>
          </section>
          
        </div>
      </div>
      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl text-center">
            <span className="material-symbols-outlined text-4xl text-[#BA1A1A] mb-3">logout</span>
            <h3 className="text-xl font-extrabold text-[#1A1C1C] mb-2">Sign Out</h3>
            <p className="text-sm font-semibold text-[#5F6A59] mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="btn-3d flex-1 py-3 bg-white border-2 border-[#E5E5E5] border-b-4 text-[#5F6A59] font-extrabold rounded-xl hover:bg-[#FAFAF9]"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="btn-3d flex-1 py-3 bg-[#BA1A1A] border-b-4 border-[#93000A] text-white font-extrabold rounded-xl hover:bg-[#D62F2F] active:translate-y-1 active:border-b-0"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
