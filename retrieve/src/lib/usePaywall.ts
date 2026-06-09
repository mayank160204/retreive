'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

export interface UsePaywallResult {
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  checkPaywall: (allowSingleSessionCheck?: boolean) => boolean;
  isFree: boolean;
}

export function usePaywall(autoCheck = true): UsePaywallResult {
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [isFree, setIsFree] = useState(true);

  useEffect(() => {
    setIsFree(!user || user.tier === 'free');
  }, [user]);

  /**
   * Helper to check the current user session metrics and return whether they should be paywalled.
   * @param allowSingleSessionCheck If true, allows checking if they completed > 1 session (suitable for summary page).
   */
  const checkPaywall = useCallback((allowSingleSessionCheck = false) => {
    const freeUser = !user || user.tier === 'free';
    if (!freeUser) return false;

    const threshold = allowSingleSessionCheck ? 1 : 0;
    const hasCompletedLocal = typeof window !== 'undefined' && localStorage.getItem('has_completed_session') === 'true';
    const totalSessions = user && typeof (user as any).totalSessions === 'number' ? (user as any).totalSessions : 0;
    const sessionsCompleted = user && typeof (user as any).sessions_completed === 'number' ? (user as any).sessions_completed : 0;

    const hasCompleted = hasCompletedLocal || totalSessions > threshold || sessionsCompleted > threshold;

    if (hasCompleted) {
      setShowPaywall(true);
      return true;
    }
    return false;
  }, [user]);

  // Synchronously evaluate paywall on mount/load for generic page loads
  useEffect(() => {
    if (!autoCheck) return;
    const freeUser = !user || user.tier === 'free';
    if (freeUser) {
      const hasCompletedLocal = typeof window !== 'undefined' && localStorage.getItem('has_completed_session') === 'true';
      const totalSessions = user && typeof (user as any).totalSessions === 'number' ? (user as any).totalSessions : 0;
      const sessionsCompleted = user && typeof (user as any).sessions_completed === 'number' ? (user as any).sessions_completed : 0;
      
      if (hasCompletedLocal || totalSessions > 0 || sessionsCompleted > 0) {
        setShowPaywall(true);
      }
    } else {
      setShowPaywall(false);
    }
  }, [user, autoCheck]);

  return {
    showPaywall,
    setShowPaywall,
    checkPaywall,
    isFree,
  };
}
