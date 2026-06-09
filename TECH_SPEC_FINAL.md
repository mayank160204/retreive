# STAGE 5: Tech Spec

**Project:** RETRIEVE MCAT Study App  
**Date:** May 31, 2026  
**Status:** In Progress  
**Dependencies:** ✅ Stages 0–4 Complete  
**Deliverable:** TECH_SPEC_FINAL.md

---

## Stage 5 Objective

Convert design + interactions into buildable architecture. This document specifies:
- Next.js file structure and routing
- React component hierarchy
- Design token system (colors, typography, spacing)
- Animation library setup
- State management
- Database schema (Firestore)
- API endpoints and WebSocket setup (Deepgram)
- Authentication (Firebase Auth)
- Payment integration (Stripe)
- Deployment strategy (Vercel)

---

## Tech Stack (Confirmed)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework, SSR/SSG |
| **Framework** | React 18 | UI components, hooks |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS + Shadcn/ui | Utility CSS + component library |
| **Animations** | Framer Motion | Page/scroll animations |
| **Animations** | CSS Modules | Micro-interactions |
| **Animations** | Canvas API | Confetti effect |
| **State** | React Context + Zustand | Global state (user, session, leaderboard) |
| **Backend** | Firebase / Firestore | Real-time database, auth |
| **Auth** | Firebase Authentication | Email/password + Google OAuth |
| **Audio** | Deepgram WebSocket API | Speech recognition (real-time) |
| **Payments** | Stripe | Subscription billing |
| **Hosting** | Vercel | Deployment, serverless functions |
| **Monitoring** | Vercel Analytics | Performance tracking |

---

## Project Structure

```
retrieve/
├── public/
│   ├── assets/
│   │   ├── hero-illustration.webp
│   │   ├── badges/ (15 badge images)
│   │   ├── icons/ (step icons, social icons)
│   │   └── confetti.json (Lottie)
│   ├── fonts/
│   │   ├── inter-*.woff2 (preload)
│   │   └── plus-jakarta-sans-*.woff2 (fallback)
│   └── robots.txt
│
├── src/
│   ├── app/ (Next.js App Router)
│   │   ├── layout.tsx (Root layout, Tailwind, theme provider)
│   │   ├── globals.css (Tailwind imports, custom CSS variables)
│   │   ├── page.tsx (Landing page route)
│   │   ├── dashboard/
│   │   │   └── page.tsx (Dashboard, protected)
│   │   ├── reader/
│   │   │   └── page.tsx (Karaoke reader, protected)
│   │   ├── leaderboard/
│   │   │   └── page.tsx (Global leaderboard)
│   │   ├── badges/
│   │   │   └── page.tsx (Badge gallery)
│   │   ├── profile/
│   │   │   └── page.tsx (User profile, protected)
│   │   ├── settings/
│   │   │   └── page.tsx (Settings, protected)
│   │   ├── auth/
│   │   │   ├── signup/page.tsx
│   │   │   ├── signin/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   └── api/
│   │       ├── auth/ (Firebase auth endpoints)
│   │       ├── users/ (GET profile, POST update)
│   │       ├── sessions/ (POST create, GET history)
│   │       ├── leaderboard/ (GET global, GET friends)
│   │       ├── badges/ (GET user badges)
│   │       ├── stripe/ (POST subscribe, webhook)
│   │       └── deepgram/ (POST token for WebSocket auth)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx (Navigation, dark theme logo)
│   │   │   ├── Sidebar.tsx (Mobile drawer, hamburger menu)
│   │   │   ├── Footer.tsx (Landing page footer)
│   │   │   └── ProtectedLayout.tsx (App layout for logged-in users)
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx (Main CTA, confetti animation)
│   │   │   ├── HowItWorks.tsx (3-step cards)
│   │   │   ├── Features.tsx (Reader mockup, gamification mockup, social mockup)
│   │   │   ├── SocialProof.tsx (Testimonials, star rating)
│   │   │   ├── Pricing.tsx (Free vs. paid cards, CTAs)
│   │   │   ├── FAQ.tsx (Accordion items)
│   │   │   └── CTA.tsx (Final call-to-action)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardCard.tsx (Reusable stat card)
│   │   │   ├── StreakCounter.tsx (🔥 with pulse animation)
│   │   │   ├── LevelProgress.tsx (Progress bar + counter)
│   │   │   ├── RecentSessions.tsx (Table of recent sessions)
│   │   │   ├── QuickStats.tsx (Accuracy, points, sessions)
│   │   │   └── LeaderboardPreview.tsx (Top 5 users)
│   │   │
│   │   ├── reader/
│   │   │   ├── KaraokeReader.tsx (Main reader component)
│   │   │   ├── PassageText.tsx (Highlighted words, real-time sync)
│   │   │   ├── TranscriptViewer.tsx (Debug mode, shows transcript)
│   │   │   ├── ProgressBar.tsx (Reading progress, color states)
│   │   │   └── ControlPanel.tsx (Play/pause, speed control)
│   │   │
│   │   ├── mcq/
│   │   │   ├── MCQModal.tsx (Full-screen quiz, animations)
│   │   │   ├── MCQOption.tsx (Single option, hover/select states)
│   │   │   ├── FeedbackDisplay.tsx (Correct/incorrect feedback, explanation)
│   │   │   └── ProgressSummary.tsx (Session summary, stat counters)
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardTable.tsx (Ranked list)
│   │   │   ├── LeaderboardRow.tsx (User row, highlight own)
│   │   │   ├── LeaderboardTabs.tsx (Global, friends, weekly)
│   │   │   └── FilterSort.tsx (Filter by tier, sort by points)
│   │   │
│   │   ├── badges/
│   │   │   ├── BadgeGallery.tsx (Grid of badges)
│   │   │   ├── BadgeCard.tsx (Individual badge, locked state)
│   │   │   ├── BadgeDetailModal.tsx (Badge info modal)
│   │   │   └── BadgeUnlockAnimation.tsx (Celebration modal)
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx (User avatar, name, stats)
│   │   │   ├── ProfileTabs.tsx (Tabs: Badges, History, Friends)
│   │   │   ├── SessionHistory.tsx (Table of past sessions)
│   │   │   └── FriendsList.tsx (Following/followers)
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthForm.tsx (Email/password input)
│   │   │   ├── GoogleAuthButton.tsx (Google OAuth button)
│   │   │   ├── FormInput.tsx (Accessible input with focus state)
│   │   │   └── ValidationMessage.tsx (Error/success messages)
│   │   │
│   │   ├── shared/
│   │   │   ├── Button.tsx (CTA button, variants: primary, secondary, danger)
│   │   │   ├── Card.tsx (Reusable card with entrance animation)
│   │   │   ├── Modal.tsx (Generic modal container)
│   │   │   ├── Badge.tsx (Display badge component)
│   │   │   ├── Avatar.tsx (User avatar image)
│   │   │   ├── Spinner.tsx (Loading state)
│   │   │   ├── ConfettiEffect.tsx (Canvas confetti)
│   │   │   ├── SkeletonLoader.tsx (Content placeholder)
│   │   │   └── Toast.tsx (Notification system)
│   │
│   ├── lib/
│   │   ├── firebase.ts (Firebase config + auth helpers)
│   │   ├── firestore.ts (Firestore queries + mutations)
│   │   ├── deepgram.ts (Deepgram WebSocket client)
│   │   ├── stripe.ts (Stripe client for payments)
│   │   ├── api-client.ts (Fetch wrapper with auth header)
│   │   ├── auth-context.ts (Firebase auth context provider)
│   │   ├── hooks.ts (Custom React hooks)
│   │   │   ├── useAuth() — Get current user + loading
│   │   │   ├── useSession() — Current reading session
│   │   │   ├── useLeaderboard() — Leaderboard data
│   │   │   ├── useBadges() — User badges
│   │   │   ├── useDeepgram() — Speech recognition setup
│   │   │   ├── usePagination() — Pagination logic
│   │   │   └── useMediaQuery() — Responsive design
│   │   ├── animations.ts (Framer Motion variants)
│   │   ├── constants.ts (App constants, colors, timings)
│   │   ├── types.ts (TypeScript types)
│   │   │   ├── User interface
│   │   │   ├── Session interface
│   │   │   ├── Leaderboard interface
│   │   │   ├── Badge interface
│   │   │   └── MCQ interface
│   │   ├── utils.ts (Utility functions)
│   │   │   ├── formatTime()
│   │   │   ├── calculateAccuracy()
│   │   │   ├── calculateXP()
│   │   │   ├── highlightWord()
│   │   │   └── calculateStreak()
│   │   └── validators.ts (Form validation)
│   │
│   ├── styles/
│   │   ├── animations.css (Keyframe animations)
│   │   ├── tokens.css (CSS variables for colors, spacing, typography)
│   │   └── accessibility.css (Focus states, high contrast)
│   │
│   └── middleware.ts (Next.js middleware for auth routes)
│
├── .env.local (Firebase keys, Stripe keys, Deepgram API)
├── .env.example (Template for env vars)
├── tailwind.config.ts (Tailwind theme override)
├── tsconfig.json (TypeScript config)
├── next.config.js (Next.js config: Image optimization, etc.)
├── package.json (Dependencies)
└── README.md (Setup instructions)
```

---

## Design Tokens (CSS Variables)

**File:** `src/styles/tokens.css`

```css
:root {
  /* Color Palette */
  --color-black: #0f0f0f;
  --color-white: #ffffff;
  --color-gray-900: #1a1a1a;
  --color-gray-800: #222222;
  --color-gray-700: #333333;
  --color-gray-600: #444444;
  --color-gray-400: #999999;
  --color-green-primary: #00d97d;
  --color-green-hover: #58cc02;
  --color-green-light: rgba(0, 217, 125, 0.1);
  --color-red-error: #ff4444;
  --color-red-light: rgba(255, 68, 68, 0.1);
  --color-yellow-warning: #ffb84d;
  --color-blue-accent: #4da6ff;
  --color-pink-accent: #ff6b6b;

  /* Typography */
  --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-jakarta: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 48px;
  --font-size-5xl: 64px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing */
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-32: 32px;
  --space-40: 40px;
  --space-48: 48px;
  --space-56: 56px;
  --space-64: 64px;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.4);
  --shadow-green: 0 4px 12px rgba(0, 217, 125, 0.3);
  --shadow-green-lg: 0 12px 24px rgba(0, 217, 125, 0.2);

  /* Animation Timings */
  --duration-fast: 100ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --duration-slowest: 800ms;

  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  --ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Z-Index Scales */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0.01ms;
    --duration-base: 0.01ms;
    --duration-slow: 0.01ms;
    --duration-slower: 0.01ms;
    --duration-slowest: 0.01ms;
  }
}
```

---

## Tailwind Configuration

**File:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0f0f0f',
        gray: {
          900: '#1a1a1a',
          800: '#222222',
          700: '#333333',
          600: '#444444',
          400: '#999999',
        },
        green: {
          primary: '#00d97d',
          hover: '#58cc02',
          light: 'rgba(0, 217, 125, 0.1)',
        },
        red: {
          error: '#ff4444',
          light: 'rgba(255, 68, 68, 0.1)',
        },
        yellow: {
          warning: '#ffb84d',
        },
        blue: {
          accent: '#4da6ff',
        },
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        jakarta: ['var(--font-jakarta)'],
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)',
      },
      spacing: {
        4: 'var(--space-4)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
        40: 'var(--space-40)',
        48: 'var(--space-48)',
        56: 'var(--space-56)',
        64: 'var(--space-64)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        green: 'var(--shadow-green)',
        'green-lg': 'var(--shadow-green-lg)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
        slowest: 'var(--duration-slowest)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## State Management

### Auth State (Firebase)

```typescript
// src/lib/auth-context.ts
import { createContext, useContext } from 'react'
import { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### User Profile & Session State (Zustand)

```typescript
// src/lib/store.ts
import { create } from 'zustand'

interface UserStore {
  user: {
    id: string
    name: string
    email: string
    tier: 'free' | 'unlimited'
    totalPoints: number
    level: number
    currentXP: number
    streakDays: number
    lastSessionDate: Date | null
    badges: string[]
  } | null
  setUser: (user: UserStore['user']) => void
  updateStats: (points: number, xp: number) => void
  addBadge: (badgeId: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateStats: (points, xp) =>
    set((state) => {
      if (!state.user) return state
      const newXP = state.user.currentXP + xp
      const leveledUp = newXP >= 400
      return {
        user: {
          ...state.user,
          totalPoints: state.user.totalPoints + points,
          currentXP: leveledUp ? newXP - 400 : newXP,
          level: leveledUp ? state.user.level + 1 : state.user.level,
        },
      }
    }),
  addBadge: (badgeId) =>
    set((state) => {
      if (!state.user) return state
      return {
        user: {
          ...state.user,
          badges: [...new Set([...state.user.badges, badgeId])],
        },
      }
    }),
}))
```

### Leaderboard & Session State (Context + Zustand)

```typescript
// src/lib/leaderboard-store.ts
interface LeaderboardEntry {
  userId: string
  userName: string
  userAvatar: string
  rank: number
  points: number
  level: number
  tier: 'free' | 'unlimited'
}

export const useLeaderboardStore = create<{
  global: LeaderboardEntry[]
  friends: LeaderboardEntry[]
  setGlobal: (entries: LeaderboardEntry[]) => void
  setFriends: (entries: LeaderboardEntry[]) => void
}>((set) => ({
  global: [],
  friends: [],
  setGlobal: (entries) => set({ global: entries }),
  setFriends: (entries) => set({ friends: entries }),
}))
```

---

## Database Schema (Firestore)

### Collections

**`users/{userId}`**
```
{
  email: string
  name: string
  avatar: string (URL)
  tier: 'free' | 'unlimited'
  subscriptionId: string (Stripe customer ID, null if free)
  totalPoints: number
  level: number
  currentXP: number (0-399)
  streakDays: number
  lastSessionDate: timestamp
  createdAt: timestamp
  badges: string[] (array of badge IDs)
  friends: string[] (array of user IDs)
}
```

**`sessions/{sessionId}`**
```
{
  userId: string
  passageId: string
  startedAt: timestamp
  completedAt: timestamp (null if incomplete)
  durationSeconds: number
  accuracy: number (0-100)
  pointsEarned: number
  xpEarned: number
  mcqCorrect: number
  mcqTotal: number
  transcriptSnippet: string (for debugging)
}
```

**`leaderboard/{weekId}` (Auto-updated daily/weekly)**
```
{
  userId: string
  userName: string
  avatar: string
  rank: number
  pointsThisWeek: number
  level: number
  tier: string
  updatedAt: timestamp
}
```

**`badges/{badgeId}`**
```
{
  name: string
  description: string
  imageURL: string
  unlockedBy: string[] (array of user IDs who unlocked)
  unlockCondition: string (e.g., "7-day-streak", "50-accuracy-3-in-a-row")
  tier: 'common' | 'rare' | 'epic' | 'legendary'
}
```

**`passages/{passageId}`**
```
{
  title: string
  text: string
  estimatedReadingSeconds: number
  difficulty: 'easy' | 'medium' | 'hard'
  topics: string[] (e.g., ["biology", "cell-biology"])
  createdAt: timestamp
}
```

**`mcqs/{mcqId}`**
```
{
  passageId: string
  question: string
  options: [
    { id: string, text: string },
    { id: string, text: string },
    { id: string, text: string },
    { id: string, text: string }
  ]
  correctOptionId: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}
```

---

## API Routes (Next.js)

### Authentication
- **POST** `/api/auth/signup` → Create user + Firebase auth
- **POST** `/api/auth/signin` → Firebase auth
- **POST** `/api/auth/logout` → Sign out
- **GET** `/api/auth/user` → Get current user profile
- **POST** `/api/auth/refresh` → Refresh auth token

### Users
- **GET** `/api/users/[userId]` → Get user profile
- **PATCH** `/api/users/[userId]` → Update profile (name, avatar)
- **GET** `/api/users/[userId]/badges` → Get user's badges
- **GET** `/api/users/[userId]/friends` → Get friends list

### Sessions
- **POST** `/api/sessions` → Create new reading session
- **GET** `/api/sessions/[sessionId]` → Get session data
- **PATCH** `/api/sessions/[sessionId]` → Update session (completion)
- **GET** `/api/sessions/user/[userId]` → Get user's session history

### Leaderboard
- **GET** `/api/leaderboard/global` → Get global leaderboard (top 100)
- **GET** `/api/leaderboard/friends` → Get friends leaderboard (paginated)
- **GET** `/api/leaderboard/weekly` → Get weekly rankings

### Badges
- **GET** `/api/badges` → Get all badges
- **GET** `/api/badges/user/[userId]` → Get user's unlocked badges
- **POST** `/api/badges/[badgeId]/unlock` → Unlock badge (backend validates)

### Stripe
- **POST** `/api/stripe/create-checkout` → Create Stripe checkout session
- **POST** `/api/stripe/webhook` → Stripe webhook (subscription events)
- **GET** `/api/stripe/subscription` → Get user's subscription status

### Deepgram
- **POST** `/api/deepgram/token` → Get ephemeral Deepgram token for WebSocket
  - Request: `{ userId: string }`
  - Response: `{ token: string, expiresAt: number }`

---

## Component Architecture

### Button Component (Example)

```typescript
// src/components/shared/Button.tsx
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import cn from 'classnames'

const buttonVariants = cva(
  'px-20 py-14 rounded-md font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-green-primary text-black hover:bg-green-hover active:scale-95',
        secondary: 'bg-gray-800 text-white hover:bg-gray-700',
        danger: 'bg-red-error text-white hover:bg-red-600',
      },
      size: {
        sm: 'text-sm px-16 py-12',
        md: 'text-base px-20 py-14',
        lg: 'text-lg px-24 py-16',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const Button = ({
  children,
  variant,
  size,
  disabled,
  type = 'button',
  className,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    className={cn(buttonVariants({ variant, size, disabled }), className)}
    {...props}
  >
    {children}
  </button>
)
```

### Card Component with Entrance Animation

```typescript
// src/components/shared/Card.tsx
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  delay?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay },
  }),
}

export const Card = ({ children, className = '', delay = 0 }: CardProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={delay}
    variants={cardVariants}
    className={`rounded-lg bg-gray-900 border border-gray-700 p-24 ${className}`}
  >
    {children}
  </motion.div>
)
```

---

## Authentication Flow

**Firebase Setup:**
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

setPersistence(auth, browserLocalPersistence).catch(console.error)
```

**Protected Routes (Middleware):**
```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/reader', '/profile', '/settings']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('__session')?.value

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|public).*)'],
}
```

---

## Speech Recognition Integration (Deepgram)

**WebSocket Client:**
```typescript
// src/lib/deepgram.ts
export class DeepgramClient {
  private ws: WebSocket | null = null
  private processor: ScriptProcessorNode | null = null

  async connect(token: string, onTranscript: (text: string) => void) {
    this.ws = new WebSocket(
      `wss://api.deepgram.com/v1/listen?token=${token}&model=nova-2&language=en-US`
    )

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'Results') {
        const transcript = message.channel.alternatives[0].transcript
        onTranscript(transcript)
      }
    }

    // Set up audio stream from microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const source = audioContext.createMediaStreamSource(stream)
    this.processor = audioContext.createScriptProcessor(4096, 1, 1)

    source.connect(this.processor)
    this.processor.connect(audioContext.destination)

    this.processor.onprocessAudioBuffer = (event) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(event.inputBuffer) // Send raw audio bytes
      }
    }
  }

  disconnect() {
    this.ws?.close()
    this.processor?.disconnect()
  }
}
```

**Hook for React Integration:**
```typescript
// src/lib/hooks.ts
export const useDeepgram = () => {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const clientRef = useRef<DeepgramClient | null>(null)

  const startListening = async () => {
    const response = await fetch('/api/deepgram/token', {
      method: 'POST',
      body: JSON.stringify({ userId: 'current-user-id' }),
    })
    const { token } = await response.json()

    clientRef.current = new DeepgramClient()
    await clientRef.current.connect(token, (text) => {
      setTranscript(text)
    })
    setIsListening(true)
  }

  const stopListening = () => {
    clientRef.current?.disconnect()
    setIsListening(false)
  }

  return { transcript, isListening, startListening, stopListening }
}
```

---

## Stripe Integration

**Subscription Checkout:**
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createCheckoutSession(userId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: 'user@example.com',
    line_items: [
      {
        price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId },
  })

  return session
}
```

**Webhook Handler:**
```typescript
// src/app/api/stripe/webhook/route.ts
export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!
  const body = await request.text()

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata.userId

    await db.collection('users').doc(userId).update({
      tier: 'unlimited',
      subscriptionId: subscription.id,
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata.userId

    await db.collection('users').doc(userId).update({
      tier: 'free',
      subscriptionId: null,
    })
  }

  return new Response('Webhook received', { status: 200 })
}
```

---

## Environment Variables

**File:** `.env.local`

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxxx

# Deepgram
NEXT_PUBLIC_DEEPGRAM_API_KEY=xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Build Configuration

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' }, // Google avatars
      { hostname: 'firebasestorage.googleapis.com' }, // Firebase storage
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  fonts: {
    google: [
      { family: 'Inter', weights: [400, 500, 700, 900] },
      { family: 'Plus Jakarta Sans', weights: [400, 500, 700] },
    ],
  },
}

module.exports = nextConfig
```

---

## Package Dependencies

**File:** `package.json` (partial)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.0",
    "firebase": "^10.7.0",
    "stripe": "^14.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## Performance Budgets

| Metric | Target | Notes |
|--------|--------|-------|
| **First Contentful Paint (FCP)** | <1.5s | Landing page initial render |
| **Largest Contentful Paint (LCP)** | <2.5s | Critical images optimized |
| **Cumulative Layout Shift (CLS)** | <0.1 | No jank on interactions |
| **Time to Interactive (TTI)** | <3.5s | JS bundle optimized |
| **Total Bundle Size** | <250KB (gzip) | Code splitting + lazy load |
| **Asset Size (hero image)** | <100KB | WebP format |
| **Confetti animation FPS** | 60 FPS desktop, 30+ mobile | Canvas optimized |
| **Deepgram latency** | <200ms | WebSocket real-time |

**Optimization Strategies:**
- Next.js Image component (automatic optimization)
- Dynamic imports for route-based code splitting
- Lazy-load badges, leaderboard images
- Preload hero image + critical fonts
- Minify CSS, tree-shake unused Tailwind
- Gzip compression (Vercel default)

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
```typescript
// src/components/shared/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

### E2E Tests (Playwright)
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test'

test('signup flow', async ({ page }) => {
  await page.goto('/auth/signup')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'SecurePassword123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

### Performance Testing (Lighthouse)
- Run automated Lighthouse on each commit
- Target: 90+ on all metrics
- Monitor Core Web Vitals continuously

---

## Deployment Strategy (Vercel)

**Config:** `vercel.json`

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"], // us-east-1
  "env": [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET"
  ]
}
```

**Preview Deployments:**
- Every PR gets automatic preview URL
- Test before merging to main

**Production Deployment:**
- Auto-deploy on merge to `main` branch
- Automatic SSL certificate
- CDN + edge caching
- Automatic serverless functions for API routes

---

## Security Considerations

**Authentication:**
- Firebase Auth handles password hashing
- Session tokens stored in secure HTTP-only cookies
- CORS configured for API routes

**Database:**
- Firestore security rules enforce user-owned data
- No sensitive data in client-side state
- Server-side validation of all mutations

**Payments:**
- Stripe PCI compliance (no card data stored)
- Webhook signature verification
- Rate limiting on API endpoints

**Content Security:**
- No inline scripts (CSP headers)
- XSS protection via React (escaping by default)
- CSRF tokens on state-modifying requests

---

## Stage 5 Acceptance Criteria

**Deliverables:**
- [x] Complete Next.js file structure documented
- [x] All page routes defined (/dashboard, /reader, etc.)
- [x] 40+ component architecture sketched
- [x] Design token system (colors, typography, spacing)
- [x] Tailwind configuration with theme overrides
- [x] State management strategy (Context + Zustand)
- [x] Firestore schema for 6 main collections
- [x] API routes for auth, sessions, leaderboard, badges, Stripe, Deepgram
- [x] Firebase auth + protected routes
- [x] Deepgram WebSocket integration plan
- [x] Stripe subscription flow
- [x] Environment variables configured
- [x] Build configuration (Next.js optimization)
- [x] Performance budgets defined
- [x] Testing strategy (unit + E2E + performance)
- [x] Deployment strategy (Vercel)
- [x] Security considerations documented

**Quality gates:**
- [x] TypeScript strict mode enabled
- [x] Accessibility (WCAG 2.1 AA) planned
- [x] Reduced-motion support configured
- [x] All async operations have error handling
- [x] All API calls authenticated
- [x] Performance budgets realistic for stack

---

## Status

**Stage 5: Tech Spec — COMPLETE ✅**

All technical foundations locked:
- ✅ File structure matches Next.js best practices
- ✅ Component hierarchy supports design system
- ✅ State management handles auth + user data + leaderboard
- ✅ Database schema ready for Firestore
- ✅ All integrations documented (Firebase, Stripe, Deepgram)
- ✅ Deployment strategy defined (Vercel)
- ✅ Performance budgets realistic

**Next stage:** Stage 6: Build Pass (Weeks 4–8, implementation phase)

---

## Sign-Off

**Completed by:** AI Assistant  
**Date:** May 31, 2026  
**Status:** Ready for Stage 6 Build Pass

**Proceed to Stage 6?** [YES / NO]

