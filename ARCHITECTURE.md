# RETRIEVE MCAT App - System Architecture & Design

**Project:** RETRIEVE MCAT Study App  
**Version:** 1.0 (MVP)  
**Date:** May 31, 2026  
**Status:** Architecture Complete (Ready for Implementation)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [High-Level Architecture Diagram](#high-level-architecture-diagram)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Technology Stack](#technology-stack)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Real-Time Features](#real-time-features)
10. [Authentication Flow](#authentication-flow)
11. [Payment Flow](#payment-flow)
12. [Deployment Architecture](#deployment-architecture)

---

## System Overview

**RETRIEVE** is a voice-enabled MCAT study app with real-time word highlighting, gamification, and social features.

### Core Value Proposition
- **Voice-driven learning** — Users speak answers; Deepgram converts speech-to-text in real-time
- **Real-time highlighting** — Words sync word-by-word with audio in karaoke mode
- **Instant feedback** — MCQ validation and XP/streak updates in real-time
- **Gamified engagement** — Streaks, levels, badges, and leaderboards drive retention
- **Social features** — Friend competition, global leaderboards, profile sharing

### User Journeys

```
New User Flow:
Landing Page → Signup → Auth → Dashboard → Start First Session → Reader → MCQ → XP Gained → Streak Starts

Returning User Flow:
Landing Page → Signin → Dashboard → Continue Session → Reader → MCQ → XP/Streak Updated

Engagement Loop:
Session Complete → XP Reward → Streak Counter → Badge Unlock (animation) → Leaderboard Update → Motivation to Return
```

---

## High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Browser)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React 18 + Next.js 14 (TypeScript)                      │   │
│  │  - Landing Page (Marketing)                             │   │
│  │  - Auth Pages (Signup/Signin)                           │   │
│  │  - Dashboard (Protected)                                │   │
│  │  - Reader (Karaoke Mode, Protected)                     │   │
│  │  - MCQ Modal (Quiz, Protected)                          │   │
│  │  - Leaderboard (Social, Protected)                      │   │
│  │  - Badges (Achievements, Protected)                     │   │
│  │  - Profile (User, Protected)                            │   │
│  │  - Settings (Account, Protected)                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│         ↓ HTTP/WebSocket ↓              ↓ WebSocket ↓           │
└────────────────────────────────────────────────────────────────┘
         │                                 │
         ↓                                 ↓
┌─────────────────────┐    ┌──────────────────────────┐
│   Firebase / Auth   │    │   Deepgram WebSocket API │
│  - Email/Password   │    │  - Real-time Speech-to-  │
│  - Google OAuth     │    │    Text Conversion       │
│  - JWT Tokens       │    │  - Word-Level Timing     │
└─────────────────────┘    └──────────────────────────┘
         │                                 │
         ↓                                 ↓
┌──────────────────────────────────────────────────────┐
│     VERCEL (Serverless Edge + Functions)            │
│  ┌─────────────────────────────────────────────────┐ │
│  │ API Routes (Next.js 14 Edge Functions)         │ │
│  │  - /api/auth/* (Signup, Signin, Logout)        │ │
│  │  - /api/users/* (Profile, Stats)               │ │
│  │  - /api/sessions/* (Create, Update, Complete)  │ │
│  │  - /api/leaderboard/* (Fetch rankings)         │ │
│  │  - /api/badges/* (Unlock, Fetch)               │ │
│  │  - /api/stripe/* (Subscription webhooks)       │ │
│  │  - /api/deepgram/* (Ephemeral token)           │ │
│  │  - /api/presigned-urls (Asset upload)          │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────┐
│          FIREBASE (Backend Services)                 │
│  ┌────────────────────────────────────────────────┐  │
│  │ Firestore (Real-Time Database)                │  │
│  │  - users (profiles, stats, preferences)       │  │
│  │  - sessions (reading history, scores)         │  │
│  │  - leaderboard (weekly rankings)              │  │
│  │  - badges (achievement definitions)           │  │
│  │  - passages (MCAT passages corpus)            │  │
│  │  - mcqs (multiple choice questions)           │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ Firebase Storage (Assets)                      │  │
│  │  - User avatars                               │  │
│  │  - Badge images                               │  │
│  │  - Passage audio files                        │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────────┐
│            STRIPE (Payment Processing)               │
│  - Customer records                                  │
│  - Subscription management                          │
│  - Billing history                                   │
└──────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
User Input (Email/Password)
  ↓
[AuthForm Component]
  ↓
Firebase Authentication
  ├─ Valid? → Create JWT Token → Store in secure cookie
  └─ Invalid? → Show error message
  ↓
[Redirect to Dashboard]
  ↓
useAuth() Hook retrieves user from context
  ↓
Protected routes check auth state
```

### 2. Reading Session Flow

```
User clicks "Start Session" on Dashboard
  ↓
[POST /api/sessions/create]
  ├─ Create session doc in Firestore
  ├─ Fetch passage from Firestore
  ├─ Fetch audio file URL from Firebase Storage
  └─ Get Deepgram ephemeral token from /api/deepgram/token
  ↓
[Reader Component loads]
  ├─ Initialize Deepgram WebSocket
  ├─ Start audio playback
  └─ Stream audio to Deepgram
  ↓
Deepgram returns word-by-word timing
  ↓
[PassageText Component]
  ├─ Highlight current word in real-time
  ├─ Track user's word position
  ├─ Detect misread words
  └─ Calculate accuracy (correct/total words)
  ↓
Reading completes OR MCQ modal appears
  ↓
[MCQModal Component]
  ├─ Display question + 4 options
  ├─ User selects answer
  └─ [POST /api/sessions/answer]
  ↓
Backend processes answer
  ├─ Correct? → Add XP, update streak, unlock badges
  └─ Incorrect? → Show explanation
  ↓
[POST /api/sessions/complete]
  ├─ Save session to Firestore
  ├─ Update user stats (total points, accuracy, sessions count)
  ├─ Update leaderboard (real-time)
  ├─ Check badge unlock conditions
  └─ Trigger celebration animations
  ↓
Dashboard updates in real-time (Firestore listeners)
  ├─ Streak counter increments
  ├─ XP total updates
  ├─ Level progress bar updates
  └─ New badges displayed
```

### 3. Real-Time Leaderboard Update Flow

```
User completes session with high score
  ↓
[POST /api/sessions/complete]
  ↓
Backend updates:
  1. User doc in Firestore (new XP)
  2. Leaderboard doc (weekly rankings)
  3. Badges doc (check unlock conditions)
  ↓
Firestore triggers real-time listeners on all connected clients
  ↓
Leaderboard page component receives update
  ├─ User's rank changes
  ├─ Other users' positions shift
  └─ Animation triggers (rank slide, XP counter)
  ↓
Other users' screens update automatically (no refresh needed)
```

### 4. Badge Unlock Flow

```
User completes 10th session
  ↓
Backend check: badges unlock conditions met?
  ├─ "First Reader" badge unlocked (1st session)
  ├─ "Streak Master" badge unlocked (10+ day streak)
  ├─ "Perfect Score" badge unlocked (100% accuracy)
  └─ etc.
  ↓
[BadgeUnlockAnimation Component]
  ├─ Show modal: "🎉 Badge Unlocked!"
  ├─ Confetti animation (1200ms)
  ├─ Badge slide-in animation (400ms)
  ├─ Play sound effect (optional)
  └─ Auto-close after 3 seconds
  ↓
Badge added to user's badge gallery
  ↓
Leaderboard may show badge icon next to user name (optional)
```

---

## Technology Stack

### Frontend
| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 14 (App Router) | React framework with SSR/SSG |
| Language | TypeScript | Type safety, better DX |
| UI Library | React 18 | Component-based UI |
| Styling | Tailwind CSS | Utility-first CSS |
| Components | Shadcn/ui | Accessible component library |
| Animations | Framer Motion | Page/scroll animations |
| Animations | CSS Modules | Micro-animations |
| Animations | Canvas API | Confetti effect |
| State Mgmt | React Context | User auth state |
| State Mgmt | Zustand | Global stores (leaderboard, session) |

### Backend Services
| Service | Purpose | Features |
|---------|---------|----------|
| Firebase Auth | Authentication | Email/password, Google OAuth, JWT |
| Firestore | Database | Real-time sync, collections, listeners |
| Firebase Storage | File Storage | Images, audio, user uploads |
| Vercel Functions | API Routes | Serverless backend functions |

### Third-Party APIs
| Service | Purpose | Integration |
|---------|---------|-------------|
| Deepgram | Speech Recognition | WebSocket, real-time STT |
| Stripe | Payments | Subscriptions, webhooks |

### Hosting & CDN
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting, auto-deploy |
| Vercel Analytics | Performance monitoring |
| Firebase Hosting | Optional static asset CDN |

---

## Frontend Architecture

### Page Structure (Next.js App Router)

```
src/app/
├── (public)/                    # Public pages (no auth required)
│   ├── page.tsx                # Landing page /
│   ├── auth/
│   │   ├── signup/page.tsx      # /auth/signup
│   │   ├── signin/page.tsx      # /auth/signin
│   │   ├── forgot-password/...  # /auth/forgot-password
│   │   └── reset-password/...   # /auth/reset-password
│   └── layout.tsx               # Layout for public pages (no sidebar)
│
├── (protected)/                 # Protected pages (auth required)
│   ├── dashboard/page.tsx       # /dashboard
│   ├── reader/page.tsx          # /reader
│   ├── leaderboard/page.tsx     # /leaderboard
│   ├── badges/page.tsx          # /badges
│   ├── profile/[userId]/...     # /profile/[userId]
│   ├── settings/page.tsx        # /settings
│   └── layout.tsx               # Layout for app pages (with sidebar)
│
└── api/                         # API routes (Next.js serverless)
    ├── auth/...
    ├── users/...
    ├── sessions/...
    ├── leaderboard/...
    ├── badges/...
    ├── stripe/...
    └── deepgram/...
```

### Component Hierarchy

```
App
├── RootLayout (Provider wrapper)
│   ├── AuthProvider (Firebase)
│   ├── ThemeProvider (Dark mode)
│   └── ToastProvider (Notifications)
│
├── Public Pages
│   ├── Landing Page
│   │   ├── Hero (Confetti animation)
│   │   ├── HowItWorks (3 cards, stagger animation)
│   │   ├── Features (4 sections)
│   │   ├── SocialProof (Testimonials)
│   │   ├── Pricing (2 cards)
│   │   ├── FAQ (Accordion)
│   │   └── CTA (Final button)
│   │
│   └── Auth Pages
│       ├── SignupForm
│       ├── SigninForm
│       ├── GoogleAuthButton
│       └── FormInput (Reusable)
│
└── Protected Pages
    ├── ProtectedLayout (Sidebar, Header)
    │   ├── Header (Nav, User menu)
    │   ├── Sidebar (Mobile drawer)
    │   │
    │   ├── Dashboard Page
    │   │   ├── StreakCounter 🔥
    │   │   ├── LevelProgress
    │   │   ├── RecentSessions
    │   │   └── LeaderboardPreview
    │   │
    │   ├── Reader Page
    │   │   ├── KaraokeReader
    │   │   │   ├── PassageText (Words highlight)
    │   │   │   ├── ProgressBar
    │   │   │   └── ControlPanel (Play/pause, speed)
    │   │   │
    │   │   └── MCQModal (Quiz overlay)
    │   │       ├── Question
    │   │       ├── MCQOption (4x)
    │   │       ├── FeedbackDisplay
    │   │       └── ExplanationText
    │   │
    │   ├── Leaderboard Page
    │   │   ├── LeaderboardTabs (Global, Friends, Weekly)
    │   │   ├── LeaderboardTable
    │   │   ├── LeaderboardRow (Current user highlighted)
    │   │   └── Pagination
    │   │
    │   ├── Badges Page
    │   │   ├── BadgeGallery (Grid)
    │   │   ├── BadgeCard (Earned/locked)
    │   │   └── BadgeDetailModal
    │   │
    │   ├── Profile Page
    │   │   ├── ProfileHeader (Avatar, stats)
    │   │   ├── ProfileTabs (Badges, History, Friends)
    │   │   └── EditProfileModal
    │   │
    │   └── Settings Page
    │       ├── ChangePasswordForm
    │       ├── BillingSection
    │       └── DeleteAccountConfirmation
    │
    └── Shared Components
        ├── Button (Primary, Secondary, Danger)
        ├── Card (Entrance animation)
        ├── Modal (Generic container)
        ├── Avatar
        ├── Badge
        ├── ConfettiEffect
        ├── SkeletonLoader
        └── Toast (Notifications)
```

### State Management Structure

```
Auth Context (Firebase)
├── currentUser (User object or null)
├── isLoading (boolean)
└── error (string or null)

Zustand Stores:
├── userStore
│   ├── user (profile data)
│   ├── stats (XP, streak, level)
│   └── preferences (theme, notifications)
│
├── leaderboardStore
│   ├── global (all-time rankings)
│   ├── friends (friend rankings)
│   └── weekly (this week's rankings)
│
└── sessionStore
    ├── currentSession (active reading session)
    ├── accuracy (current word accuracy %)
    ├── xpGained (points earned this session)
    └── badgesUnlocked (new badges this session)
```

---

## Backend Architecture

### Vercel Edge Functions (API Routes)

```
/api/auth/
├── signup          POST - Create new user account
├── signin          POST - Authenticate user
└── logout          POST - Logout user (clear cookie)

/api/users/
├── [userId]        GET - Fetch user profile
├── [userId]        PATCH - Update user profile
└── [userId]/stats  GET - Fetch user stats (XP, streak, level)

/api/sessions/
├── create          POST - Start new reading session
├── [sessionId]     GET - Fetch session details
├── [sessionId]/answer POST - Submit MCQ answer
├── [sessionId]     PATCH - Update session progress
└── [sessionId]/complete POST - Mark session as complete (calculate XP, badge unlocks)

/api/leaderboard/
├── global          GET - Top 100 users all-time
├── friends         GET - Friends rankings
└── weekly          GET - This week's rankings

/api/badges/
├── [userId]/unlocked GET - User's unlocked badges
└── [badgeId]/unlock  POST - Award badge to user

/api/stripe/
├── create-subscription POST - Create Stripe subscription
├── manage-subscription GET - Get customer portal link
└── webhook            POST - Stripe webhook (payment confirmation)

/api/deepgram/
└── token           POST - Generate ephemeral WebSocket token

/api/passages/
├── [passageId]     GET - Fetch passage + audio URL
└── list            GET - List all passages with metadata

/api/mcqs/
├── [mcqId]         GET - Fetch MCQ question
└── list            GET - List all MCQs with metadata
```

---

## Database Schema

### Firestore Collections

#### users
```
Collection: users
Document ID: Firebase UID

{
  uid: string,
  email: string,
  name: string,
  avatar_url: string | null,
  tier: "free" | "unlimited",
  subscription_id: string | null,
  total_xp: number,
  level: number,
  current_streak: number,
  longest_streak: number,
  sessions_completed: number,
  total_accuracy: number,
  badges_unlocked: string[], // badge IDs
  friends: string[], // user UIDs
  created_at: timestamp,
  updated_at: timestamp
}
```

#### sessions
```
Collection: sessions
Document ID: Auto-generated

{
  user_id: string,
  passage_id: string,
  start_time: timestamp,
  end_time: timestamp,
  duration_seconds: number,
  accuracy: number (0-100),
  mcq_answer: string,
  mcq_correct: boolean,
  xp_gained: number,
  badges_unlocked: string[], // new badges from this session
  status: "in_progress" | "completed",
  created_at: timestamp
}
```

#### leaderboard (Weekly snapshots)
```
Collection: leaderboard
Document ID: YYYY-WW (e.g., "2026-23" for week 23)

{
  week: string,
  rankings: [
    {
      rank: 1,
      user_id: string,
      user_name: string,
      xp_this_week: number,
      total_xp: number,
      sessions_this_week: number,
      accuracy: number
    },
    ...
  ],
  created_at: timestamp,
  updated_at: timestamp
}
```

#### badges
```
Collection: badges
Document ID: badge_id (e.g., "first_reader")

{
  id: string,
  name: string,
  description: string,
  icon_url: string,
  unlock_condition: string, // "sessions >= 10" or "accuracy >= 95"
  rarity: "common" | "uncommon" | "rare" | "legendary",
  created_at: timestamp
}
```

#### passages
```
Collection: passages
Document ID: passage_id

{
  id: string,
  title: string,
  content: string (full text),
  audio_url: string (GCS URL to MP3),
  duration_seconds: number,
  difficulty: "easy" | "medium" | "hard",
  topic: string,
  created_at: timestamp
}
```

#### mcqs
```
Collection: mcqs
Document ID: mcq_id

{
  id: string,
  passage_id: string, // Links to passage
  question: string,
  options: [
    { id: "A", text: string },
    { id: "B", text: string },
    { id: "C", text: string },
    { id: "D", text: string }
  ],
  correct_answer: "A" | "B" | "C" | "D",
  explanation: string,
  difficulty: "easy" | "medium" | "hard",
  created_at: timestamp
}
```

---

## API Endpoints

### Authentication Endpoints

**POST /api/auth/signup**
```
Request:
{
  email: string,
  password: string,
  name: string
}

Response (200):
{
  uid: string,
  email: string,
  name: string,
  token: string (JWT)
}

Response (400):
{ error: "Email already exists" }
```

**POST /api/auth/signin**
```
Request:
{
  email: string,
  password: string
}

Response (200):
{
  uid: string,
  email: string,
  token: string (JWT)
}

Response (401):
{ error: "Invalid credentials" }
```

### User Endpoints

**GET /api/users/[userId]**
```
Response (200):
{
  uid: string,
  name: string,
  avatar_url: string,
  tier: "free" | "unlimited",
  total_xp: number,
  level: number,
  current_streak: number,
  sessions_completed: number,
  total_accuracy: number
}
```

**PATCH /api/users/[userId]**
```
Request:
{
  name?: string,
  avatar_url?: string
}

Response (200):
{ success: true, user: {...} }
```

### Session Endpoints

**POST /api/sessions/create**
```
Request:
{
  passage_id: string
}

Response (200):
{
  session_id: string,
  passage: { id, title, content, audio_url, duration_seconds },
  deepgram_token: string
}
```

**POST /api/sessions/[sessionId]/answer**
```
Request:
{
  mcq_answer: "A" | "B" | "C" | "D"
}

Response (200):
{
  correct: boolean,
  explanation: string,
  xp_gained: number,
  badges_unlocked: [...],
  new_level: number,
  new_streak: number
}
```

**POST /api/sessions/[sessionId]/complete**
```
Request:
{
  accuracy: number (0-100),
  duration: number (seconds)
}

Response (200):
{
  xp_gained: number,
  badges_unlocked: [...],
  user_stats: {
    total_xp: number,
    level: number,
    current_streak: number,
    sessions_completed: number
  }
}
```

### Leaderboard Endpoints

**GET /api/leaderboard/global**
```
Response (200):
{
  rankings: [
    {
      rank: 1,
      user_id: string,
      user_name: string,
      total_xp: number,
      avatar_url: string
    },
    ...
  ],
  user_rank: number (current user's rank)
}
```

**GET /api/leaderboard/weekly**
```
Response (200):
{
  week: "2026-23",
  rankings: [...],
  user_rank_this_week: number
}
```

### Badge Endpoints

**GET /api/badges/[userId]/unlocked**
```
Response (200):
{
  unlocked_badges: [
    {
      id: string,
      name: string,
      icon_url: string,
      unlocked_at: timestamp
    },
    ...
  ]
}
```

### Stripe Endpoints

**POST /api/stripe/create-subscription**
```
Request:
{
  tier: "unlimited"
}

Response (200):
{
  client_secret: string,
  subscription_id: string
}
```

**POST /api/stripe/webhook**
```
Handles:
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
```

### Deepgram Endpoints

**POST /api/deepgram/token**
```
Response (200):
{
  token: string,
  expires_in: number (seconds)
}
```

---

## Real-Time Features

### Firestore Real-Time Listeners

The app uses Firestore real-time listeners to keep data synchronized across devices:

```typescript
// Example: Listen to user stats in real-time
onSnapshot(doc(db, "users", userId), (doc) => {
  const user = doc.data();
  setUser(user); // Update UI immediately
});

// Example: Listen to leaderboard changes
onSnapshot(collection(db, "leaderboard"), (snapshot) => {
  const rankings = snapshot.docs.map(doc => doc.data());
  updateLeaderboard(rankings); // UI updates automatically
});
```

### Deepgram WebSocket Connection

Real-time speech-to-text with word-level timing:

```typescript
// WebSocket connection in reader component
const ws = new WebSocket("wss://api.deepgram.com/v1/listen?model=nova-2");

// Stream audio chunks
microphone.onData((chunk) => {
  ws.send(chunk);
});

// Receive word-by-word transcription
ws.onmessage = (msg) => {
  const { transcript, words } = JSON.parse(msg.data);
  
  // words = [ { word: "The", start: 0.0, end: 0.3 }, ... ]
  // Update UI: highlight word at current playback time
  updateHighlight(currentTime, words);
};
```

---

## Authentication Flow

```
┌─────────────────────────────────────────┐
│ User visits app                         │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Check Firebase auth state               │
│ (Stored in secure cookie)               │
└──────────────────┬──────────────────────┘
                   ↓
            ┌──────────────┐
            │ Logged in?   │
            └─┬────────────┘
         Yes │         No
            ↓         ↓
    ┌───────────────────────────┐
    │ Access protected pages    │ Landing page only
    │ (Dashboard, Reader, etc)  │
    │                           │
    │ useAuth() hook provides   │
    │ currentUser + logout()    │
    └───────────────────────────┘
```

---

## Payment Flow

```
User clicks "Upgrade to Unlimited"
  ↓
[POST /api/stripe/create-subscription]
  ├─ Create Stripe customer record
  ├─ Generate ephemeral payment session
  └─ Return client secret
  ↓
Stripe Hosted Checkout opens
  (User enters card details)
  ↓
Payment processing
  ├─ Success? → Subscription created
  └─ Failed? → Show error
  ↓
Stripe webhook fires
  [POST /api/stripe/webhook]
  ├─ Update Firestore user doc (tier = "unlimited")
  ├─ Create Firebase auth claim (custom tier)
  └─ Grant access to unlimited features
  ↓
Client detects user tier change (real-time listener)
  ├─ Unlock unlimited sessions
  ├─ Show "Unlimited" badge in UI
  └─ Enable unlimited session duration
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│ GitHub Repository (Main branch)          │
│ - Source code                           │
│ - Environment variables (.env.local)    │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ GitHub Actions (CI/CD Pipeline)         │
│ - Run tests (npm run test)              │
│ - Lint code (npm run lint)              │
│ - Build (npm run build)                 │
└──────────────────┬──────────────────────┘
                   ↓ (if tests pass)
┌─────────────────────────────────────────┐
│ Vercel (Hosting + Edge Functions)       │
│ - Auto-deploy from GitHub               │
│ - Preview URL for staging               │
│ - Production URL (retrieve.app)         │
│ - Global CDN for static assets          │
│ - Serverless functions auto-scale       │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Firebase (Backend Services)             │
│ - Firestore database                    │
│ - Firebase Auth                         │
│ - Firebase Storage                      │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Monitoring & Analytics                  │
│ - Vercel Analytics (performance)        │
│ - Sentry (error tracking)               │
│ - Firebase Analytics (user behavior)    │
└─────────────────────────────────────────┘
```

### Environment Variables (Vercel)

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx

NEXT_PUBLIC_DEEPGRAM_API_KEY=xxx (ephemeral token only, not on client)

SENTRY_AUTH_TOKEN=xxx
```

---

## Key Architectural Decisions

### 1. **Next.js 14 App Router**
- **Why:** Latest routing paradigm, better type safety with TypeScript, built-in optimizations
- **Trade-off:** Smaller ecosystem of middleware compared to pages router
- **Decision:** App Router for future-proof architecture

### 2. **Firestore for Real-Time**
- **Why:** Real-time listeners make leaderboard/streak updates instant; no polling needed
- **Trade-off:** Requires security rules expertise; can't use complex SQL joins
- **Decision:** Real-time sync is core feature; document-based structure works

### 3. **Deepgram WebSocket**
- **Why:** Word-level timing + real-time STT enables karaoke experience
- **Trade-off:** WebSocket requires different architecture than HTTP; ephemeral tokens needed
- **Decision:** Karaoke differentiator requires WebSocket

### 4. **Stripe for Payments**
- **Why:** Managed subscriptions; webhook handling; no PCI compliance burden
- **Trade-off:** Transaction fees; webhook complexity
- **Decision:** Stripe handles complexity; focus on product

### 5. **Vercel for Hosting**
- **Why:** Next.js + Vercel integration; auto-deploy from GitHub; global edge functions
- **Trade-off:** Vendor lock-in; limited customization
- **Decision:** DevX priority; Vercel ecosystem best-in-class

### 6. **Zustand for State Management**
- **Why:** Lightweight; hooks-based; smaller bundle than Redux
- **Trade-off:** Fewer abstractions; less community plugins
- **Decision:** App is simple enough; Zustand sufficient

### 7. **Tailwind + Shadcn/ui for Styling**
- **Why:** Dark mode built-in; pre-built accessible components; rapid iteration
- **Trade-off:** Utility CSS learning curve; limited customization of components
- **Decision:** Ship faster; design system locked

### 8. **Firebase Auth**
- **Why:** Built-in Google OAuth; JWT tokens; secure session management
- **Trade-off:** Limited customization; vendor lock-in
- **Decision:** Auth not differentiator; Firebase handles well

---

## Scalability Considerations

### Current Limits (MVP)
- Firestore: Up to 1,000 concurrent connections per database
- Deepgram: Quota-based (plan-dependent)
- Stripe: Unlimited (handles scale)
- Vercel: Auto-scales serverless functions

### Future Scaling
- **Database:** Migrate to Cloud SQL + Firestore hybrid for complex queries
- **Speech Recognition:** Cache Deepgram results; batch processing for off-peak
- **Leaderboard:** Move to Redis for high-frequency updates
- **Assets:** Move to CDN with regional caching
- **Functions:** Optimize cold start times; migrate to Vercel Pro

---

## Security Model

### Authentication
- Firebase Auth handles passwords (hashed, bcrypt)
- JWT tokens in secure HTTP-only cookies
- CORS restricted to domain only

### Authorization
- Firestore security rules enforce per-user data access
- API routes validate auth before database queries
- User IDs never exposed in URLs (use Firebase UID internally)

### Data Protection
- HTTPS enforced on all connections
- Firestore backups automated
- User data encrypted at rest (Firebase default)

### API Security
- Rate limiting on all endpoints
- Input validation on all user-submitted data
- OWASP Top 10 compliance verified

---

## Performance Targets

### Core Web Vitals
- **FCP (First Contentful Paint):** < 1.5s
- **LCP (Largest Contentful Paint):** < 2.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **Lighthouse Score:** 95+ on all pages

### Real-Time Performance
- **WebSocket connection:** < 500ms to establish
- **Deepgram latency:** < 100ms for word-level updates
- **Database sync:** < 1 second for leaderboard updates
- **Animation FPS:** 60 FPS on desktop, 50+ on mobile

---

## Testing Strategy

### Unit Tests
- Component rendering (React Testing Library)
- Utility functions (Jest)
- Custom hooks
- **Target:** 85%+ coverage

### Integration Tests
- Auth flow (signup → signin → logout)
- Reading session flow (start → progress → complete)
- Leaderboard update flow
- Badge unlock flow

### E2E Tests (Cypress)
- Full user journey (landing → signup → first session → leaderboard)
- Cross-browser (Chrome, Safari, Firefox)
- Mobile viewport testing

### Performance Tests
- Lighthouse CI (automated)
- WebVitals monitoring (Vercel Analytics)
- Load testing (Deepgram, Firestore)

---

## Monitoring & Observability

### Error Tracking
- Sentry for JavaScript errors
- Firebase Cloud Logging for backend errors
- Automated Slack alerts for critical errors

### Performance Monitoring
- Vercel Analytics for page speed
- Firebase Analytics for user behavior
- Custom event tracking for feature usage

### Health Checks
- Synthetic monitoring (Uptime Robot)
- Database query performance (Firestore metrics)
- API response times (Vercel logs)

---

## Conclusion

RETRIEVE's architecture is designed for:
✅ **Real-time responsiveness** (WebSocket + Firestore listeners)
✅ **Rapid iteration** (Next.js + Vercel ecosystem)
✅ **Type safety** (TypeScript throughout)
✅ **Scalability** (Serverless + managed services)
✅ **User experience** (60 FPS animations, instant feedback)
✅ **Security** (Firebase + modern best practices)

Ready for implementation in Stage 6. All dependencies documented. All integration points defined.

---

**Next:** Stage 6 - Build Pass (actual code implementation)
