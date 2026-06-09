import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db, ensureFirebaseFirestoreAvailable } from './firebase';
import {
  User,
  Session,
  Passage,
  MCQ,
  Badge,
  LeaderboardEntry,
} from '@/types';
import { getLevelInfo, getLevelTitle, calculateSessionXP, type SessionStats } from './xp-engine';

// ============================================================================
// USERS COLLECTION
// ============================================================================

export function getMostRecentMonday(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff));
  return monday.toISOString().slice(0, 10);
}

/**
 * Create a new user document in Firestore
 * Called automatically from auth context on signup
 */
export async function createUserDocument(
  userId: string,
  email: string,
  name: string
): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);

  await setDoc(userRef, {
    displayName: name,
    email,
    plan: 'free',
    tier: 'free', // support tier field too
    createdAt: serverTimestamp(),
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
    totalWordsRead: 0,
    totalXP: 0,
    level: 1,
    levelTitle: 'Rookie',
    totalSessions: 0,
    avgAccuracy: 0,
    streakFreezes: 2,
    personalRecords: {
      highestAccuracy: 0,
      highestMcqAccuracy: 0,
      mostWordsInSession: 0,
      longestSessionMinutes: 0,
      maxConsecutiveCorrect: 0
    },
    badges: [],
    weeklyXP: 0,
    weeklyXPResetDate: getMostRecentMonday()
  }, { merge: true });
}

/**
 * Get user document from Firestore
 */
export async function getUserDocument(userId: string): Promise<User | null> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    ...data,
    id: userId,
    email: data.email || '',
    name: data.displayName || data.name || 'User',
    avatar_url: data.avatarUrl || data.avatar_url || null,
    avatarUrl: data.avatarUrl || data.avatar_url || null,
    created_at: data.createdAt || data.created_at || null,
    createdAt: data.createdAt || data.created_at || null,
    tier: data.plan || data.tier || 'free',
    subscription_id: data.subscriptionId || data.subscription_id || null,
    subscriptionId: data.subscriptionId || data.subscription_id || null,
    subscription_status: data.subscriptionStatus || data.subscription_status || null,
    subscriptionStatus: data.subscriptionStatus || data.subscription_status || null,
    total_xp: data.totalXP || data.total_xp || 0,
    totalXP: data.totalXP || data.total_xp || 0,
    level: data.level || 1,
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
    displayName: data.displayName || data.name || 'User',
    weeklyXP: data.weeklyXP || 0,
    weeklyXPResetDate: data.weeklyXPResetDate || '',
  } as User;
}

/**
 * Update user document
 */
export async function updateUserDocument(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, updates);
}

/**
 * Upgrade user to unlimited tier
 */
export async function upgradeUserTier(
  userId: string,
  subscriptionId: string
): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, {
    tier: 'unlimited',
    subscription_id: subscriptionId,
    subscription_status: 'active',
  });
}

/**
 * Add XP to user and recalculate level using the proper scaling formula.
 * Returns the new level (for level-up detection).
 */
export async function addUserXP(userId: string, xp: number): Promise<number> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as any;

  const newTotalXP = (userData?.totalXP || userData?.total_xp || 0) + xp;
  const levelInfo = getLevelInfo(newTotalXP);
  const newLevel = levelInfo.currentLevel;

  await updateDoc(userRef, {
    totalXP: newTotalXP,
    level: newLevel,
  });

  return newLevel;
}

/**
 * Process a completed session: calculate XP via the engine, update user stats,
 * update the leaderboard, and return the XP breakdown.
 */
export async function processSessionXP(
  userId: string,
  stats: SessionStats
) {
  const totalMcqs = stats.mcqCorrect + stats.mcqIncorrect;
  const mcqAccuracy = totalMcqs > 0 ? Math.round((stats.mcqCorrect / totalMcqs) * 100) : 0;
  const breakdown = calculateSessionXP({
    wordsRead: stats.wordsRead,
    accuracyPercent: stats.accuracyPercent,
    mcqAccuracy,
    currentStreak: stats.currentStreak
  });
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as any;

  const newTotalXP = (userData?.totalXP || userData?.total_xp || 0) + breakdown.totalXP;
  const levelInfo = getLevelInfo(newTotalXP);

  const oldSessionsCount = userData?.totalSessions || userData?.sessions_completed || 0;
  const oldAverageAccuracy = userData?.avgAccuracy || userData?.average_accuracy || 0;
  const newSessionsCount = oldSessionsCount + 1;
  const newAverageAccuracy = Math.round(
    (oldAverageAccuracy * oldSessionsCount + stats.accuracyPercent) / newSessionsCount
  );

  await updateDoc(userRef, {
    totalXP: newTotalXP,
    level: levelInfo.currentLevel,
    totalSessions: newSessionsCount,
    avgAccuracy: newAverageAccuracy,
  });

  return { breakdown, newLevel: levelInfo.currentLevel, newTotalXP };
}

/**
 * Update user streak with proper consecutive-day logic.
 * Only increments if the last session was yesterday. Resets if gap > 1 day.
 */
export async function updateUserStreak(userId: string, sessionDate?: Date): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as any;

  const today = new Date(sessionDate ?? Date.now());
  today.setHours(0, 0, 0, 0);

  const lastSessionTimestamp = userData?.lastSessionDate || userData?.last_session_date;
  let newStreak = 1;

  if (lastSessionTimestamp) {
    const lastDate = lastSessionTimestamp instanceof Timestamp 
      ? lastSessionTimestamp.toDate() 
      : new Date(lastSessionTimestamp);
    lastDate.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((today.getTime() - lastDate.getTime()) / 86_400_000);

    if (dayDiff === 0) {
      // Same day — don't change streak
      return;
    } else if (dayDiff === 1) {
      // Consecutive day — increment
      newStreak = (userData?.currentStreak || userData?.current_streak || 0) + 1;
    } else {
      // Gap in streak — reset to 1
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(userData?.longestStreak || userData?.longest_streak || 0, newStreak);

  await updateDoc(userRef, {
    currentStreak: newStreak,
    longestStreak: longestStreak,
    lastSessionDate: Timestamp.fromDate(today),
  });
}

// ============================================================================
// SESSIONS COLLECTION
// ============================================================================

/**
 * Create a new study session
 */
export async function createSession(
  userId: string,
  pdfId: string,
  passages: Passage[]
): Promise<string> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const sessionsRef = collection(firestore, 'sessions');
  const sessionData: Omit<Session, 'id'> = {
    user_id: userId,
    pdf_id: pdfId,
    passages,
    words_read: 0,
    accuracy_percentage: 0,
    time_duration_seconds: 0,
    xp_earned: 0,
    mcq_score: 0,
    completed_at: null,
    status: 'in_progress',
  };

  const docRef = await new Promise<string>((resolve) => {
    const batch = writeBatch(firestore);
    const newSessionRef = doc(sessionsRef);
    batch.set(newSessionRef, sessionData);
    batch.commit().then(() => resolve(newSessionRef.id));
  });

  return docRef;
}

/**
 * Update session with completion data
 */
export async function completeSession(
  sessionId: string,
  data: {
    words_read: number;
    accuracy_percentage: number;
    time_duration_seconds: number;
    mcq_score: number;
  }
): Promise<number> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const sessionRef = doc(firestore, 'sessions', sessionId);

  // Calculate XP earned (100 base + 1 per word + accuracy bonus)
  const xpEarned = Math.floor(100 + data.words_read * 0.5 + data.accuracy_percentage * 0.5);

  await updateDoc(sessionRef, {
    ...data,
    xp_earned: xpEarned,
    completed_at: Timestamp.now(),
    status: 'completed',
  });

  return xpEarned;
}

/**
 * Get user's sessions
 */
export async function getUserSessions(userId: string, limitCount: number = 10): Promise<Session[]> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const q = query(
    collection(firestore, 'sessions'),
    where('user_id', '==', userId),
    orderBy('completed_at', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Session));
}

// ============================================================================
// LEADERBOARD COLLECTION
// ============================================================================

/**
 * Get weekly leaderboard
 */
export async function getWeeklyLeaderboard(weekId: string, limitCount: number = 100): Promise<LeaderboardEntry[]> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const q = query(
    collection(firestore, `leaderboard/${weekId}/users`),
    orderBy('points', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    user_id: doc.id,
    ...doc.data(),
  } as unknown as LeaderboardEntry));
}

/**
 * Update leaderboard entry
 */
export async function updateLeaderboardEntry(
  weekId: string,
  userId: string,
  entry: Partial<LeaderboardEntry>
): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const entryRef = doc(firestore, `leaderboard/${weekId}/users/${userId}`);
  await updateDoc(entryRef, entry);
}

// ============================================================================
// BADGES COLLECTION
// ============================================================================

/**
 * Get all available badges
 */
export async function getAllBadges(): Promise<Badge[]> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const snapshot = await getDocs(collection(firestore, 'badges'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Badge));
}

/**
 * Award badge to user
 */
export async function awardBadgeToUser(userId: string, badgeId: string): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userBadgesRef = doc(firestore, `userBadges/${userId}`);
  await updateDoc(userBadgesRef, {
    [`badges.${badgeId}`]: Timestamp.now(),
  }).catch(() => {
    // Create if doesn't exist
    return setDoc(userBadgesRef, {
      badges: {
        [badgeId]: Timestamp.now(),
      },
    });
  });
}

/**
 * Get user's badges
 */
export async function getUserBadges(userId: string): Promise<string[]> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userBadgesRef = doc(firestore, 'userBadges', userId);
  const snapshot = await getDoc(userBadgesRef);
  if (!snapshot.exists()) return [];
  
  const data = snapshot.data();
  return Object.keys(data.badges || {});
}

// ============================================================================
// PASSAGES & MCQs COLLECTION
// ============================================================================

/**
 * Get passages from a PDF upload
 */
export async function getPassagesFromPDF(pdfId: string): Promise<Passage[]> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const q = query(
    collection(firestore, 'passages'),
    where('pdf_id', '==', pdfId),
    orderBy('order', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Passage));
}

/**
 * Create passages from PDF parsing
 */
export async function createPassagesFromPDF(
  pdfId: string,
  passages: Omit<Passage, 'id'>[]
): Promise<string[]> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const batch = writeBatch(firestore);
  const ids: string[] = [];

  passages.forEach((passage, index) => {
    const passageRef = doc(collection(firestore, 'passages'));
    batch.set(passageRef, {
      ...passage,
      pdf_id: pdfId,
      order: index,
    });
    ids.push(passageRef.id);
  });

  await batch.commit();
  return ids;
}

/**
 * Get MCQ for a passage
 */
export async function getMCQForPassage(passageId: string): Promise<MCQ | null> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const q = query(
    collection(firestore, 'mcqs'),
    where('passage_id', '==', passageId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as MCQ;
}

/**
 * Create MCQ for a passage
 */
export async function createMCQ(mcqData: Omit<MCQ, 'id'>): Promise<string> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const mcqRef = doc(collection(firestore, 'mcqs'));
  await setDoc(mcqRef, mcqData);
  return mcqRef.id;
}

// ============================================================================
// PDF UPLOADS METADATA
// ============================================================================

/**
 * Create PDF upload metadata
 */
export async function createPDFUploadMetadata(
  userId: string,
  filename: string,
  storageUrl: string,
  passageCount: number
): Promise<string> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const uploadsRef = doc(collection(firestore, 'pdfUploads'));
  const metadata = {
    user_id: userId,
    filename,
    storage_url: storageUrl,
    passage_count: passageCount,
    created_at: Timestamp.now(),
    status: 'ready', // processing, ready, error
  };

  await setDoc(uploadsRef, metadata);
  return uploadsRef.id;
}

/**
 * Get user's PDF uploads
 */
export async function getUserPDFUploads(userId: string) {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const q = query(
    collection(firestore, 'pdfUploads'),
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Create notification for user
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: Record<string, any>
): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const notificationRef = doc(collection(firestore, `notifications/${userId}/messages`));
  await setDoc(notificationRef, {
    type,
    title,
    message,
    read: false,
    data: data || {},
    created_at: Timestamp.now(),
  });
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const notificationRef = doc(firestore, `notifications/${userId}/messages/${notificationId}`);
  await updateDoc(notificationRef, {
    read: true,
  });
}

/**
 * Get unread notifications
 */
export async function getUnreadNotifications(userId: string) {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const q = query(
    collection(firestore, `notifications/${userId}/messages`),
    where('read', '==', false),
    orderBy('created_at', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Atomic batch write for completed sessions
 */
export async function persistSessionResult(userId: string, sessionData: {
  pdfName: string;
  startedAt: Date;
  completedAt: Date;
  wordsRead: number;
  accuracy: number;
  mcqAccuracy: number;
  mcqCorrect: number;
  mcqIncorrect: number;
  passagesCompleted: number;
  totalPassages: number;
  durationMinutes: number;
  paragraphsCompleted: number[];
  lastPassageIndex: number;
  status: 'in-progress' | 'completed';
}, sessionId?: string) {
  const firestore = ensureFirebaseFirestoreAvailable(db);

  // 1. Fetch user document
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    throw new Error('User document does not exist.');
  }
  const userData = userSnap.data();

  // 2. Fetch recent sessions for badge validation
  const sessionsCollRef = collection(firestore, `users/${userId}/sessions`);
  const recentSnap = await getDocs(query(sessionsCollRef, orderBy('startedAt', 'desc'), limit(15)));
  const mockNewSession = {
    ...sessionData,
    startedAt: Timestamp.fromDate(sessionData.startedAt),
    completedAt: Timestamp.fromDate(sessionData.completedAt),
  };
  const recentSessions = [mockNewSession, ...recentSnap.docs.map(d => d.data())];

  // 3. Compute XP via xp-engine
  const xpBreakdown = calculateSessionXP({
    wordsRead: sessionData.wordsRead,
    accuracyPercent: sessionData.accuracy,
    mcqAccuracy: sessionData.mcqAccuracy,
    currentStreak: userData.currentStreak || 0
  });
  const xpEarned = xpBreakdown.totalXP;

  // 4. Streak Logic
  const today = new Date().toISOString().slice(0, 10);
  const last = userData.lastSessionDate;
  const yesterdayDate = new Date();
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  let currentStreak = userData.currentStreak || 0;
  let longestStreak = userData.longestStreak || 0;

  if (last === today) {
    // already counted today, no change
  } else if (last === yesterday) {
    // extend streak
    currentStreak += 1;
    if (currentStreak > longestStreak) longestStreak = currentStreak;
  } else {
    // streak broken
    currentStreak = 1;
  }
  const lastSessionDate = today;

  // 5. Weekly Reset check
  const currentMonday = getMostRecentMonday();
  const resetDate = userData.weeklyXPResetDate;
  let currentWeeklyXP = userData.weeklyXP || 0;
  let weeklyResetDate = userData.weeklyXPResetDate || currentMonday;

  if (!resetDate || resetDate < currentMonday) {
    currentWeeklyXP = 0;
    weeklyResetDate = currentMonday;
  }
  currentWeeklyXP += xpEarned;

  // 6. Level Calculation (derived from totalWordsRead)
  const totalWordsRead = (userData.totalWordsRead || 0) + sessionData.wordsRead;
  const levelInfo = getLevelInfo(totalWordsRead);
  const level = levelInfo.currentLevel;
  const levelTitle = getLevelTitle(level);

  // 7. Accuracy calculation (rolling average)
  const totalSessions = (userData.totalSessions || 0) + 1;
  const avgAccuracy = Math.round(
    (((userData.avgAccuracy || 0) * (totalSessions - 1)) + sessionData.accuracy) / totalSessions
  );

  // 8. Personal Records
  const prs = userData.personalRecords || {
    highestAccuracy: 0,
    highestMcqAccuracy: 0,
    mostWordsInSession: 0,
    longestSessionMinutes: 0,
    maxConsecutiveCorrect: 0
  };
  const updatedPrs = {
    highestAccuracy: Math.max(prs.highestAccuracy || 0, sessionData.accuracy),
    highestMcqAccuracy: Math.max(prs.highestMcqAccuracy || 0, sessionData.mcqAccuracy),
    mostWordsInSession: Math.max(prs.mostWordsInSession || 0, sessionData.wordsRead),
    longestSessionMinutes: Math.max(prs.longestSessionMinutes || 0, sessionData.durationMinutes),
    maxConsecutiveCorrect: Math.max(prs.maxConsecutiveCorrect || 0, sessionData.mcqCorrect || 0),
  };

  // 9. Check Badges
  const earnedBadges = userData.badges || [];
  const newBadges: string[] = [];

  // laser_focus
  if (sessionData.wordsRead >= 1000) {
    newBadges.push('laser_focus');
  }
  // accuracy_expert
  if (recentSessions.length >= 5 && recentSessions.slice(0, 5).every(s => (s.accuracy || 0) >= 90)) {
    newBadges.push('accuracy_expert');
  }
  // speed_reader
  if (recentSessions.length >= 3) {
    const avgWpm = recentSessions.slice(0, 3).reduce((sum, s) => {
      const words = s.wordsRead || 0;
      const mins = s.durationMinutes || 1;
      return sum + (words / mins);
    }, 0) / 3;
    if (avgWpm >= 50) {
      newBadges.push('speed_reader');
    }
  }
  // quiz_master
  const nowMs = Date.now();
  const last7DaysSessions = recentSessions.filter(s => {
    const started = s.startedAt instanceof Timestamp ? s.startedAt.toDate() : new Date(s.startedAt);
    return (nowMs - started.getTime()) <= 7 * 86400000;
  });
  if (last7DaysSessions.length > 0 && last7DaysSessions.every(s => (s.mcqAccuracy || 0) >= 90)) {
    newBadges.push('quiz_master');
  }
  // consistency_pro & streak badges
  if (currentStreak >= 30) {
    newBadges.push('consistency_pro');
    newBadges.push('streak_30');
  }
  if (currentStreak >= 7) {
    newBadges.push('streak_7');
  }
  if (currentStreak >= 100) {
    newBadges.push('streak_100');
  }
  // brain_athlete
  const week1 = recentSessions.filter(s => {
    const started = s.startedAt instanceof Timestamp ? s.startedAt.toDate() : new Date(s.startedAt);
    return (nowMs - started.getTime()) <= 7 * 86400000;
  });
  const week2 = recentSessions.filter(s => {
    const started = s.startedAt instanceof Timestamp ? s.startedAt.toDate() : new Date(s.startedAt);
    const age = nowMs - started.getTime();
    return age > 7 * 86400000 && age <= 14 * 86400000;
  });
  if (week1.length > 0 && week2.length > 0) {
    const avg1 = week1.reduce((sum, s) => sum + (s.mcqAccuracy || 0), 0) / week1.length;
    const avg2 = week2.reduce((sum, s) => sum + (s.mcqAccuracy || 0), 0) / week2.length;
    if ((avg1 - avg2) >= 15) {
      newBadges.push('brain_athlete');
    }
  }

  const finalBadgesSet = new Set([...earnedBadges, ...newBadges]);
  const finalBadgesArray = Array.from(finalBadgesSet);

  // 10. Perform Firestore batch write
  const batch = writeBatch(firestore);

  // a. Add or overwrite session document
  const newSessionDocRef = sessionId 
    ? doc(firestore, 'users', userId, 'sessions', sessionId)
    : doc(collection(userRef, 'sessions'));
  batch.set(newSessionDocRef, {
    ...sessionData,
    xpEarned,
    startedAt: Timestamp.fromDate(sessionData.startedAt),
    completedAt: Timestamp.fromDate(sessionData.completedAt),
  });

  // b. Update users/{uid}
  batch.update(userRef, {
    totalSessions,
    totalWordsRead,
    totalXP: (userData.totalXP || 0) + xpEarned,
    weeklyXP: currentWeeklyXP,
    weeklyXPResetDate: weeklyResetDate,
    avgAccuracy,
    currentStreak,
    longestStreak,
    lastSessionDate,
    level,
    levelTitle,
    personalRecords: updatedPrs,
    badges: finalBadgesArray
  });

  // c. Set doc leaderboard/{uid}
  const leaderboardRef = doc(firestore, 'leaderboard', userId);
  batch.set(leaderboardRef, {
    displayName: userData.displayName || userData.name || 'Anonymous User',
    weeklyXP: currentWeeklyXP,
    level,
    weeklyXPResetDate: weeklyResetDate,
    updatedAt: serverTimestamp(),
    currentStreak,
  });

  await batch.commit();

  return {
    xpEarned,
    level,
    levelTitle,
    currentStreak,
    newBadgesAwarded: newBadges.filter(b => !earnedBadges.includes(b))
  };
}

/**
 * Fetch latest in-progress session for resume support
 */
export async function getLatestInProgressSession(userId: string) {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const sessionsRef = collection(firestore, 'users', userId, 'sessions');
  const q = query(
    sessionsRef,
    where('status', '==', 'in-progress'),
    orderBy('startedAt', 'desc'),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Create a new in-progress study session doc in Firestore
 */
export async function createInProgressSession(userId: string, sessionData: {
  pdfName: string;
  startedAt: Date;
  completedAt: null;
  wordsRead: number;
  accuracy: number;
  mcqAccuracy: number;
  passagesCompleted: number;
  totalPassages: number;
  durationMinutes: number;
  paragraphsCompleted: number[];
  lastPassageIndex: number;
  status: 'in-progress';
}): Promise<string> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const docRef = doc(collection(firestore, 'users', userId, 'sessions'));
  await setDoc(docRef, {
    ...sessionData,
    startedAt: Timestamp.fromDate(sessionData.startedAt),
  });
  return docRef.id;
}

/**
 * Update an existing in-progress session doc
 */
export async function updateInProgressSession(
  userId: string,
  sessionId: string,
  updates: {
    wordsRead?: number;
    accuracy?: number;
    paragraphsCompleted?: number[];
    lastPassageIndex?: number;
    durationMinutes?: number;
  }
): Promise<void> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const docRef = doc(firestore, 'users', userId, 'sessions', sessionId);
  await updateDoc(docRef, updates);
}
