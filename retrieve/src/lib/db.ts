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
import { getLevelInfo, calculateSessionXP, type SessionStats } from './xp-engine';

// ============================================================================
// USERS COLLECTION
// ============================================================================

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

  const userData: User = {
    id: userId,
    email,
    name,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    created_at: new Date(),
    tier: 'free', // Default tier
    subscription_id: null,
    subscription_status: null,
    total_xp: 0,
    level: 1,
    current_streak: 0,
    longest_streak: 0,
    sessions_completed: 0,
  };

  await setDoc(userRef, userData);

  // Create empty stats document
  const statsRef = doc(firestore, `users/${userId}/stats/overall`);
  await setDoc(statsRef, {
    total_words: 0,
    average_accuracy: 0,
    total_sessions: 0,
    total_xp: 0,
    current_level: 1,
    current_streak: 0,
    personal_records: {
      highest_word_count: 0,
      highest_accuracy_percentage: 0,
      longest_session_minutes: 0,
      fastest_reading_speed: 0,
      most_consecutive_correct_mcqs: 0,
      longest_streak: 0,
    },
  });
}

/**
 * Get user document from Firestore
 */
export async function getUserDocument(userId: string): Promise<User | null> {
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? (snapshot.data() as User) : null;
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
  const userData = userDoc.data() as User;

  const newTotalXP = (userData.total_xp || 0) + xp;
  const levelInfo = getLevelInfo(newTotalXP);
  const newLevel = levelInfo.currentLevel;

  await updateDoc(userRef, {
    total_xp: newTotalXP,
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
  const breakdown = calculateSessionXP(stats);
  const firestore = ensureFirebaseFirestoreAvailable(db);
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data() as User;

  const newTotalXP = (userData.total_xp || 0) + breakdown.totalXP;
  const levelInfo = getLevelInfo(newTotalXP);

  await updateDoc(userRef, {
    total_xp: newTotalXP,
    level: levelInfo.currentLevel,
    sessions_completed: (userData.sessions_completed || 0) + 1,
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
  const userData = userDoc.data() as User & { last_session_date?: Timestamp };

  const today = new Date(sessionDate ?? Date.now());
  today.setHours(0, 0, 0, 0);

  const lastSessionTimestamp = userData.last_session_date;
  let newStreak = 1;

  if (lastSessionTimestamp) {
    const lastDate = lastSessionTimestamp.toDate();
    lastDate.setHours(0, 0, 0, 0);
    const dayDiff = Math.round((today.getTime() - lastDate.getTime()) / 86_400_000);

    if (dayDiff === 0) {
      // Same day — don't change streak
      return;
    } else if (dayDiff === 1) {
      // Consecutive day — increment
      newStreak = (userData.current_streak || 0) + 1;
    } else {
      // Gap in streak — reset to 1
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(userData.longest_streak || 0, newStreak);

  await updateDoc(userRef, {
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_session_date: Timestamp.fromDate(today),
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
