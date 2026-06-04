'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUserStats } from '@/lib/hooks';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signout } = useAuth();
  const { stats, loading: statsLoading } = useUserStats();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  const [isUpgrading, setIsUpgrading] = useState(false);

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
            <h1 className="text-xl font-bold tracking-tight">Your Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 py-12">
        
        {/* Profile Card */}
        <section className="bg-[#111111] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D97D] opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00D97D] to-[#00A85C] flex items-center justify-center font-bold text-black text-4xl shadow-[0_0_20px_rgba(0,217,125,0.3)]">
              {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl font-bold tracking-tight mb-1">
                {user.name || user.email?.split('@')[0]}
              </h2>
              <p className="text-slate-400 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2">
                  <span className="text-[#FBB724]">🔥</span>
                  <span className="font-semibold">{stats?.current_streak || 0} Day Streak</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2">
                  <span className="text-[#4DBFFF]">⭐</span>
                  <span className="font-semibold">Level {stats?.levelInfo?.currentLevel || 1}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Lifetime Statistics */}
          <section>
            <h3 className="text-xl font-bold mb-4 px-1">Lifetime Statistics</h3>
            <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
              
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">📚</div>
                  <span className="font-medium">Total Passages Read</span>
                </div>
                <span className="text-2xl font-bold text-white">{stats?.total_sessions || 0}</span>
              </div>
              
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00D97D]/10 flex items-center justify-center text-xl">🎯</div>
                  <span className="font-medium">Average Accuracy</span>
                </div>
                <span className="text-2xl font-bold text-[#00D97D]">{stats?.average_accuracy || 0}%</span>
              </div>
              
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FBB724]/10 flex items-center justify-center text-xl">✨</div>
                  <span className="font-medium">Total XP Earned</span>
                </div>
                <span className="text-2xl font-bold text-[#FBB724]">{stats?.total_xp?.toLocaleString() || 0}</span>
              </div>
              
            </div>
          </section>

          {/* Account Settings */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold mb-4 px-1">Account & Subscription</h3>
            
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold">Subscription Tier</h4>
                  <p className="text-sm text-slate-400">Manage your billing and plan.</p>
                </div>
                <div className="px-3 py-1 bg-[#00D97D]/10 text-[#00D97D] border border-[#00D97D]/20 rounded-full text-sm font-bold uppercase tracking-wider">
                  {stats?.tier || 'Free'}
                </div>
              </div>
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full py-3 bg-[#00D97D] hover:bg-[#00B85C] disabled:bg-white/10 disabled:cursor-not-allowed border border-[#00D97D]/20 text-black disabled:text-slate-500 rounded-xl font-bold transition-colors mb-2"
              >
                {isUpgrading 
                  ? 'PREPARING CHECKOUT...' 
                  : stats?.tier === 'unlimited' 
                    ? 'Manage Subscription' 
                    : 'Upgrade to Unlimited'}
              </button>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-3xl p-6">
              <h4 className="font-bold mb-4 text-error">Danger Zone</h4>
              
              <button
                onClick={handleSignOut}
                className="w-full py-3 bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </section>
          
        </div>
      </main>
    </div>
  );
}
