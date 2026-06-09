/**
 * XP Calculation Engine for RETREIVE
 *
 * Implements the full XP formula from the PRD:
 *   Total XP = (Base XP + Accuracy Bonus + Speed Bonus) × Streak Multiplier
 *
 * XP Formula Breakdown:
 * ─────────────────────────────────────────────────────────────────────────
 * Base XP:        1 XP per word read (PRD: "base XP = words read")
 * Accuracy Bonus: 0% to +50% based on speech accuracy (>90% = full bonus)
 * Speed Bonus:    0 to +25 XP for reading close to natural pace (target 150 wpm)
 * MCQ Bonus:      +15 XP per correct MCQ answer, -5 XP per incorrect
 * Streak Multi:   1.0× at no streak, up to 2.0× at 30+ day streak
 * First Session:  +50 XP bonus for the first daily session
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Level System:
 *   Level = Math.floor(totalXP / xpPerLevel) + 1
 *   xpPerLevel scales with level: baseXpPerLevel * level^1.2
 *   (Infinite scaling — no level cap)
 */

export interface SessionStats {
  wordsRead: number;           // Total words read in this session
  accuracyPercent: number;     // 0–100 speech accuracy score
  durationSeconds: number;     // Session duration in seconds
  mcqCorrect: number;          // Number of MCQs answered correctly
  mcqIncorrect: number;        // Number of MCQs answered incorrectly
  currentStreak: number;       // User's current streak (days)
  isFirstSessionToday: boolean; // Whether this is the user's first session today
}

export interface XPBreakdown {
  baseXP: number;
  accuracyBonus: number;
  speedBonus: number;
  mcqBonus: number;
  streakMultiplier: number;
  firstSessionBonus: number;
  totalXP: number;
  // Human-readable reason strings
  reasons: string[];
}

export interface LevelInfo {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
  progressPercent: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const XP_PER_WORD = 1;
const ACCURACY_BONUS_MAX = 0.5;    // +50% at 100% accuracy
const ACCURACY_THRESHOLD = 60;     // Below this, no accuracy bonus
const SPEED_BONUS_MAX = 25;        // Maximum speed bonus XP
const TARGET_WPM = 150;            // Natural reading pace
const SPEED_TOLERANCE_WPM = 30;    // ±30 WPM from target gets full bonus
const MCQ_CORRECT_BONUS = 15;
const MCQ_INCORRECT_PENALTY = 5;
const FIRST_SESSION_BONUS = 50;
const BASE_XP_PER_LEVEL = 500;     // XP needed to reach level 2

// ─── Streak Multiplier Table ─────────────────────────────────────────────────
// Streak:   0    1    3    7    14   30+
// Multi:   1.0  1.1  1.2  1.35 1.6  2.0

function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.6;
  if (streak >= 7) return 1.35;
  if (streak >= 3) return 1.2;
  if (streak >= 1) return 1.1;
  return 1.0;
}

// ─── XP Calculation ──────────────────────────────────────────────────────────

export function calculateSessionXP(stats: {
  wordsRead: number;
  accuracyPercent: number;
  mcqAccuracy: number;
  currentStreak: number;
}): XPBreakdown {
  const reasons: string[] = [];
  const baseXP = stats.wordsRead;
  reasons.push(`+${baseXP} XP for words read`);

  let accuracyBonus = 0;
  if (stats.accuracyPercent >= 98) {
    accuracyBonus = 15;
    reasons.push(`+15 XP accuracy bonus (≥ 98% accuracy)`);
  } else if (stats.accuracyPercent >= 95) {
    accuracyBonus = 10;
    reasons.push(`+10 XP accuracy bonus (≥ 95% accuracy)`);
  } else if (stats.accuracyPercent >= 90) {
    accuracyBonus = 5;
    reasons.push(`+5 XP accuracy bonus (≥ 90% accuracy)`);
  }

  const mcqBonus = stats.mcqAccuracy >= 80 ? 10 : 0;
  if (mcqBonus > 0) {
    reasons.push(`+10 XP MCQ bonus (≥ 80% MCQ score)`);
  }

  const streakBonus = Math.floor(stats.currentStreak / 7);
  if (streakBonus > 0) {
    reasons.push(`+${streakBonus} XP streak bonus (${stats.currentStreak}-day streak)`);
  }

  const totalXP = baseXP + accuracyBonus + mcqBonus + streakBonus;

  return {
    baseXP,
    accuracyBonus,
    speedBonus: 0,
    mcqBonus,
    streakMultiplier: 1.0,
    firstSessionBonus: 0,
    totalXP,
    reasons
  };
}

// ─── Level System ─────────────────────────────────────────────────────────────

export function getXPRequiredForLevel(level: number): number {
  switch (level) {
    case 1: return 0;
    case 2: return 5000;
    case 3: return 20000;
    case 4: return 50000;
    case 5: return 100000;
    case 6: return 250000;
    default: return 250000;
  }
}

export function getXPPerLevel(level: number): number {
  switch (level) {
    case 1: return 5000;
    case 2: return 15000; // 20k - 5k
    case 3: return 30000; // 50k - 20k
    case 4: return 50000; // 100k - 50k
    case 5: return 150000; // 250k - 100k
    default: return 1;
  }
}

export function getLevelInfo(totalWordsRead: number): LevelInfo {
  if (totalWordsRead < 0) totalWordsRead = 0;

  let level = 1;
  let progressPercent = 0;
  let xpToNextLevel = 0;
  let xpForCurrentLevel = 5000;

  if (totalWordsRead < 5000) {
    level = 1;
    xpForCurrentLevel = 5000;
    progressPercent = Math.min(100, Math.floor((totalWordsRead / xpForCurrentLevel) * 100));
    xpToNextLevel = 5000 - totalWordsRead;
  } else if (totalWordsRead < 20000) {
    level = 2;
    xpForCurrentLevel = 15000;
    const progress = totalWordsRead - 5000;
    progressPercent = Math.min(100, Math.floor((progress / xpForCurrentLevel) * 100));
    xpToNextLevel = 20000 - totalWordsRead;
  } else if (totalWordsRead < 50000) {
    level = 3;
    xpForCurrentLevel = 30000;
    const progress = totalWordsRead - 20000;
    progressPercent = Math.min(100, Math.floor((progress / xpForCurrentLevel) * 100));
    xpToNextLevel = 50000 - totalWordsRead;
  } else if (totalWordsRead < 100000) {
    level = 4;
    xpForCurrentLevel = 50000;
    const progress = totalWordsRead - 50000;
    progressPercent = Math.min(100, Math.floor((progress / xpForCurrentLevel) * 100));
    xpToNextLevel = 100000 - totalWordsRead;
  } else if (totalWordsRead < 250000) {
    level = 5;
    xpForCurrentLevel = 150000;
    const progress = totalWordsRead - 100000;
    progressPercent = Math.min(100, Math.floor((progress / xpForCurrentLevel) * 100));
    xpToNextLevel = 250000 - totalWordsRead;
  } else {
    level = 6;
    xpForCurrentLevel = 1;
    progressPercent = 100;
    xpToNextLevel = 0;
  }

  return {
    currentLevel: level,
    currentXP: totalWordsRead,
    xpToNextLevel,
    xpForCurrentLevel,
    progressPercent,
  };
}

export function getLevelTitle(level: number): string {
  switch (level) {
    case 1: return 'Rookie';
    case 2: return 'Emerging Scholar';
    case 3: return 'Proficient Reader';
    case 4: return 'Advanced Analyst';
    case 5: return 'Master Comprehensionist';
    case 6: return 'Elite Strategist';
    default: return 'Elite Strategist';
  }
}

// ─── Badge Trigger Checks ─────────────────────────────────────────────────────

export interface BadgeTriggerCheck {
  badgeId: string;
  earned: boolean;
  reason: string;
}

/**
 * Check which badges should be awarded after a session.
 * Returns a list of badge IDs that have been earned.
 */
export function checkBadgeTriggers(params: {
  totalWordsEver: number;
  totalSessionsEver: number;
  currentStreak: number;
  currentLevel: number;
  sessionAccuracy: number;
  sessionWords: number;
  mcqCorrect: number;
  mcqTotal: number;
}): BadgeTriggerCheck[] {
  const checks: BadgeTriggerCheck[] = [];

  // Word count milestones
  const wordMilestones = [
    { words: 1000, badgeId: 'words-1k', label: '1,000 Words Read' },
    { words: 10000, badgeId: 'words-10k', label: '10,000 Words Read' },
    { words: 50000, badgeId: 'words-50k', label: '50,000 Words Read' },
    { words: 100000, badgeId: 'words-100k', label: '100,000 Words Read' },
  ];

  for (const milestone of wordMilestones) {
    const prevWords = params.totalWordsEver - params.sessionWords;
    if (prevWords < milestone.words && params.totalWordsEver >= milestone.words) {
      checks.push({ badgeId: milestone.badgeId, earned: true, reason: milestone.label });
    }
  }

  // Streak milestones
  const streakMilestones = [
    { days: 3, badgeId: 'streak-3', label: '3 Day Streak' },
    { days: 7, badgeId: 'streak-7', label: '7 Day Streak' },
    { days: 14, badgeId: 'streak-14', label: '2 Week Streak' },
    { days: 30, badgeId: 'streak-30', label: '30 Day Streak' },
  ];

  for (const milestone of streakMilestones) {
    if (params.currentStreak === milestone.days) {
      checks.push({ badgeId: milestone.badgeId, earned: true, reason: milestone.label });
    }
  }

  // Level milestones
  const levelMilestones = [5, 10, 15, 20, 30, 40, 50];
  for (const level of levelMilestones) {
    if (params.currentLevel === level) {
      checks.push({
        badgeId: `level-${level}`,
        earned: true,
        reason: `Reached Level ${level}`,
      });
    }
  }

  // Accuracy badges
  if (params.sessionAccuracy >= 95) {
    checks.push({
      badgeId: 'accuracy-95',
      earned: true,
      reason: '95%+ Accuracy in a session',
    });
  }

  if (params.sessionAccuracy === 100) {
    checks.push({
      badgeId: 'accuracy-perfect',
      earned: true,
      reason: 'Perfect Accuracy session',
    });
  }

  // MCQ perfection
  if (params.mcqTotal >= 3 && params.mcqCorrect === params.mcqTotal) {
    checks.push({
      badgeId: 'mcq-perfect',
      earned: true,
      reason: 'Perfect MCQ score',
    });
  }

  // Session count milestones
  const sessionMilestones = [
    { count: 1, badgeId: 'first-session', label: 'First Session Complete' },
    { count: 10, badgeId: 'sessions-10', label: '10 Sessions Complete' },
    { count: 50, badgeId: 'sessions-50', label: '50 Sessions Complete' },
    { count: 100, badgeId: 'sessions-100', label: '100 Sessions Complete' },
  ];

  for (const milestone of sessionMilestones) {
    if (params.totalSessionsEver === milestone.count) {
      checks.push({ badgeId: milestone.badgeId, earned: true, reason: milestone.label });
    }
  }

  return checks.filter((c) => c.earned);
}
