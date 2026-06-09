'use client';

/**
 * useUserStats — Live Firestore hook for the authenticated user's profile & stats.
 *
 * Returns real-time data from Firestore. Uses onSnapshot to update automatically
 * when the user's XP, streak, level, or tier changes (e.g., after payment).
 */

import { useState, useEffect } from 'react';
import { onSnapshot, doc, collection, query, orderBy, limit, QuerySnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { User, Session } from '@/types';
import { getLevelInfo, getLevelTitle, type LevelInfo } from '@/lib/xp-engine';
import { getUserSessions } from '@/lib/db';

export interface UserStatsWithLevel extends User {
  levelInfo: LevelInfo;
  levelTitle: string;
  total_sessions?: number;
  average_accuracy?: number;
  badges?: string[];
  displayName?: string;
  weeklyXP?: number;
}

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStatsWithLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const firestore = db;
    if (!firestore) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(firestore, 'users', user.id);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const totalWords = data.totalWordsRead || 0;
        const levelInfo = getLevelInfo(totalWords);
        
        setStats({
          ...user,
          ...data,
          id: user.id,
          current_streak: data.currentStreak || data.current_streak || 0,
          currentStreak: data.currentStreak || data.current_streak || 0,
          longest_streak: data.longestStreak || data.longest_streak || 0,
          longestStreak: data.longestStreak || data.longest_streak || 0,
          sessions_completed: data.totalSessions || data.sessions_completed || 0,
          sessionsCompleted: data.totalSessions || data.sessions_completed || 0,
          total_sessions: data.totalSessions || data.total_sessions || 0,
          totalSessions: data.totalSessions || data.total_sessions || 0,
          average_accuracy: data.avgAccuracy || data.average_accuracy || 0,
          averageAccuracy: data.avgAccuracy || data.average_accuracy || 0,
          avgAccuracy: data.avgAccuracy || data.average_accuracy || 0,
          total_xp: data.totalXP || data.total_xp || 0,
          totalXP: data.totalXP || data.total_xp || 0,
          level: data.level || 1,
          tier: data.plan || data.tier || 'free',
          levelInfo,
          levelTitle: data.levelTitle || getLevelTitle(levelInfo.currentLevel),
          displayName: data.displayName || data.name || user?.name || '',
          weeklyXP: data.weeklyXP || 0,
          weeklyXPResetDate: data.weeklyXPResetDate || '',
        } as any);
      }
      setLoading(false);
    }, (err) => {
      console.error('onSnapshot stats error:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  return { stats, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────

export function useRecentSessions(limitCount = 5) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setSessions([]);
    setLoading(false);
  }, [user?.id]);

  return { sessions, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useStreakCountdown — Returns the hours remaining until the user's streak
 * resets (midnight local time). Updates every minute.
 */
export function useStreakCountdown(): { hoursLeft: number; minutesLeft: number; isUrgent: boolean } {
  const [timeLeft, setTimeLeft] = useState(() => getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 60_000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return {
    hoursLeft: timeLeft.hours,
    minutesLeft: timeLeft.minutes,
    isUrgent: timeLeft.hours < 2, // Urgent if less than 2 hours remain
  };
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return { hours, minutes };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useLeaderboard — Fetches the current week's leaderboard from the API.
 */
export function useLeaderboard(type: 'weekly' | 'alltime' = 'weekly', limitCount = 5) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const firestore = db;
    if (!firestore) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(firestore, 'leaderboard'),
      orderBy('weeklyXP', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data();
        const username = data.displayName || data.username || 'Anonymous';
        const points = data.weeklyXP || data.points || 0;
        return {
          id: doc.id,
          user_id: doc.id,
          username,
          displayName: username,
          points,
          weekly_xp: points,
          weeklyXP: points,
          ...data
        };
      });
      setEntries(docs);
      setLoading(false);
    }, (err: FirestoreError) => {
      console.error('onSnapshot leaderboard error:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [type, limitCount]);

  return { entries, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * usePendingQueueCount — Returns the number of offline writes pending sync.
 * Useful for showing a sync indicator.
 */
export function usePendingQueueCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const { getPendingCount } = await import('@/lib/offline-queue');
      const n = await getPendingCount();
      if (!cancelled) setCount(n);
    };

    check();
    const interval = setInterval(check, 15_000);
    window.addEventListener('online', check);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('online', check);
    };
  }, []);

  return count;
}
