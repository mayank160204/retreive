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

/**
 * Calculate XP earned for a completed study session.
 * Returns a detailed breakdown with reasons for the UI to display.
 */
export function calculateSessionXP(stats: SessionStats): XPBreakdown {
  const reasons: string[] = [];

  // 1. Base XP: words read
  const baseXP = Math.floor(stats.wordsRead * XP_PER_WORD);
  reasons.push(`+${baseXP} XP for ${stats.wordsRead} words read`);

  // 2. Accuracy Bonus: scales from 0% at 60% accuracy to 50% at 100% accuracy
  let accuracyBonus = 0;
  if (stats.accuracyPercent >= ACCURACY_THRESHOLD) {
    const normalizedAccuracy =
      (stats.accuracyPercent - ACCURACY_THRESHOLD) / (100 - ACCURACY_THRESHOLD);
    const bonusRate = normalizedAccuracy * ACCURACY_BONUS_MAX;
    accuracyBonus = Math.floor(baseXP * bonusRate);
    if (accuracyBonus > 0) {
      reasons.push(
        `+${accuracyBonus} XP accuracy bonus (${stats.accuracyPercent.toFixed(0)}% accuracy)`
      );
    }
  }

  // 3. Speed Bonus: reward reading at a natural pace (~150 wpm)
  let speedBonus = 0;
  if (stats.durationSeconds > 0 && stats.wordsRead > 0) {
    const actualWpm = (stats.wordsRead / stats.durationSeconds) * 60;
    const wpmDiff = Math.abs(actualWpm - TARGET_WPM);

    if (wpmDiff <= SPEED_TOLERANCE_WPM) {
      // Perfect pace: full bonus
      speedBonus = SPEED_BONUS_MAX;
    } else if (wpmDiff <= SPEED_TOLERANCE_WPM * 2) {
      // Decent pace: partial bonus
      speedBonus = Math.floor(
        SPEED_BONUS_MAX * (1 - (wpmDiff - SPEED_TOLERANCE_WPM) / SPEED_TOLERANCE_WPM)
      );
    }

    if (speedBonus > 0) {
      const wpm = Math.round(actualWpm);
      reasons.push(`+${speedBonus} XP reading pace bonus (${wpm} wpm)`);
    }
  }

  // 4. MCQ Bonus
  const mcqBonus =
    stats.mcqCorrect * MCQ_CORRECT_BONUS - stats.mcqIncorrect * MCQ_INCORRECT_PENALTY;

  if (stats.mcqCorrect > 0) {
    reasons.push(`+${stats.mcqCorrect * MCQ_CORRECT_BONUS} XP for ${stats.mcqCorrect} correct MCQ(s)`);
  }
  if (stats.mcqIncorrect > 0) {
    reasons.push(`-${stats.mcqIncorrect * MCQ_INCORRECT_PENALTY} XP for ${stats.mcqIncorrect} incorrect MCQ(s)`);
  }

  // 5. First session bonus
  const firstSessionBonus = stats.isFirstSessionToday ? FIRST_SESSION_BONUS : 0;
  if (firstSessionBonus > 0) {
    reasons.push(`+${FIRST_SESSION_BONUS} XP first session of the day! 🔥`);
  }

  // 6. Pre-multiplier subtotal
  const preMultiplierXP = Math.max(0, baseXP + accuracyBonus + speedBonus + mcqBonus);

  // 7. Streak multiplier
  const streakMultiplier = getStreakMultiplier(stats.currentStreak);
  if (streakMultiplier > 1.0 && stats.currentStreak > 0) {
    reasons.push(
      `×${streakMultiplier.toFixed(1)} streak multiplier (${stats.currentStreak} day streak 🔥)`
    );
  }

  // 8. Final total
  const multipliedXP = Math.floor(preMultiplierXP * streakMultiplier);
  const totalXP = multipliedXP + firstSessionBonus;

  return {
    baseXP,
    accuracyBonus,
    speedBonus,
    mcqBonus: Math.max(0, mcqBonus),
    streakMultiplier,
    firstSessionBonus,
    totalXP: Math.max(0, totalXP),
    reasons,
  };
}

// ─── Level System ─────────────────────────────────────────────────────────────

/**
 * Calculate the XP required to reach a given level from level 1.
 * Uses scaling formula: sum of (BASE_XP_PER_LEVEL * level^1.2) for each level
 */
export function getXPRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  let totalXP = 0;
  for (let l = 1; l < level; l++) {
    totalXP += Math.floor(BASE_XP_PER_LEVEL * Math.pow(l, 1.2));
  }
  return totalXP;
}

/**
 * Get the XP threshold to go from level N to level N+1.
 */
export function getXPPerLevel(level: number): number {
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(level, 1.2));
}

/**
 * Calculate current level and progress from total cumulative XP.
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  if (totalXP < 0) totalXP = 0;

  let level = 1;
  let xpConsumed = 0;

  // Walk up levels until we can't fill the next one
  while (true) {
    const xpForThisLevel = getXPPerLevel(level);
    if (xpConsumed + xpForThisLevel > totalXP) {
      break;
    }
    xpConsumed += xpForThisLevel;
    level++;
  }

  const xpForCurrentLevel = getXPPerLevel(level);
  const xpIntoCurrentLevel = totalXP - xpConsumed;
  const progressPercent = Math.min(
    100,
    Math.floor((xpIntoCurrentLevel / xpForCurrentLevel) * 100)
  );

  return {
    currentLevel: level,
    currentXP: xpIntoCurrentLevel,
    xpToNextLevel: xpForCurrentLevel - xpIntoCurrentLevel,
    xpForCurrentLevel,
    progressPercent,
  };
}

/**
 * Human-readable level title based on level number.
 */
export function getLevelTitle(level: number): string {
  if (level >= 50) return 'MCAT Legend';
  if (level >= 40) return 'Grand Medic';
  if (level >= 30) return 'Senior Medic';
  if (level >= 20) return 'Elite Medic';
  if (level >= 15) return 'Advanced Medic';
  if (level >= 10) return 'Medic';
  if (level >= 7) return 'Resident';
  if (level >= 5) return 'Intern';
  if (level >= 3) return 'Pre-Med';
  return 'Rookie';
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
