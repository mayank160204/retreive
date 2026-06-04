// Types and interfaces used throughout the app

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
  tier: 'free' | 'unlimited';
  subscription_id: string | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | null;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  sessions_completed: number;
}

export interface Session {
  id: string;
  user_id: string;
  pdf_id: string;
  passages: Passage[];
  words_read: number;
  accuracy_percentage: number;
  time_duration_seconds: number;
  xp_earned: number;
  mcq_score: number;
  completed_at: Date | null;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface Passage {
  id: string;
  text: string;
  word_count: number;
  order: number;
  mcq?: MCQ;
}

export interface MCQ {
  id: string;
  passage_id: string;
  question: string;
  options: string[];
  correct_answer: number; // 0-3 index
  explanation: string;
}

export interface LeaderboardEntry {
  user_id: string;
  rank: number;
  points: number;
  username: string;
  avatar_url: string | null;
  session_count: number;
  accuracy_avg: number;
  current_streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlock_condition: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlocked_at: Date | null;
}

export interface UserStats {
  total_words: number;
  average_accuracy: number;
  total_sessions: number;
  total_xp: number;
  current_level: number;
  current_streak: number;
  personal_records: PersonalRecords;
}

export interface PersonalRecords {
  highest_word_count: number;
  highest_accuracy_percentage: number;
  longest_session_minutes: number;
  fastest_reading_speed: number;
  most_consecutive_correct_mcqs: number;
  longest_streak: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'badge_unlocked' | 'level_up' | 'streak_milestone' | 'leaderboard_rank_change';
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  data?: Record<string, unknown>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_cents: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  stripe_price_id: string;
}
