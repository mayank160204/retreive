/**
 * useUserStats — Live Firestore hook for the authenticated user's profile & stats.
 *
 * Returns real-time data from Firestore. Uses onSnapshot to update automatically
 * when the user's XP, streak, level, or tier changes (e.g., after payment).
 */

'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { User, Session } from '@/types';
import { getLevelInfo, getLevelTitle, type LevelInfo } from '@/lib/xp-engine';
import { getUserSessions } from '@/lib/db';

export interface UserStatsWithLevel extends User {
  levelInfo: LevelInfo;
  levelTitle: string;
}

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStatsWithLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || !db) {
      setLoading(false);
      return;
    }

    // DEMO MODE BYPASS
    if (user.id === 'demo-user') {
      const levelInfo = getLevelInfo(user.total_xp || 840);
      setStats({
        ...user,
        levelInfo,
        levelTitle: getLevelTitle(levelInfo.currentLevel),
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time updates on the user document
    const userRef = doc(db, 'users', user.id);
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as User;
          const levelInfo = getLevelInfo(data.total_xp || 0);
          const levelTitle = getLevelTitle(levelInfo.currentLevel);

          setStats({
            ...data,
            id: snapshot.id,
            levelInfo,
            levelTitle,
          });
        } else {
          setStats(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useUserStats snapshot error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

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

    // DEMO MODE BYPASS
    if (user.id === 'demo-user') {
      setSessions([
        { id: '1', user_id: 'demo-user', pdf_id: 'Biochemistry_Chapter_3.pdf', passages: [], mcq_score: 0, status: 'completed', words_read: 850, time_duration_seconds: 300, xp_earned: 150, accuracy_percentage: 94, completed_at: new Date(Date.now() - 86400000) },
        { id: '2', user_id: 'demo-user', pdf_id: 'Physics_Equations.pdf', passages: [], mcq_score: 0, status: 'completed', words_read: 420, time_duration_seconds: 180, xp_earned: 80, accuracy_percentage: 88, completed_at: new Date(Date.now() - 172800000) }
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);

    getUserSessions(user.id, limitCount)
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user?.id, limitCount]);

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
export function useLeaderboard(type: 'weekly' | 'alltime' = 'weekly', limitCount = 10) {
  const [entries, setEntries] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/leaderboard?type=${type}&limit=${limitCount}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
