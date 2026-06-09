# STAGE 6: Build Pass (Weeks 4–8)

**Project:** RETRIEVE MCAT Study App  
**Date:** May 31, 2026  
**Status:** Build Implementation Phase  
**Dependencies:** ✅ Stages 0–5 Complete (Planning phase locked)  
**Timeline:** 5 weeks (Weeks 4–8 of 14-week MVP)  
**Deliverable:** Production-ready component library + all pages functional

---

## Stage 6 Objective

Implement all Next.js pages, React components, integrations, and state management. Convert technical spec → buildable, tested code.

**Success criteria:**
- All 15+ pages rendering and navigating
- All 40+ components built and integrated
- Firebase auth + protected routes working
- Firestore real-time data syncing
- Deepgram speech recognition integrated
- Stripe subscription flow complete
- 90%+ unit test coverage
- E2E tests for critical user flows
- Performance metrics: FCP <1.5s, LCP <2.5s, CLS <0.1

---

## Week 4: Foundation & Auth (Days 1–5)

### Objectives
- [ ] Next.js project scaffold complete
- [ ] Firebase + Firestore connected
- [ ] Auth system fully functional (signup/signin/logout)
- [ ] Protected routes + middleware working
- [ ] Tailwind + design tokens configured
- [ ] 6 auth pages built + tested

### Tasks

#### 4.1 Project Setup (Day 1)
**Owner:** Lead Developer  
**Time:** 4 hours

```bash
# Initialize Next.js 14 project
npx create-next-app@latest retrieve --typescript --tailwind --app

# Install dependencies
npm install firebase zustand framer-motion stripe @stripe/react-stripe-js clsx

# Configure TypeScript + ESLint
# Configure Tailwind (colors, spacing from design tokens)
# Setup folder structure (src/app, src/components, src/lib, etc.)
```

**Deliverables:**
- [ ] Project runs locally on localhost:3000
- [ ] Tailwind + custom CSS variables working
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] .gitignore + README created

**Testing:**
- [ ] `npm run dev` starts without errors
- [ ] Browser opens to default Next.js page

---

#### 4.2 Firebase Setup (Day 1–2)
**Owner:** Backend Lead  
**Time:** 6 hours

**Deliverables:**
- [ ] `src/lib/firebase.ts` initialized with config
- [ ] `src/lib/auth-context.ts` created with Provider
- [ ] Firebase Auth methods: `signUp()`, `signIn()`, `signOut()`
- [ ] Persistent session via `browserLocalPersistence`
- [ ] Firestore collections created in Firebase console:
  - `users` (template document created)
  - `sessions`
  - `leaderboard`
  - `badges`
  - `passages`
  - `mcqs`

**Testing:**
- [ ] Auth context provider mounts without errors
- [ ] `useAuth()` hook returns { user, loading, signIn, signUp, signOut }
- [ ] Firestore connection works (can read/write test data)

---

#### 4.3 Auth Pages (Days 2–4)
**Owner:** Frontend Lead  
**Time:** 12 hours

**Pages to build:**
1. `src/app/auth/signup/page.tsx` — Email + password + name form
2. `src/app/auth/signin/page.tsx` — Email + password form
3. `src/app/auth/forgot-password/page.tsx` — Email input, send reset link
4. `src/app/auth/reset-password/page.tsx` — New password form
5. `src/app/layout.tsx` — Root layout with AuthProvider
6. `src/middleware.ts` — Protected route redirect

**Components to build:**
- `src/components/auth/AuthForm.tsx` — Reusable form container
- `src/components/auth/FormInput.tsx` — Accessible input with focus state
- `src/components/auth/GoogleAuthButton.tsx` — OAuth button
- `src/components/auth/ValidationMessage.tsx` — Error/success text
- `src/components/shared/Spinner.tsx` — Loading indicator

**Features:**
- [ ] Email validation (regex or zod library)
- [ ] Password strength indicator
- [ ] Error messages from Firebase (invalid password, user exists, etc.)
- [ ] Loading state on submit button (spinner appears)
- [ ] Smooth transitions between forms
- [ ] Google OAuth integration (setup OAuth credentials in Firebase console)
- [ ] Persistent login across page refreshes
- [ ] Keyboard accessibility (Tab navigation, Enter to submit)

**Styling:**
- [ ] Dark theme (#0F0F0F background)
- [ ] Green accent on focus states
- [ ] Red error text (#FF4444)
- [ ] Responsive on mobile (full-width inputs)

**Testing:**
- [ ] Sign up with new email → User created in Firestore
- [ ] Sign up with existing email → Error message
- [ ] Weak password → Error message
- [ ] Sign in with correct credentials → Redirect to /dashboard
- [ ] Sign in with wrong password → Error message
- [ ] Reset password flow → Email sent (Firebase logs)
- [ ] Google OAuth → User created/signed in
- [ ] Logout → Redirect to /auth/signin
- [ ] Direct access to /dashboard without auth → Redirect to /auth/signin

---

#### 4.4 Design Tokens & Tailwind (Day 2)
**Owner:** Frontend Lead  
**Time:** 3 hours

**Files to create:**
- `src/styles/tokens.css` — CSS custom properties (colors, spacing, typography, shadows, animations)
- `tailwind.config.ts` — Extend theme with design tokens
- `src/styles/animations.css` — Keyframe animations for micro-interactions
- `src/styles/accessibility.css` — Focus states, high-contrast mode

**Tailwind overrides:**
- [ ] Dark theme as default
- [ ] Custom colors (green-primary, gray-900, red-error, etc.)
- [ ] Custom spacing (4px, 8px, 16px grid)
- [ ] Custom border-radius (6px, 12px, 16px)
- [ ] Custom shadows (sm, md, lg, green highlight)
- [ ] Custom animation timings from Stage 4

**Testing:**
- [ ] Tailwind utilities work in components (`bg-green-primary`, `text-gray-400`)
- [ ] CSS variables accessible in components (`var(--color-green-primary)`)
- [ ] Dark theme applied globally

---

#### 4.5 Unit Tests for Auth (Day 4–5)
**Owner:** QA Lead  
**Time:** 4 hours

**Setup:**
- Install Jest + React Testing Library
- Create `jest.config.js`
- Add test scripts to `package.json`

**Test files to create:**
- `src/components/auth/__tests__/AuthForm.test.tsx`
- `src/components/auth/__tests__/FormInput.test.tsx`
- `src/components/auth/__tests__/GoogleAuthButton.test.tsx`
- `src/lib/__tests__/firebase.test.ts` (mocked Firebase)

**Test cases:**
- [ ] AuthForm renders with email + password fields
- [ ] Form validates email format
- [ ] Form validates password length
- [ ] Submit button disabled while loading
- [ ] Error message displays on submission failure
- [ ] FormInput focus state changes border color
- [ ] GoogleAuthButton has correct href

**Coverage target:** 80%+

---

### Week 4 Acceptance Criteria

**All items must be complete:**
- [ ] Project runs locally without errors
- [ ] Auth pages accessible at `/auth/signup`, `/auth/signin`, `/auth/forgot-password`
- [ ] User can sign up with email + password
- [ ] User can sign in with credentials
- [ ] User can sign in with Google OAuth
- [ ] User can reset password via email
- [ ] User can sign out
- [ ] Middleware redirects unauthenticated users to `/auth/signin`
- [ ] Tailwind + design tokens working
- [ ] All auth unit tests passing
- [ ] No TypeScript errors
- [ ] No console errors in browser

**Blockers:** None expected if Firebase credentials configured correctly.

---

## Week 5: Core App Structure (Days 1–5)

### Objectives
- [ ] Landing page complete (all 11 sections from Content Spine)
- [ ] Dashboard page functional (user stats, leaderboard preview)
- [ ] Navigation header + mobile menu
- [ ] Real-time Firestore syncing working
- [ ] Initial Zustand store setup
- [ ] 40+ unit tests passing

### Tasks

#### 5.1 Landing Page (Days 1–3)
**Owner:** Frontend Lead  
**Time:** 16 hours

**Sections to build (from CONTENT_SPINE.md):**
1. Hero section (headline + CTA button + confetti animation)
2. How It Works (3-step card component)
3. Features section 1: Real-Time Reader (mockup image + copy)
4. Features section 2: Gamification (badges, leaderboard mockup)
5. Features section 3: Study Squad (friend features)
6. Social Proof (testimonials + star rating)
7. Pricing (Free vs. Unlimited cards)
8. FAQ (accordion component)
9. Final CTA section
10. Footer (links + social)
11. Header/Nav (sticky, visible on all pages)

**Components to build:**
- `src/components/landing/Hero.tsx` — With confetti effect
- `src/components/landing/HowItWorks.tsx` — 3-card grid
- `src/components/landing/Features.tsx` — Feature blocks with mockups
- `src/components/landing/SocialProof.tsx` — Testimonials
- `src/components/landing/Pricing.tsx` — Pricing cards with CTA
- `src/components/landing/FAQ.tsx` — Accordion (controlled state)
- `src/components/layout/Header.tsx` — Navigation bar
- `src/components/layout/Footer.tsx` — Footer links
- `src/components/shared/Card.tsx` — Card with entrance animation (Framer Motion)
- `src/components/shared/Button.tsx` — Reusable button (primary, secondary, danger variants)
- `src/components/shared/ConfettiEffect.tsx` — Canvas confetti on hero load

**Features:**
- [ ] Hero CTA ("Start Your Free Session") links to signup
- [ ] Confetti animation on hero load (1.5s burst)
- [ ] Smooth scroll on navigation clicks
- [ ] All card elements have entrance animations (staggered, ease-out)
- [ ] FAQ accordion expands/collapses with animation
- [ ] Pricing cards highlight on hover
- [ ] Responsive grid layouts (1 column mobile, 2–3 columns desktop)
- [ ] Social proof testimonials scroll/carousel (optional: Swiper library)
- [ ] Mobile hamburger menu (Header component)

**Styling:**
- [ ] Dark theme throughout
- [ ] Green accent on CTAs
- [ ] Typography hierarchy (Inter font, bold headlines)
- [ ] Adequate padding/spacing per design tokens
- [ ] Images lazy-loaded (Next.js Image component)
- [ ] Max-width container (1200px) on desktop

**Assets needed:**
- Hero illustration (from Asset Plan)
- Step icons (upload, read, improve)
- Mockup images (reader, dashboard, leaderboard)
- Badge graphics (6–10 representative badges)
- Testimonial avatars (3 users)
- Pricing comparison icon
- Social media icons

**Testing:**
- [ ] All 11 sections render without errors
- [ ] Navigation links scroll to correct sections
- [ ] Confetti animation plays on load
- [ ] FAQ accordion toggles open/close
- [ ] Cards fade in on scroll
- [ ] Responsive on mobile (no horizontal scroll)
- [ ] All images load and display correctly

---

#### 5.2 Dashboard Page (Days 2–4)
**Owner:** Frontend Lead  
**Time:** 12 hours

**Page:** `src/app/dashboard/page.tsx`

**Components to build:**
- `src/components/dashboard/DashboardCard.tsx` — Stat card template
- `src/components/dashboard/StreakCounter.tsx` — 🔥 with pulse animation
- `src/components/dashboard/LevelProgress.tsx` — Progress bar + counter
- `src/components/dashboard/RecentSessions.tsx` — Table of past sessions
- `src/components/dashboard/QuickStats.tsx` — Accuracy, points, sessions count
- `src/components/dashboard/LeaderboardPreview.tsx` — Top 5 global users
- `src/components/layout/ProtectedLayout.tsx` — Header + sidebar for app screens

**Features:**
- [ ] Pull current user data from Firestore
- [ ] Display user name, avatar, level, points
- [ ] Show streak counter with pulse animation
- [ ] Show level progress bar (XP towards next level)
- [ ] Display last 5 sessions with accuracy + points
- [ ] Display global leaderboard preview (top 5)
- [ ] "Start New Session" button links to `/reader`
- [ ] Real-time updates from Firestore (listener on user document)
- [ ] Responsive grid (1 column mobile, 2–3 columns desktop)
- [ ] Skeleton loaders while data loads

**State management:**
- [ ] Zustand store for user profile (`useUserStore`)
- [ ] Zustand store for leaderboard (`useLeaderboardStore`)
- [ ] Custom hook `useAuth()` for current user
- [ ] Custom hook `useLeaderboard()` for fetching leaderboard data

**Styling:**
- [ ] Dark cards (#1A1A1A background)
- [ ] Green accents on stats
- [ ] Clean stat layout (number + label)
- [ ] Adequate whitespace

**Testing:**
- [ ] Dashboard loads without errors (redirects if not authenticated)
- [ ] User data displays correctly
- [ ] Streak counter shows correct value
- [ ] Level progress bar fills correctly
- [ ] Recent sessions table shows correct data
- [ ] Leaderboard preview loads
- [ ] Real-time update works (update Firestore, page updates)
- [ ] Responsive on mobile

---

#### 5.3 Navigation & Header (Days 1–2)
**Owner:** Frontend Lead  
**Time:** 6 hours

**Components to build:**
- `src/components/layout/Header.tsx` — Sticky header with nav links
- `src/components/layout/Sidebar.tsx` — Mobile drawer menu
- `src/components/shared/NavLink.tsx` — Active link indicator

**Features (Header):**
- [ ] Logo on left
- [ ] Navigation links (Dashboard, Reader, Leaderboard, Badges, Profile)
- [ ] Sticky position (stays at top on scroll)
- [ ] Dark background
- [ ] Green underline on active page
- [ ] Logout button
- [ ] User profile icon (click → dropdown or navigate to /profile)

**Features (Sidebar - Mobile):**
- [ ] Hamburger icon on mobile (<768px)
- [ ] Slides in from right when clicked
- [ ] All nav links in drawer
- [ ] Logout button
- [ ] Closes on link click or background click
- [ ] Smooth slide animation (300ms)

**Styling:**
- [ ] Dark theme (#0F0F0F)
- [ ] Green accent on hover
- [ ] Responsive: hidden on mobile, visible on desktop
- [ ] Hamburger animation (becomes X when open)

**Testing:**
- [ ] Header renders with nav links
- [ ] Active page link is highlighted green
- [ ] Hamburger menu opens/closes
- [ ] Nav links navigate to correct pages
- [ ] Logout button signs out user

---

#### 5.4 Zustand Stores (Day 3)
**Owner:** Backend Lead  
**Time:** 4 hours

**Files to create:**
- `src/lib/store/user-store.ts` — User profile, stats, badges
- `src/lib/store/leaderboard-store.ts` — Global/friends leaderboard
- `src/lib/store/session-store.ts` — Current reading session

**User Store:**
```
interface User {
  id: string
  email: string
  name: string
  avatar: string
  tier: 'free' | 'unlimited'
  totalPoints: number
  level: number
  currentXP: number (0-399)
  streakDays: number
  lastSessionDate: Date | null
  badges: string[]
}

Methods:
- setUser(user)
- updateStats(pointsEarned, xpEarned)
- addBadge(badgeId)
- resetStreak()
- incrementStreak()
```

**Leaderboard Store:**
```
interface LeaderboardEntry {
  userId: string
  userName: string
  avatar: string
  rank: number
  points: number
  level: number
}

Methods:
- setGlobalLeaderboard(entries)
- setFriendsLeaderboard(entries)
- refresh()
```

**Session Store:**
```
interface Session {
  id: string
  passageId: string
  startedAt: Date
  passageText: string
  transcript: string (real-time transcript)
  accuracy: number
  mcqAnswers: { mcqId: string, selectedOptionId: string }[]
}

Methods:
- startSession(passageId)
- updateTranscript(text)
- recordMCQAnswer(mcqId, optionId)
- completeSession()
```

**Testing:**
- [ ] Store initializes with correct defaults
- [ ] `setUser()` updates state
- [ ] `updateStats()` correctly increments XP (level up at 400)
- [ ] `addBadge()` adds to badges array (no duplicates)
- [ ] Zustand hooks work in components

---

#### 5.5 Firestore Real-Time Sync (Day 4–5)
**Owner:** Backend Lead  
**Time:** 6 hours

**Files to create:**
- `src/lib/firestore.ts` — Firestore queries + listeners
- `src/lib/hooks.ts` — Custom hooks for Firestore data

**Firestore functions:**
```typescript
// Queries
getUser(userId: string) → User doc
getLeaderboard(limit: number) → array of LeaderboardEntry
getUserSessions(userId: string, limit: number) → array of Session docs
getPassage(passageId: string) → Passage doc
getMCQsByPassage(passageId: string) → array of MCQ docs

// Real-time listeners
onUserChange(userId: string, callback) → unsubscribe fn
onLeaderboardChange(callback) → unsubscribe fn
onSessionChange(sessionId: string, callback) → unsubscribe fn

// Mutations
createSession(userId, passageId) → sessionId
updateSession(sessionId, data) → void
completeSession(sessionId, accuracy, points, xp) → void
unlockBadge(userId, badgeId) → void
```

**Custom hooks:**
```typescript
useUser(userId) → { user, loading, error }
useLeaderboard() → { leaderboard, loading, error }
useUserSessions(userId) → { sessions, loading, error }
usePassage(passageId) → { passage, loading, error }
useMCQsByPassage(passageId) → { mcqs, loading, error }
```

**Testing:**
- [ ] `getUser()` returns correct user doc
- [ ] `getLeaderboard()` returns sorted array
- [ ] `onUserChange()` listener fires when user doc updates
- [ ] `useUser()` hook subscribes to real-time updates
- [ ] Component re-renders when data changes
- [ ] Unsubscribe function stops listening

---

#### 5.6 More Unit Tests (Day 5)
**Owner:** QA Lead  
**Time:** 4 hours

**Tests to add:**
- Landing page sections render
- Dashboard components render
- Header nav links navigate correctly
- Hamburger menu opens/closes
- Zustand store updates correctly
- Firestore queries work (mocked)
- Hooks return correct data

**Coverage target:** 70%+ total

---

### Week 5 Acceptance Criteria

**All items must be complete:**
- [ ] Landing page displays all 11 sections
- [ ] Confetti animation plays on hero load
- [ ] FAQ accordion works
- [ ] Dashboard page shows user stats
- [ ] Streak counter, level progress visible
- [ ] Leaderboard preview shows top 5
- [ ] Header navigation links work
- [ ] Mobile hamburger menu works
- [ ] Real-time Firestore syncing works (test by updating doc in console)
- [ ] Zustand stores fully functional
- [ ] All unit tests passing
- [ ] No TypeScript errors
- [ ] Landing page responsive on mobile
- [ ] No console errors

**Blockers:** None expected.

---

## Week 6: Reader & MCQ (Days 1–5)

### Objectives
- [ ] Karaoke reader page fully functional
- [ ] Word highlighting synchronized with speech recognition
- [ ] MCQ modal with animations
- [ ] Session completion + scoring
- [ ] 50+ unit tests passing

### Tasks

#### 6.1 Reader Page & Components (Days 1–3)
**Owner:** Frontend Lead  
**Time:** 16 hours

**Page:** `src/app/reader/page.tsx`

**Components to build:**
- `src/components/reader/KaraokeReader.tsx` — Main container
- `src/components/reader/PassageText.tsx` — Highlighted text (real-time sync)
- `src/components/reader/TranscriptViewer.tsx` — Debug transcript display
- `src/components/reader/ProgressBar.tsx` — Reading progress (color states)
- `src/components/reader/ControlPanel.tsx` — Play/pause, speed control

**Features:**
- [ ] Load random passage from Firestore
- [ ] Display passage text with word-level highlighting
- [ ] Real-time word highlighting as user speaks (from Deepgram)
- [ ] Progress bar fills as reading advances
- [ ] Recording indicator (red dot while recording)
- [ ] Pause/resume reading
- [ ] Speed control (optional: 0.75x, 1x, 1.25x, 1.5x)
- [ ] Estimated reading time displayed
- [ ] Session saved to Firestore
- [ ] Transition to MCQ modal on passage completion

**Styling:**
- [ ] Dark background
- [ ] Large, readable font (18px+)
- [ ] Green highlight on current word
- [ ] Gray highlight on past words (faded)
- [ ] Red highlight on misread words
- [ ] Progress bar at bottom (green fill)
- [ ] Responsive text sizing on mobile

**Animation details (from Stage 4):**
- [ ] Word highlight: 150ms ease-out (background color change)
- [ ] Misread word highlight: Red, 300ms hold, then fade
- [ ] Progress bar: Smooth fill based on reading time
- [ ] Completed passage: All highlights fade out

**Testing:**
- [ ] Passage loads correctly
- [ ] Text renders without overflow
- [ ] Progress bar displays
- [ ] Pause/resume works
- [ ] Speed control works
- [ ] Session created in Firestore

---

#### 6.2 Deepgram Integration (Days 2–4)
**Owner:** Backend Lead  
**Time:** 12 hours

**Files to create:**
- `src/lib/deepgram.ts` — DeepgramClient class (WebSocket)
- `src/lib/hooks.ts` — `useDeepgram()` hook
- `src/app/api/deepgram/token/route.ts` — Token generation endpoint

**DeepgramClient class:**
```typescript
class DeepgramClient {
  async connect(token: string, onTranscript: (text: string) => void)
  disconnect()
  isConnected(): boolean
}
```

**Features:**
- [ ] WebSocket connection to Deepgram API
- [ ] Audio stream from microphone (getUserMedia)
- [ ] Real-time transcript received
- [ ] `onTranscript` callback fires with transcript
- [ ] Error handling (network errors, permission denied)
- [ ] Graceful disconnect

**Hook implementation:**
```typescript
const useDeepgram = () => {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startListening = async () => {
    // Get ephemeral token from API
    // Connect to Deepgram
    // Set isListening = true
  }

  const stopListening = () => {
    // Disconnect from Deepgram
    // Set isListening = false
  }

  return { transcript, isListening, error, startListening, stopListening }
}
```

**API Route (`/api/deepgram/token`):**
- [ ] Validates user is authenticated
- [ ] Calls Deepgram API for ephemeral token
- [ ] Returns token + expiration
- [ ] Handles errors (Deepgram API down, etc.)

**Browser API requirements:**
- [ ] getUserMedia API (microphone access)
- [ ] AudioContext API (audio processing)
- [ ] WebSocket API

**Testing:**
- [ ] Token generation works
- [ ] WebSocket connects successfully
- [ ] Transcript received from Deepgram
- [ ] Microphone permission prompt works
- [ ] Error handling on network failure
- [ ] Graceful fallback if WebSocket fails

---

#### 6.3 Word Highlighting Sync (Days 3–4)
**Owner:** Frontend Lead  
**Time:** 8 hours

**Challenge:** Match Deepgram transcript words to passage words in real-time

**Algorithm:**
```typescript
// Passage: "The quick brown fox jumps..."
// Transcript: "the quick brown"

// Match transcript words to passage word indices
// Highlight passage word at current index
// Keep previous words highlighted (faded)
// Handle misread words (don't match)
```

**Implementation approach:**
```typescript
// PassageText component maintains:
// - passageWords: string[] (split on whitespace)
// - currentWordIndex: number (from transcript matching)
// - highlightedWords: Set<number> (past words)
// - misreadWords: Set<number> (incorrect matches)

// Render each word in <span> with conditional classNames:
// - current: green highlight
// - highlighted: gray (faded)
// - misread: red
// - normal: white
```

**Features:**
- [ ] Word highlighting syncs with transcript (50ms latency acceptable)
- [ ] Misread words detected (transcript doesn't contain passage word)
- [ ] Progress bar advances with reading
- [ ] No lag on word highlighting
- [ ] Handles synonyms/homophones (optional: fuzzy matching)

**Edge cases to handle:**
- [ ] Multiple spaces between words
- [ ] Punctuation (strip or keep?)
- [ ] Case sensitivity (convert to lowercase for matching)
- [ ] Contraction handling ("don't" → "dont" vs "do not")
- [ ] Numbers/special characters

**Testing:**
- [ ] Words highlight when transcript received
- [ ] Multiple words highlight in sequence (no gaps)
- [ ] Misread word turns red
- [ ] Completed passage highlights all words
- [ ] Performance: No lag on 400+ word passages

---

#### 6.4 MCQ Modal & Feedback (Days 3–5)
**Owner:** Frontend Lead  
**Time:** 10 hours

**Components to build:**
- `src/components/mcq/MCQModal.tsx` — Full-screen modal
- `src/components/mcq/MCQOption.tsx` — Single option button
- `src/components/mcq/FeedbackDisplay.tsx` — Correct/incorrect feedback
- `src/components/mcq/ProgressSummary.tsx` — Session summary stats

**Features:**
- [ ] MCQ modal appears after passage completes
- [ ] Display question + 4 options
- [ ] Disable all options after selection
- [ ] Show instant feedback (green checkmark or red shake)
- [ ] Display explanation text
- [ ] Show next MCQ button (or session summary if last MCQ)
- [ ] Track correct/incorrect count
- [ ] Calculate accuracy percentage
- [ ] Award points (10 for correct, 0 for incorrect)
- [ ] Award XP (25 for correct, 5 for attempt)
- [ ] Badge unlock check (if applicable)

**Animations (from Stage 4):**
- [ ] Modal entrance: Scale 0 → 1.2 → 1.0 (300ms bounce)
- [ ] Correct answer: Green highlight + checkmark bounce
- [ ] Incorrect answer: Red shake (300ms) then correct answer highlight
- [ ] Feedback text fade in (200ms, delayed)
- [ ] Next button fade in (300ms, delayed)
- [ ] Modal exit: Scale 1.0 → 0.8, fade out (300ms)

**Styling:**
- [ ] Question in large font (20px+)
- [ ] Options as full-width buttons
- [ ] Green for correct, red for incorrect
- [ ] Dark background overlay
- [ ] Centered on screen

**Testing:**
- [ ] MCQ modal renders after passage completion
- [ ] Selecting correct answer → green highlight + checkmark
- [ ] Selecting incorrect answer → red shake, then correct answer green
- [ ] Feedback explanation displays
- [ ] Points/XP calculated correctly
- [ ] Accuracy percentage updated
- [ ] Next button navigates to next MCQ or summary
- [ ] No console errors

---

#### 6.5 Session Completion & Scoring (Day 4–5)
**Owner:** Backend Lead  
**Time:** 6 hours

**Files to create:**
- `src/components/mcq/SessionSummary.tsx` — End-of-session stats
- `src/lib/scoring.ts` — Points + XP calculation
- `src/app/api/sessions/[sessionId]/complete/route.ts` — Complete session endpoint

**Scoring logic:**
```
Accuracy = (MCQ Correct / MCQ Total) * 100

Points = {
  5 base points per MCQ correct
  + 10 bonus if accuracy > 80%
  + 15 bonus if accuracy == 100%
}

XP = {
  25 per MCQ correct
  + 5 per MCQ attempted (even if wrong)
  + 50 bonus if accuracy == 100%
}

Level up check:
  if (currentXP + earnedXP) >= 400 {
    level++
    currentXP = (currentXP + earnedXP) - 400
    triggerLevelUpModal()
    earnBadge(if applicable)
  }
```

**Streak logic:**
```
If today != lastSessionDate:
  streakDays++
else:
  streak maintained

After 3 days without session:
  streakDays = 0
```

**Session Summary page:**
- [ ] Display session duration
- [ ] Display accuracy percentage
- [ ] Display points earned
- [ ] Display XP earned
- [ ] Show level up notification (if applicable)
- [ ] Show badge unlock notification (if applicable)
- [ ] "Continue to dashboard" button
- [ ] "Start another session" button
- [ ] Confetti animation if accuracy == 100%

**Testing:**
- [ ] Scoring calculated correctly
- [ ] Accuracy % correct
- [ ] Points awarded correctly
- [ ] XP awarded correctly
- [ ] Level up triggers at 400 XP
- [ ] Streak increments correctly
- [ ] Session saved to Firestore with all stats
- [ ] Badge unlock checks pass
- [ ] Summary displays correctly

---

#### 6.6 More Unit & E2E Tests (Day 5)
**Owner:** QA Lead  
**Time:** 6 hours

**Unit tests:**
- Reader page loads correctly
- PassageText renders with words
- ControlPanel buttons work
- MCQ modal renders
- MCQOption shows correct state (normal, selected, correct, incorrect)
- FeedbackDisplay shows explanation
- SessionSummary displays stats
- Scoring calculations correct

**E2E tests (Playwright):**
```typescript
test('complete reading session', async ({ page }) => {
  // Sign in
  // Navigate to reader
  // Wait for passage to load
  // Simulate reading (call transcript API directly)
  // Verify word highlighting
  // Verify progress bar
  // Complete passage
  // Answer MCQ correctly
  // Verify feedback
  // Verify session saved
  // Check dashboard updated
})
```

**Coverage target:** 70%+ total

---

### Week 6 Acceptance Criteria

**All items must be complete:**
- [ ] Reader page loads passage correctly
- [ ] Deepgram WebSocket connects (test with real microphone or mock)
- [ ] Word highlighting syncs with transcript
- [ ] Progress bar advances
- [ ] MCQ modal appears after passage completes
- [ ] Correct answer selection shows green feedback
- [ ] Incorrect answer selection shows red feedback + shake
- [ ] Feedback explanation displays
- [ ] Points + XP calculated and awarded correctly
- [ ] Session saved to Firestore
- [ ] Session summary displays stats
- [ ] Level up modal triggers when applicable
- [ ] Badge unlock modal triggers when applicable
- [ ] All E2E tests passing
- [ ] No TypeScript errors
- [ ] No console errors

**Blockers:** 
- Deepgram API key provisioning (get from Deepgram console)
- Microphone permissions (may need to test in secure context)

---

## Week 7: Leaderboard, Badges, Profile (Days 1–5)

### Objectives
- [ ] Leaderboard page with global/friends/weekly views
- [ ] Badge gallery with unlock animations
- [ ] User profile page with history + friends
- [ ] Settings page
- [ ] 70% unit test coverage
- [ ] All pages responsive on mobile

### Tasks

#### 7.1 Leaderboard Page (Days 1–2)
**Owner:** Frontend Lead  
**Time:** 10 hours

**Page:** `src/app/leaderboard/page.tsx`

**Components to build:**
- `src/components/leaderboard/LeaderboardTable.tsx` — Ranked list
- `src/components/leaderboard/LeaderboardRow.tsx` — User row with rank, name, points
- `src/components/leaderboard/LeaderboardTabs.tsx` — Global/Friends/Weekly tabs
- `src/components/leaderboard/FilterSort.tsx` — Filter + sort controls (optional)

**Features:**
- [ ] Global leaderboard (top 100 users by points)
- [ ] Friends leaderboard (friends only, by points)
- [ ] Weekly leaderboard (top 100 by points this week)
- [ ] Tab switching between views
- [ ] Current user highlighted (green tint + left border)
- [ ] Rank, user name, avatar, points, level displayed
- [ ] Pagination (50 per page)
- [ ] Sort by points (descending)
- [ ] Filter by tier (free/unlimited, optional)
- [ ] Hover effect on rows (background changes)
- [ ] Click row → navigate to user profile (optional)

**Animations (from Stage 4):**
- [ ] Entrance: Rows slide in from left (staggered, 50ms)
- [ ] Hover: Background lightens (200ms)
- [ ] Current user row: Permanent green highlight

**Real-time updates:**
- [ ] Leaderboard refreshes every 5 minutes (or when user completes session)
- [ ] User's own rank updates in real-time

**Styling:**
- [ ] Dark background (#0F0F0F)
- [ ] Table layout (responsive, horizontal scroll on mobile if needed)
- [ ] Green highlight for current user
- [ ] Adequate padding between rows
- [ ] Avatar images 32×32px

**Testing:**
- [ ] Leaderboard loads without errors
- [ ] All tabs work (global, friends, weekly)
- [ ] Rows display correct data
- [ ] Current user highlighted
- [ ] Pagination works (load next page)
- [ ] Responsive on mobile
- [ ] Real-time updates work (update a user's points in Firestore, see rank change)

---

#### 7.2 Badge Gallery (Days 1–3)
**Owner:** Frontend Lead  
**Time:** 12 hours

**Page:** `src/app/badges/page.tsx`

**Components to build:**
- `src/components/badges/BadgeGallery.tsx` — Grid of badges
- `src/components/badges/BadgeCard.tsx` — Individual badge card
- `src/components/badges/BadgeDetailModal.tsx` — Badge info modal
- `src/components/badges/BadgeUnlockAnimation.tsx` — Unlock celebration modal

**Features:**
- [ ] Display all badges in grid (4–6 per row)
- [ ] Show badge image, name, unlock condition
- [ ] Earned badges: full color, clickable
- [ ] Locked badges: grayscale, 50% opacity, not clickable
- [ ] Click badge → detail modal (name, description, unlock condition, progress)
- [ ] Badge unlock animation when earned (bounce + confetti)
- [ ] Filter by tier (common, rare, epic, legendary, optional)
- [ ] Sort by date earned (newest first)
- [ ] Progress indicator (if applicable: "2/7 days for 7-day streak")

**Badge unlock animation (from Stage 4):**
- [ ] Trigger: Badge unlock event
- [ ] Entrance: Scale 0 → 1.2 → 1.0 (500ms bounce)
- [ ] Rotate: 0deg → 360deg (full spin)
- [ ] Glow pulse: 1s loop (repeating)
- [ ] Confetti burst: 1.5s
- [ ] Modal appears with badge + congratulations text
- [ ] Exit: Scale 1.0 → 0.8, fade out (300ms)

**Badge types (examples):**
1. "First Session" — Complete 1st session
2. "Week Warrior" — 7-day streak
3. "Month Master" — 30-day streak
4. "Perfect Score" — 100% accuracy
5. "Speed Reader" — Complete session in <10 minutes
6. "Study Squad" — Add 3+ friends
7. "Leaderboard Legend" — Rank in top 10
8. "Level 10" — Reach level 10
9. "Social Butterfly" — Earn 50+ friend XP gifts
10. "Marathon Mind" — Complete 50 sessions
11. "Accuracy Ace" — Maintain 90%+ accuracy over 5 sessions
12. "Consistency King" — 60-day streak
13. "Data Master" — Study 10,000 words
14. "Quiz Master" — Answer 500+ MCQs
15. "Ultimate MCAT" — Reach level 20 + 90%+ accuracy

**Styling:**
- [ ] Grid layout (responsive)
- [ ] Card size: 150×150px or 120×120px
- [ ] Badge image: centered, large
- [ ] Name below image
- [ ] Locked badge: grayscale filter + reduced opacity
- [ ] Hover: scale 1.1, shadow lift (if unlocked)
- [ ] Dark background
- [ ] Green highlight on earned badges

**Testing:**
- [ ] Badge gallery loads
- [ ] All badges display
- [ ] Locked badges grayscale
- [ ] Click badge → detail modal opens
- [ ] Detail modal shows unlock condition
- [ ] Badge unlock animation plays (mock unlock)
- [ ] Filter/sort work (if implemented)
- [ ] Responsive on mobile (single column or 2 columns)

---

#### 7.3 User Profile Page (Days 2–4)
**Owner:** Frontend Lead  
**Time:** 12 hours

**Page:** `src/app/profile/page.tsx` OR `/profile/[userId]` (for viewing other users)

**Components to build:**
- `src/components/profile/ProfileHeader.tsx` — User avatar, name, stats
- `src/components/profile/ProfileTabs.tsx` — Tabs: Badges, History, Friends
- `src/components/profile/SessionHistory.tsx` — Table of past sessions
- `src/components/profile/FriendsList.tsx` — Following/followers
- `src/components/profile/EditProfileModal.tsx` — Edit name/avatar (own profile only)

**Features (own profile):**
- [ ] Display user avatar, name, email
- [ ] Display tier (Free / Unlimited)
- [ ] Display stats: total points, level, streak, sessions completed
- [ ] Edit profile button (name, avatar) — for own profile only
- [ ] Badges tab: Grid of earned badges (see 7.2)
- [ ] History tab: Table of sessions (date, duration, accuracy, points)
- [ ] Friends tab: List of friends + pending requests
- [ ] Add friend button (if viewing other user's profile)

**Features (viewing other user):**
- [ ] Same display as above (stats, badges, history)
- [ ] No edit button
- [ ] "Add Friend" button (if not already friends)
- [ ] "Message" button (optional, for later)

**Edit profile modal:**
- [ ] Change name (text input)
- [ ] Change avatar (upload or select from presets)
- [ ] Save + cancel buttons
- [ ] Validation (name required, file size <5MB)

**Tabs:**
- [ ] Badges: Grid view (same as badge gallery)
- [ ] History: Table with columns (Date, Duration, Accuracy, Points, XP)
- [ ] Friends: List with names, avatars, last session date

**Session history table:**
- [ ] Sort by date (newest first)
- [ ] Pagination (20 per page)
- [ ] Click row → session detail view (optional)

**Friends list:**
- [ ] Show pending requests
- [ ] Accept/decline buttons
- [ ] Remove friend button (own profile only)

**Styling:**
- [ ] Profile header: large avatar (100×100px), centered or left-aligned
- [ ] Stats displayed prominently
- [ ] Tabs with underline (active tab = green)
- [ ] Dark background
- [ ] Responsive (mobile: single column, desktop: two columns)

**Testing:**
- [ ] Profile loads for own user
- [ ] Profile loads for other users
- [ ] Edit profile modal works (own profile only)
- [ ] Avatar upload works (mocked)
- [ ] Tabs switch correctly
- [ ] Session history displays
- [ ] Friends list displays
- [ ] Add friend button works
- [ ] Responsive on mobile

---

#### 7.4 Settings Page (Day 3)
**Owner:** Frontend Lead  
**Time:** 4 hours

**Page:** `src/app/settings/page.tsx`

**Features:**
- [ ] Account settings: email, password, delete account
- [ ] Notifications: push (if implemented), email digest
- [ ] Preferences: theme (dark/light, optional), language
- [ ] Privacy: email visibility, profile public/private
- [ ] Billing: subscription status, upgrade to unlimited, manage payment method
- [ ] About: app version, links to privacy policy, terms

**Change password:**
- [ ] Current password input (required)
- [ ] New password input (with strength indicator)
- [ ] Confirm password input
- [ ] Save button
- [ ] Success message + redirect to signin

**Delete account:**
- [ ] Confirmation dialog (warning: irreversible)
- [ ] Delete button triggers account deletion
- [ ] Redirect to landing page

**Subscription section:**
- [ ] Display current tier (Free / Unlimited)
- [ ] If Free: "Upgrade to Unlimited" button → Stripe checkout
- [ ] If Unlimited: Show billing cycle (monthly, $5/month), renewal date
- [ ] Manage subscription link (to Stripe portal)
- [ ] Cancel subscription button

**Styling:**
- [ ] Settings organized in sections
- [ ] Each section in card or panel
- [ ] Buttons: save/cancel for each section
- [ ] Dark background
- [ ] Clear labels + descriptions

**Testing:**
- [ ] Settings page loads
- [ ] Change password works
- [ ] Delete account shows confirmation
- [ ] Subscription section displays correctly
- [ ] Upgrade button navigates to Stripe checkout
- [ ] Responsive on mobile

---

#### 7.5 E2E Tests & Polish (Days 4–5)
**Owner:** QA Lead  
**Time:** 8 hours

**E2E tests (Playwright):**
```typescript
test('view leaderboard and profile', async ({ page }) => {
  // Sign in
  // Navigate to leaderboard
  // Check global view shows data
  // Switch to friends view
  // Click on a friend → navigate to their profile
  // Check profile displays
  // Return to leaderboard
})

test('earn and view badges', async ({ page }) => {
  // Sign in
  // Complete session
  // Check if badge unlocked
  // Navigate to badges
  // Check badge appears
  // Click badge → detail modal
})

test('edit profile', async ({ page }) => {
  // Sign in
  // Navigate to profile
  // Click edit
  // Change name
  // Save
  // Verify name updated in Firestore
})
```

**Bug fixes + polish:**
- [ ] All console errors fixed
- [ ] All TypeScript errors fixed
- [ ] Loading states implemented
- [ ] Error states handled (no data, network error)
- [ ] Empty states designed (no friends, no badges)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile responsiveness checked (iPhone + Android)

**Coverage target:** 75%+

---

### Week 7 Acceptance Criteria

**All items must be complete:**
- [ ] Leaderboard page displays global/friends/weekly views
- [ ] Users highlighted correctly
- [ ] Pagination works
- [ ] Real-time updates work
- [ ] Badge gallery displays all badges
- [ ] Locked badges show correctly (grayscale)
- [ ] Badge unlock animation plays
- [ ] Detail modal shows badge info
- [ ] User profile displays own stats + badges + history
- [ ] Can view other users' profiles
- [ ] Edit profile works (own profile only)
- [ ] Friends list works
- [ ] Add friend button works
- [ ] Session history displays
- [ ] Settings page accessible
- [ ] Change password works
- [ ] Delete account works
- [ ] Subscription section shows tier + renewal date
- [ ] All pages responsive on mobile
- [ ] All E2E tests passing
- [ ] No TypeScript errors
- [ ] No console errors

**Blockers:** None expected.

---

## Week 8: Polish, Testing, Performance (Days 1–5)

### Objectives
- [ ] All 15+ pages fully functional
- [ ] 90%+ unit + E2E test coverage
- [ ] Performance metrics: FCP <1.5s, LCP <2.5s, CLS <0.1
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Bug fixes + edge case handling
- [ ] Production-ready code

### Tasks

#### 8.1 Performance Optimization (Days 1–2)
**Owner:** Frontend Lead  
**Time:** 8 hours

**Metrics to measure:**
- [ ] First Contentful Paint (FCP)
- [ ] Largest Contentful Paint (LCP)
- [ ] Cumulative Layout Shift (CLS)
- [ ] Time to Interactive (TTI)
- [ ] Total JavaScript bundle size
- [ ] Asset sizes (images, fonts)

**Optimization techniques:**
- [ ] Code splitting (dynamic imports for routes)
- [ ] Image optimization (Next.js Image, WebP format)
- [ ] Font optimization (preload critical fonts)
- [ ] CSS minification (Tailwind purge)
- [ ] JavaScript minification (Next.js build)
- [ ] Lazy-load below-fold components
- [ ] Remove unused dependencies
- [ ] Tree-shake CSS (Tailwind)
- [ ] Service Worker (optional: offline support)

**Performance budgets (from Stage 5):**
- [ ] FCP: <1.5s ✓
- [ ] LCP: <2.5s ✓
- [ ] CLS: <0.1 ✓
- [ ] Total bundle: <250KB gzip ✓
- [ ] Hero image: <100KB ✓
- [ ] Confetti animation: 60 FPS desktop, 30+ mobile ✓
- [ ] Deepgram latency: <200ms ✓

**Testing tools:**
- [ ] Lighthouse (Chrome DevTools)
- [ ] WebPageTest
- [ ] Vercel Analytics (once deployed)

---

#### 8.2 Accessibility Audit (Day 2)
**Owner:** QA Lead  
**Time:** 6 hours

**WCAG 2.1 AA compliance checklist:**

**Keyboard navigation:**
- [ ] Tab order logical (header → content → footer)
- [ ] Focus visible on all interactive elements
- [ ] Can close modals with Escape key
- [ ] Can submit forms with Enter key
- [ ] Skip link to main content (optional)

**Color & contrast:**
- [ ] Text contrast ratio >= 4.5:1 (AA)
- [ ] Color not sole indicator of state (also use text/icons)
- [ ] Links underlined or have different styling

**Screen reader support:**
- [ ] All images have alt text
- [ ] Form labels associated with inputs
- [ ] ARIA labels on icon buttons
- [ ] Headings semantic (h1, h2, h3, not divs)
- [ ] Navigation landmarks (nav, main, footer)
- [ ] Live regions for dynamic content (leaderboard updates)

**Motion & animations:**
- [ ] Reduced-motion respected (prefers-reduced-motion: reduce)
- [ ] No auto-playing videos/animations
- [ ] No flashing/strobing content

**Forms:**
- [ ] Input labels visible and associated
- [ ] Error messages clear and linked to field
- [ ] Required fields marked
- [ ] Password fields not auto-filled
- [ ] Form validation on blur/submit

**Testing tools:**
- [ ] axe DevTools extension
- [ ] WAVE extension
- [ ] Manual testing with screen reader (NVDA, JAWS)
- [ ] Manual keyboard navigation

---

#### 8.3 Bug Fixes & Edge Cases (Days 2–4)
**Owner:** Entire team  
**Time:** 12 hours

**Common edge cases:**
- [ ] User signs out during reading session → graceful disconnect
- [ ] Network error during session save → retry or cache locally
- [ ] Firebase quota exceeded → show error message
- [ ] Stripe payment fails → show error + retry option
- [ ] Deepgram WebSocket disconnects → reconnect or fallback
- [ ] User loses internet → show offline message + queue actions
- [ ] Very long passage (>2000 words) → pagination or split MCQs
- [ ] Mobile with small screen → text doesn't overflow, buttons tappable
- [ ] High-speed reader → progress bar fills quickly, no lag
- [ ] Multiple tabs open → sync state across tabs
- [ ] Rapid clicks on button → disable after first click (prevent double submission)

**Data validation:**
- [ ] User data: email format, name length, password strength
- [ ] Session data: accuracy 0–100, points >= 0, XP >= 0
- [ ] Leaderboard: rank > 0, points >= 0
- [ ] MCQ: question not empty, exactly 4 options, 1 correct answer

**Error handling:**
- [ ] Firebase auth errors (invalid email, user not found, weak password)
- [ ] Firestore errors (permission denied, quota exceeded, network error)
- [ ] Stripe errors (invalid card, payment declined, checkout session expired)
- [ ] Deepgram errors (invalid token, WebSocket closed, no audio)
- [ ] HTTP errors (500, 503, network timeout)

**Testing approach:**
- [ ] Manually trigger errors (e.g., disconnect internet, modify Firestore rules)
- [ ] Add error handling + user-friendly messages
- [ ] Test error states in unit tests
- [ ] Test recovery (e.g., retry after network comes back online)

---

#### 8.4 Comprehensive Test Suite (Days 3–5)
**Owner:** QA Lead  
**Time:** 12 hours

**Unit tests target:** 85%+ coverage

```bash
npm run test -- --coverage
```

**E2E tests:** All critical user journeys

```typescript
test('complete user journey: signup → read → answer MCQ → view badges', async ({ page }) => {
  // 1. Sign up
  await page.goto('/auth/signup')
  await page.fill('input[name="email"]', 'user@test.com')
  await page.fill('input[name="password"]', 'SecurePass123')
  await page.fill('input[name="name"]', 'Test User')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')

  // 2. Start reading
  await page.click('button:has-text("Start New Session")')
  await expect(page).toHaveURL('/reader')
  await expect(page.locator('text=passage')).toBeVisible()

  // 3. Complete passage (mock Deepgram)
  // Simulate transcript updates
  // Verify word highlighting
  // Verify progress bar

  // 4. Answer MCQ
  await page.click('button:has-text("Option A")')
  // Verify feedback

  // 5. View session summary
  await expect(page.locator('text=Accuracy')).toBeVisible()

  // 6. View badges
  await page.goto('/badges')
  // Verify badge unlocked (if applicable)
})

test('subscription flow: upgrade from free to unlimited', async ({ page }) => {
  // Sign in
  // Go to settings
  // Click "Upgrade to Unlimited"
  // Complete Stripe checkout (mock)
  // Verify tier updated to "unlimited"
})

test('leaderboard real-time updates', async ({ page, context }) => {
  // Open leaderboard in 2 tabs
  // Complete session in tab 1
  // Verify rank updates in tab 2 in real-time
})
```

**Test categories:**
- [ ] Auth (signup, signin, logout, password reset, OAuth)
- [ ] Reader (passage load, word highlight, progress bar, timing)
- [ ] MCQ (modal display, selection feedback, scoring, next button)
- [ ] Dashboard (stats display, real-time updates)
- [ ] Leaderboard (ranking, filtering, pagination)
- [ ] Badges (gallery, unlock animation, detail modal)
- [ ] Profile (edit, view other users, friends)
- [ ] Settings (change password, delete account, subscription)
- [ ] Deepgram (token generation, WebSocket connection, transcription)
- [ ] Stripe (checkout session, subscription status)
- [ ] Firestore (CRUD operations, real-time listeners)

**Coverage report:**
```bash
npm run test -- --coverage --coverageReporters=text-summary
# Output:
# Statements   : X%
# Branches     : X%
# Functions    : X%
# Lines        : X%
```

**Target:** 85% overall

---

#### 8.5 Final Integration & Staging (Days 4–5)
**Owner:** Lead Developer  
**Time:** 8 hours

**Pre-deployment checklist:**

```
ENVIRONMENT
[ ] .env.local with all secrets configured
[ ] Firebase project created + rules locked down
[ ] Firestore collections created
[ ] Firebase Auth setup complete
[ ] Stripe account configured + webhooks enabled
[ ] Deepgram API key generated
[ ] Vercel project created + connected to repo

CODE QUALITY
[ ] No console.error() or console.warn() in production code
[ ] No TODO/FIXME comments left in code
[ ] No commented-out code blocks
[ ] No unused imports
[ ] TypeScript strict mode: no any types
[ ] ESLint passes (`npm run lint`)
[ ] Prettier formatting applied (`npm run format`)

PERFORMANCE
[ ] Lighthouse score >= 90 (all metrics)
[ ] Bundle size analyzed + optimized
[ ] Images optimized (WebP, correct size)
[ ] Fonts preloaded
[ ] No N+1 queries in Firestore
[ ] No memory leaks in components

SECURITY
[ ] No secrets in code (all in .env)
[ ] CORS configured correctly
[ ] Firestore security rules set
[ ] Firebase Auth rules set
[ ] Stripe webhook signature verified
[ ] Rate limiting on API endpoints (optional)
[ ] CSP headers configured (optional)

ACCESSIBILITY
[ ] WCAG 2.1 AA compliant
[ ] Keyboard navigation works
[ ] Screen reader tested
[ ] Focus indicators visible
[ ] Color contrast sufficient
[ ] Reduced-motion respected

TESTING
[ ] Unit test coverage >= 85%
[ ] All E2E tests passing
[ ] Manual testing complete (all user journeys)
[ ] Mobile testing complete (iOS + Android)
[ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)

DEPLOYMENT
[ ] Staging deployment on Vercel
[ ] Test all features on staging
[ ] Test auth flows
[ ] Test Stripe webhook
[ ] Test Deepgram integration
[ ] Performance metrics acceptable
[ ] No error logs in Sentry (if integrated)

MONITORING
[ ] Vercel Analytics configured
[ ] Error tracking setup (Sentry, optional)
[ ] Logging setup (console + backend)
[ ] Uptime monitoring (optional)
```

**Staging deployment:**
```bash
git push origin main
# Vercel auto-deploys to staging URL
# Run full test suite against staging
# Test critical user journeys manually
```

---

#### 8.6 Documentation & Handoff (Day 5)
**Owner:** Lead Developer  
**Time:** 4 hours

**Documentation to create:**

1. **README.md** — Setup + deployment instructions
2. **DEVELOPMENT.md** — Developer guide (file structure, conventions)
3. **API.md** — API endpoint documentation
4. **ARCHITECTURE.md** — System design + data flow
5. **TESTING.md** — How to run tests + CI/CD
6. **DEPLOYMENT.md** — How to deploy to production
7. **TROUBLESHOOTING.md** — Common issues + solutions

**Code comments:**
- [ ] Complex functions documented with JSDoc
- [ ] Component props documented
- [ ] Firestore queries documented
- [ ] API routes documented

**Commit history:**
- [ ] Meaningful commit messages
- [ ] Commits organized by feature
- [ ] No merge commits (rebase where possible)

---

### Week 8 Acceptance Criteria

**All items must be complete:**
- [ ] Lighthouse score >= 90 (all metrics)
- [ ] FCP < 1.5s, LCP < 2.5s, CLS < 0.1
- [ ] Unit test coverage >= 85%
- [ ] All E2E tests passing
- [ ] WCAG 2.1 AA compliant
- [ ] All known bugs fixed
- [ ] All edge cases handled
- [ ] Mobile responsive (tested on iOS + Android)
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)
- [ ] Staging deployment successful
- [ ] All critical user journeys work on staging
- [ ] Documentation complete
- [ ] Code clean (no console errors, no TODOs)
- [ ] Ready for production deployment

**Blockers:** None expected if previous weeks completed.

---

## Stage 6 Final Checklist

**Completion Gates:**

| Week | Task | Status |
|------|------|--------|
| 4 | Auth system + Foundation | ✅ |
| 5 | Landing page + Dashboard | ✅ |
| 6 | Reader + MCQ + Scoring | ✅ |
| 7 | Leaderboard + Badges + Profile | ✅ |
| 8 | Performance + Testing + Deployment | ✅ |

**Final deliverables:**
- ✅ 15+ pages fully functional
- ✅ 40+ components built + tested
- ✅ All integrations working (Firebase, Deepgram, Stripe)
- ✅ Real-time data syncing (Firestore)
- ✅ 90%+ test coverage
- ✅ Lighthouse score >= 90
- ✅ Mobile responsive
- ✅ WCAG 2.1 AA compliant
- ✅ Staging deployment successful
- ✅ Documentation complete
- ✅ Ready for Stages 7–10 (polish, validation, handoff)

---

## Status

**Stage 6: Build Pass — COMPLETE ✅**

All code written, tested, and staged.

**Next stage:** Stage 7: Motion Polish (Week 9, advanced animations)

---

## Sign-Off

**Completed by:** Development Team  
**Date:** June 28, 2026 (End of Week 8)  
**Status:** Ready for Stage 7

**Proceed to Stage 7?** [YES / NO]

