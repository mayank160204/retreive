# RETREIVE: Production App Build Plan (Titan Workflow Applied)

**Date:** May 31, 2026  
**Status:** Ready for Implementation  
**Framework:** Titan Workflow adapted for SaaS/Product Apps

---

## Executive Summary

**RETREIVE requires the "SaaS/Product Landing + App Shell Combo"** from the Titan Workflow:

```
build-web-apps:frontend-app-builder
+ product-design
+ scroll-experience (landing page only)
+ page-cro (conversion optimization)
+ tailwind-design-system
+ shadcn-ui / radix-ui
+ react-best-practices
+ web-performance-optimization
+ fixing-accessibility
+ ui-visual-validator
```

**Production timeline:** 10–14 weeks for MVP (Phases 1–2 combined)

**Key phases:**
1. **Planning & Design** (Weeks 1–3): Stages 0–5 in Titan
2. **MVP Build** (Weeks 4–8): Stages 6–8 in Titan + backend integration
3. **Polish & Validation** (Weeks 9–10): Stages 9–10 + full system testing
4. **Launch prep** (Weeks 11–14): Deployment, monitoring, beta launch

---

## Titan Workflow Stages Applied to RETREIVE

### Stage 0: Project Intake ✅ **COMPLETE**

**Status:** Already done in PRODUCT_BRIEF.md

**What we have:**
- ✅ Product name: RETREIVE
- ✅ Category: EdTech / MCAT Study App
- ✅ Target user: Pre-med students (18–25)
- ✅ Primary action: Sign up → Complete first free session
- ✅ Emotional goal: "Study smarter, not harder"
- ✅ Business goal: 30–40% free-to-paid conversion
- ✅ Offer: 1 free session, then $5/month
- ✅ Required sections: Dashboard, karaoke reader, leaderboards, profile
- ✅ Constraints: Next.js, Firebase, Deepgram, Stripe, <2 min onboarding

**Acceptance gate:** ✅ **PASSED**

---

### Stage 1: Visual Thesis ✅ **COMPLETE**

**Status:** Already defined in SCREEN_GENERATION_PROMPT.md (dark theme) + SCREEN_GENERATION_PROMPT_LIGHT_THEME.md

**Visual Thesis (Dark Theme - Primary):**

**One-sentence thesis:**
"Dark, energetic, minimalist interface with bright green accent; karaoke-style reading feels modern, not clinical; every element serves either learning or engagement."

**Aesthetic stance:**
- **Material:** Dark charcoal (#0F0F0F) base with white text and green accents
- **Energy:** High-contrast, modern, energetic (not "study app boring")
- **Principle:** "Breathable" whitespace; typography-led design; green highlights only on actions
- **Feeling:** Tech-forward, professional, approachable

**Differentiation anchor:**
- Real-time word highlighting (karaoke reader)
- Prominent streak + leaderboard (social gamification, not typical for study apps)
- Green accent used only for success/action (not overused)

**Hero concept (Landing page):**
- Full-screen hero with animated character reading aloud
- Headline: "Speak Your Way to MCAT Mastery"
- Single CTA: "Sign in with Google" (green, 56px)
- Confetti/celebratory motion on scroll
- No cards, no decorative blobs, no gradient noise

**Motion thesis:**
1. **Entrance:** Confetti burst on page load (celebratory, brief)
2. **Scroll:** Subtle parallax on opening cards; hero text fades in
3. **Micro-interactions:** Green highlight on button hover; word highlighting during reading (core interaction)

**DFII Score:**
- Aesthetic Impact: 5/5 (distinctive from Khan Academy, Kaplan)
- Context Fit: 5/5 (dark theme matches modern SaaS, appeals to younger users)
- Implementation Feasibility: 4/5 (straightforward with Tailwind + Framer Motion)
- Performance Safety: 5/5 (minimal heavy effects; word highlighting is CSS)
- Consistency Risk: 5/5 (green accent rule is clear; no competing visual ideas)
- **Total DFII: 24/25 = 9.6/10** ✅

**Acceptance gate:** ✅ **PASSED**

---

### Stage 2: Content Spine ✅ **COMPLETE**

**Status:** Defined in SCREEN_GENERATION_PROMPT.md + PRODUCT_BRIEF.md

**Landing Page Sections:**

| Section | Job | Headline | CTA | Visual Role |
|---------|-----|----------|-----|-------------|
| **Hero** | Hook + immediate value | "Speak Your Way to MCAT Mastery" | "Sign in with Google" | Animated character reading; confetti |
| **How It Works** | Explain the unique mechanic | "Read aloud. The app listens. You remember more." | "See how" (scroll) | 3-step visual sequence (upload → read → improve) |
| **Social Proof** | Trust signal | "Join 50K+ students crushing the MCAT" | View testimonials (future) | Leaderboard preview, badges, streaks |
| **Pricing** | Conversion offer | "Start free, then $5/month to keep studying" | "Start free session" | Simple pricing card + feature comparison |
| **CTA** | Final conversion | "Your free session is ready. No credit card required." | "Sign in with Google" | Reassurance copy, green button |

**Dashboard Sections (Post-signup):**

| Section | Job | Content | Interaction | Visual |
|---------|-----|---------|-------------|--------|
| **Engagement Metrics** | Show progress at glance | Streak 🔥, Level, Weekly words | Tap to view detail | Cards with progress bars |
| **Upload CTA** | Primary action | "Start your first free session" | Drag-drop or click | Green dashed border card |
| **Recent Sessions** | Resume or new session | List of past PDFs | Click to resume | Simple list with timestamps |
| **Study Group** | Social proof | Group leaderboard preview | Tap to view full | Leaderboard table preview |
| **Weekly Leaderboard** | Competition | Global top 100 | Filters (Friends, All) | Rank table with medal icons |

**Acceptance gate:** ✅ **PASSED** (all sections serve learning or conversion, no filler)

---

### Stage 3: Asset Direction ✅ **COMPLETE**

**Status:** Defined in SCREEN_GENERATION_PROMPT.md

**Asset Inventory:**

| Asset Type | Use | Source | Fallback |
|------------|-----|--------|----------|
| **Hero Illustration** | Landing page hero (student reading + confetti) | Custom Figma + Stitch OR Unsplash + Illustrator | Solid gradient background with text |
| **Opening Cards** | 10 educational carousel cards (landing + pre-signup) | Generated text + emoji (lightweight) | Fallback: Text-only cards |
| **Mascot Character** | Dashboard (optional, toggleable) | Lottie animation OR SVG character | Hidden by default; no loss if disabled |
| **Icons** | UI icons (mic, streak, level, trophy, etc.) | Iconsax library (24px, 1.5px stroke) | Text fallback (e.g., "Streak: 12") |
| **Word Highlighting** | Core reader mechanic (CSS, not image) | CSS transforms + color + opacity | Already pure CSS; no asset needed |
| **Badge Graphics** | Achievement badges (50×50px) | Generated OR simple SVG + gradient | Text-based badges |
| **Leaderboard Avatars** | User profile pictures | Firebase Auth Google avatars | Generic default avatar |

**Performance Budget:**
- Hero image: <100KB (lazy-loaded if below fold)
- Lottie mascot: <50KB (code-split, optional)
- Icon set: <30KB (embedded in JS bundle)
- Total page weight goal: <500KB on 4G

**Acceptance gate:** ✅ **PASSED** (all assets have fallbacks; no essential 3D or video)

---

### Stage 4: Interaction System ✅ **COMPLETE**

**Status:** Defined in SCREEN_GENERATION_PROMPT.md + ADDICTIVE_APP_STRATEGY_ANALYSIS.md

**Core Interactions:**

| Element | Default | Hover | Click/Tap | Scroll Entry | Ambient | Tool | Priority |
|---------|---------|-------|-----------|--------------|---------|------|----------|
| **Google OAuth Button** | Green, 56px | Darker green, shadow lift | Redirect to OAuth | Fade-in on scroll | None | CSS | Must-have |
| **Email/Phone Toggle** | Gray outline | Border lightens | Expand inline form | N/A | None | React state | Must-have |
| **CTA Buttons** | Green solid | Darker, lift shadow | Interaction flow | Subtle glow pulse | None | CSS | Must-have |
| **Karaoke Word** | White text | N/A | Read aloud (core) | N/A | Animate highlight on read | CSS + JS | Must-have |
| **Streak Counter** | 🔥 display | Slight scale-up | View countdown modal | Pulse animation | Countdown timer ticks | CSS + JS | Must-have |
| **Leaderboard Row** | Neutral | Row background highlight | View user profile | Stagger fade-in | Periodic refresh (30s) | React | Must-have |
| **Level Progress Bar** | Static fill | N/A | N/A | Animate fill on new points | Smooth drain on points earned | Anime.js | Should-have |
| **Session Celebration** | Confetti burst | N/A | Auto-play | Auto-trigger on session end | Confetti particles fall | Canvas OR Lottie | Should-have |
| **Badge Unlock** | Modal slide-in | N/A | Tap to share | Full-screen + sound | Bounce animation | Framer Motion | Should-have |
| **Reduced-Motion** | All | All | All | All | **All paused/static** | CSS `prefers-reduced-motion` | Must-have |

**Acceptance gate:** ✅ **PASSED** (all CTAs have visible feedback; reduced-motion defined)

---

### Stage 5: Tech Spec ✅ **READY**

**Status:** Ready to finalize; see detailed tech spec below

**Stack:**
```
Frontend: Next.js 14 (App Router) + React 18 + TypeScript
Styling: Tailwind CSS + CSS Modules for component scoping
UI Components: Shadcn/ui + Radix UI (accessible, unstyled)
Animation: Framer Motion (scroll) + Anime.js (advanced) + CSS (micro)
State: Zustand (lightweight, sessions)
Forms: React Hook Form + Zod (validation)
PDF: pdf.js (client-side parsing)
Real-time: Firebase Realtime + Firestore listeners
Audio: Web Audio API + Deepgram WebSocket
Payment: Stripe.js + server-side webhooks
Icons: Iconsax library OR Heroicons
Charts: Recharts (session analytics)

Backend: Firebase (Auth, Firestore, Hosting, Functions)
API Gateway: Vercel serverless functions (webhooks, Deepgram proxy)
Speech Recognition: Deepgram WebSocket API
LLM: OpenAI API (GPT-4 for MCQ generation)
Payment: Stripe (subscriptions)

Database: Firestore (NoSQL; real-time sync)
Hosting: Vercel (Next.js optimized) + Firebase Hosting (fallback)
CDN: Vercel Edge Network + Firebase Hosting CDN
Analytics: PostHog OR Mixpanel (event tracking)
Error Tracking: Sentry
Logging: Vercel logs + Firebase Cloud Logging

Development:
- Package manager: pnpm (fast, strict dependencies)
- Build: Next.js default (Webpack)
- Testing: Vitest + React Testing Library (unit/component)
- E2E: Playwright (critical user flows)
- Linting: ESLint + Prettier
- Type checking: TypeScript strict mode
- Git: GitHub + GitHub Actions (CI/CD)
```

**File Architecture:**

```
retreive/
├── app/
│   ├── (auth)/
│   │   ├── signup/
│   │   │   ├── page.tsx (multi-method signup)
│   │   │   └── components/
│   │   │       ├── GoogleOAuthButton.tsx
│   │   │       ├── EmailForm.tsx
│   │   │       └── PhoneOTPForm.tsx
│   │   └── login/
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx (main dashboard)
│   │   │   └── components/
│   │   │       ├── StreakCard.tsx
│   │   │       ├── LevelProgress.tsx
│   │   │       ├── UploadArea.tsx
│   │   │       ├── RecentSessions.tsx
│   │   │       └── LeaderboardPreview.tsx
│   │   ├── reader/
│   │   │   ├── [sessionId]/
│   │   │   │   └── page.tsx (karaoke reader)
│   │   │   └── components/
│   │   │       ├── KaraokeReader.tsx
│   │   │       ├── WordHighlighter.tsx
│   │   │       ├── MCQModal.tsx
│   │   │       ├── ProgressCylinder.tsx
│   │   │       └── SessionSummary.tsx
│   │   ├── leaderboard/
│   │   │   ├── page.tsx (global + filters)
│   │   │   └── components/
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx (app shell)
│   ├── (landing)/
│   │   ├── page.tsx (landing page)
│   │   └── components/
│   │       ├── Hero.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── SocialProof.tsx
│   │       └── PricingCard.tsx
│   └── layout.tsx (root)
├── components/
│   ├── ui/
│   │   ├── Button.tsx (shadcn)
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── [...other base components]
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Mascot.tsx
│   │   └── Toast.tsx
│   └── animations/
│       ├── WordHighlight.tsx
│       ├── StreakPulse.tsx
│       └── ConfettiExplosion.tsx
├── lib/
│   ├── firebase.ts (config + initialization)
│   ├── auth.ts (custom auth hooks)
│   ├── db.ts (Firestore helpers)
│   ├── deepgram.ts (speech recognition wrapper)
│   ├── stripe.ts (payment helpers)
│   ├── pdf.ts (PDF parsing)
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useSession.ts
│   ├── useLeaderboard.ts
│   ├── useStreak.ts
│   └── useDeepgram.ts
├── types/
│   ├── index.ts (global types)
│   ├── user.ts
│   ├── session.ts
│   └── leaderboard.ts
├── styles/
│   ├── globals.css (Tailwind base + tokens)
│   ├── animations.css (advanced animations)
│   └── variables.css (CSS variables)
├── public/
│   ├── icons/
│   ├── illustrations/
│   └── fonts/
├── .env.local (Firebase keys, API secrets)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

**Performance Budgets:**

```
Initial Load (4G):
- First Contentful Paint (FCP): <2s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Total Bundle Size: <300KB (gzipped)

Runtime:
- Reader session open: <500ms
- MCQ generation: <2s
- Leaderboard load: <1s
- Word highlight latency: <150ms
```

**Accessibility Checklist:**

- [ ] WCAG 2.1 AA compliance (4.5:1 contrast minimum)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus states visible (2px green outline)
- [ ] ARIA labels on icon buttons
- [ ] Form labels associated with inputs
- [ ] Reduced-motion support (no animations if `prefers-reduced-motion`)
- [ ] Live regions for dynamic content (MCQ feedback, toast notifications)
- [ ] Semantic HTML (nav, main, section, article)
- [ ] Color not sole indicator (stripe + text for status)
- [ ] Mobile touch targets ≥48px × 48px

**Acceptance gate:** ✅ **READY** (all dependencies, folder structure, and performance targets defined)

---

## Stage 6: Build Pass (MVP Implementation)

**Timeline:** Weeks 4–8

**Phase 1A: Foundation (Week 4)**

Tasks:
1. Initialize Next.js 14 project + TypeScript setup
2. Configure Tailwind CSS + Shadcn/ui
3. Set up Firebase project + Firestore schema
4. Create base layout (app shell, navigation, header)
5. Implement responsive CSS grid + token system
6. Set up GitHub Actions CI/CD pipeline

Deliverable:
- [ ] `next dev` runs without errors
- [ ] Responsive base layout works on desktop/tablet/mobile
- [ ] Firestore collections initialized
- [ ] GitHub Actions deploys to staging on push

**Phase 1B: Authentication (Week 4–5)**

Tasks:
1. Implement Firebase Auth (Google OAuth provider)
2. Create signup page with multi-method options:
   - Google OAuth (primary)
   - Email + password (secondary, inline form)
   - Phone + OTP (tertiary, inline form)
3. Create login page
4. Implement auth context hook (`useAuth`)
5. Add route guards (auth middleware)
6. Create user profile schema in Firestore

Deliverable:
- [ ] User can sign up via Google
- [ ] User can sign up via email + password
- [ ] User can sign up via phone + OTP
- [ ] Auth persists across page reload
- [ ] Redirects work (landing → dashboard if signed in)

**Phase 1C: Dashboard (Week 5)**

Tasks:
1. Create dashboard layout (engagement metrics, upload area, recent sessions)
2. Build engagement metric cards (streak, level, weekly words)
3. Build upload area (drag-drop + click to browse)
4. Implement PDF parser (pdf.js) + passage segmentation
5. Create recent sessions list (resumable)
6. Connect to Firestore (load user data)
7. Add basic styling + responsive layout

Deliverable:
- [ ] Dashboard loads user data from Firestore
- [ ] Drag-drop PDF upload works
- [ ] PDF parses into passages (400–600 words)
- [ ] Recent sessions display (if any)
- [ ] Responsive on mobile/tablet/desktop

**Phase 1D: Karaoke Reader (Week 6–7) - CRITICAL**

Tasks:
1. Create reader layout (passage text, controls, progress)
2. Implement Web Audio API + microphone permission
3. Integrate Deepgram WebSocket for real-time transcription
4. Build word highlighting logic (compare transcription vs. passage)
5. Calculate accuracy % per session
6. Create progress cylinder visualization
7. Add session timer + controls (play, pause, next, end)
8. Implement MCQ modal (post-passage)
9. Create session summary card

Deliverable:
- [ ] User can read a passage aloud
- [ ] Words highlight in real-time as read
- [ ] Accuracy % calculated and displayed
- [ ] MCQ appears after each passage
- [ ] Session summary shows stats (words, accuracy, time)

**Phase 1E: Leaderboards (Week 7–8)**

Tasks:
1. Create global weekly leaderboard view
2. Implement private study group leaderboard
3. Add leaderboard filters (All, Friends, Groups)
4. Create Firestore listeners for real-time rank updates
5. Add "distance to next rank" calculation
6. Build leaderboard table component (responsive)

Deliverable:
- [ ] Global leaderboard displays top 100 users
- [ ] User can see own rank + distance to next
- [ ] Private group leaderboards work
- [ ] Real-time updates (30-sec refresh)

**Phase 1F: Points & Level System (Week 8)**

Tasks:
1. Implement points allocation logic:
   - Base: +10 per passage
   - Accuracy bonus: +5 for 85%+
   - MCQ bonus: +10 per correct
   - Streak bonus: +10 if streak ≥7 days
2. Create level progression system (100 pts = L1, 250 = L2, etc.)
3. Build level-up celebration modal
4. Update dashboard with real-time points/level
5. Add points earned to session summary

Deliverable:
- [ ] Points accumulate per session
- [ ] Level progress shows on dashboard
- [ ] Level-up celebration triggers
- [ ] Leaderboard ranks update by points

**Acceptance gate:** ✅ **Build completes Week 8**
- [ ] All 10 screens are functional (not polished)
- [ ] Core flows work (signup → upload → read → points)
- [ ] Firestore schema is correct
- [ ] No Critical bugs remain

---

## Stage 7: Motion Polish Pass

**Timeline:** Week 9

**Tasks:**

1. **Hero entrance animations**
   - Confetti burst on landing page load (100ms, brief)
   - Hero text fade-in on scroll
   - Opening cards carousel transition (300ms fade)

2. **Karaoke reader animations**
   - Word highlight animation (100–150ms ease-out)
   - Progress cylinder drain (smooth, no discrete steps)
   - MCQ slide-in on passage completion (200ms)

3. **Engagement animations**
   - Streak counter pulse (1s, repeating)
   - Level progress bar fill (300ms ease-out when points earned)
   - Badge unlock modal bounce (250ms)
   - Confetti on session complete (canvas-based)

4. **Micro-interactions**
   - Button hover: scale 1.02 + shadow lift (100ms)
   - Button active: scale 0.98 (50ms)
   - Input focus: 2px green glow + border (100ms)
   - Leaderboard row hover: background highlight (100ms)

5. **Reduced-motion fallbacks**
   - All animations disabled if `prefers-reduced-motion: reduce`
   - Confetti replaced with static image
   - Transitions become instant

**Tools:**
- Framer Motion (scroll, entrance animations)
- Anime.js (progress bar, complex timelines)
- CSS (micro-interactions, focus states)
- Canvas/Lottie (confetti)

**Deliverable:**
- [ ] Hero entrance is memorable but not slow
- [ ] Word highlighting feels smooth and responsive
- [ ] Confetti on session complete
- [ ] All reduced-motion tests pass

---

## Stage 8: Performance & Accessibility Gate

**Timeline:** Week 9

**Performance Audit:**

1. **Bundle Analysis**
   - Run `next build --analyze`
   - Identify large dependencies (Deepgram, OpenAI client, pdf.js)
   - Code-split heavy features (reader, leaderboard)
   - Lazy-load mascot character (optional)

2. **Image Optimization**
   - Convert PNG → WebP + fallback
   - Lazy-load below-fold images
   - Add `sizes` attribute for responsive images
   - Compress hero illustration <100KB

3. **Animation Performance**
   - Use `transform` + `opacity` only (no layout-thrashing)
   - Verify word highlight doesn't trigger reflows
   - Test confetti on low-end mobile (60fps target)

4. **Deepgram Integration Optimization**
   - Reuse WebSocket connection per session
   - Implement exponential backoff for reconnects
   - Cache ephemeral tokens (5-min TTL)
   - Add offline fallback (graceful error)

5. **Lighthouse Audit**
   - Target: 90+ Performance, 95+ Accessibility, 95+ Best Practices
   - Measure FCP <2s, LCP <2.5s, CLS <0.1

**Accessibility Audit:**

1. **WCAG 2.1 AA Compliance**
   - Run Axe DevTools on all pages
   - Fix Critical/High issues immediately
   - Test keyboard navigation (Tab, Enter, Escape)
   - Verify color contrast (4.5:1 for text)

2. **Screen Reader Testing**
   - Test with NVDA (Windows) + Safari VoiceOver (Mac)
   - Verify form labels associated with inputs
   - Check ARIA labels on icon buttons
   - Test live regions (MCQ feedback, leaderboard updates)

3. **Mobile Accessibility**
   - Verify touch targets ≥48px × 48px
   - Test on iOS + Android (voice control, gesture support)
   - Verify zoom doesn't break layout

4. **Reduced-Motion Testing**
   - Enable "Reduce Motion" in OS settings
   - Verify page works without animations
   - Confirm confetti doesn't display

**Deliverables:**
- [ ] Lighthouse: 90+ Performance, 95+ Accessibility
- [ ] Axe: 0 Critical, 0 High violations
- [ ] Bundle: <300KB gzipped
- [ ] FCP: <2s on 4G
- [ ] Keyboard navigation works on all pages
- [ ] Screen reader announces key content correctly

---

## Stage 9: Visual Validation

**Timeline:** Week 10

**Viewports to Validate:**

1. Desktop: 1440 × 900
2. Laptop: 1280 × 800
3. Tablet: 768 × 1024
4. Mobile: 390 × 844
5. Small mobile: 360 × 740

**States to Check:**

- Initial load (landing page, dashboard, reader, leaderboard)
- Hover/focus (buttons, inputs, leaderboard rows)
- Mobile menu open
- Mid-scroll sections
- Final CTA areas
- Reduced-motion mode enabled
- Light theme (if implemented)

**Visual Checklist:**

- [ ] First viewport is visually distinctive (dark theme, green accent clear)
- [ ] Text fits and is readable on all viewports
- [ ] No overflow or clipping (inputs, cards, buttons)
- [ ] Responsive layout quality (no awkward gaps or squashing)
- [ ] CTA buttons are visible and sized correctly
- [ ] Images load and render correctly
- [ ] Animations don't cause text overlap
- [ ] Accessibility visual cues present (focus states, error colors)
- [ ] Cross-section consistency (spacing, typography, colors)
- [ ] Dark theme applied consistently across all screens

**Validation Process:**

1. Take screenshots at all 5 viewports using Playwright
2. For each viewport, check:
   - First viewport clarity
   - Text hierarchy and legibility
   - Button/input sizing and alignment
   - Image/asset rendering
   - Animation smoothness (record 30-sec video clips)
   - Mobile first viewport specifically (most important)
3. Fix Critical/High visual issues immediately
4. Re-screenshot after fixes
5. Export final validation report with before/after screenshots

**Deliverables:**
- [ ] Visual QA report (all 5 viewports, all sections)
- [ ] Screenshots at 1440px, 768px, 390px
- [ ] Video clips of key animations (hero, word highlight, confetti)
- [ ] No Critical/High visual issues remain

---

## Stage 10: Final Handoff & Launch Prep

**Timeline:** Weeks 11–14

### Phase 2A: Backend Integration & Testing

**Tasks:**

1. **Stripe Payment Integration**
   - Connect Stripe API (product + price IDs)
   - Implement checkout flow (after first session)
   - Create webhook handlers (subscription events)
   - Test subscription creation + cancellation
   - Test renewal and billing email

2. **Firebase Realtime Sync**
   - Test Firestore listeners (leaderboard, user data)
   - Verify real-time updates (streak, points, rank)
   - Test offline persistence + sync on reconnect
   - Monitor Firestore costs (reads/writes per user)

3. **OpenAI MCQ Generation**
   - Fine-tune GPT-4 on MCAT-style questions (or use base model)
   - Test MCQ quality (relevance, difficulty, explanations)
   - Implement caching (don't regenerate same passage)
   - Set up cost monitoring

4. **Email Notifications (Future)**
   - Set up SendGrid template (streak reminder)
   - Schedule 2-hour-before-reset notification (Firebase Cloud Scheduler)
   - Test email delivery

5. **Analytics Setup**
   - Install PostHog or Mixpanel
   - Track key events:
     - Signup (source: Google, email, phone)
     - First session completion
     - Subscription purchase
     - Leaderboard view
     - Session resume
   - Create funnels (signup → first session → subscription)

6. **Error Monitoring**
   - Install Sentry
   - Configure error thresholds (critical alerts)
   - Test error reporting (intentional crashes)

**Deliverables:**
- [ ] Full signup → first session → subscription flow works end-to-end
- [ ] Payment webhook processing subscriptions correctly
- [ ] Realtime leaderboard updates work across multiple users
- [ ] Analytics captures key events
- [ ] Error tracking and alerting configured

### Phase 2B: System Testing

**Types of Tests:**

1. **Unit Tests** (Vitest + React Testing Library)
   - Test utility functions (point calculation, streak logic)
   - Test component rendering (buttons, forms, cards)
   - Target: 70%+ coverage on critical paths

2. **Integration Tests**
   - Test auth flow (signup → dashboard redirect)
   - Test PDF upload → parsing → reader flow
   - Test session → points → leaderboard update
   - Use Firestore emulator for testing

3. **E2E Tests** (Playwright)
   - Test complete user journeys:
     1. Sign up via Google → Dashboard
     2. Upload PDF → Read first passage → MCQ → Summary
     3. View leaderboard → See own rank
     4. Subscribe → Access unlimited sessions
   - Run on staging environment
   - Target: 5 critical user flows

4. **Load Testing**
   - Simulate 100 concurrent users
   - Monitor Firestore read/write rates
   - Test leaderboard updates under load
   - Verify Deepgram WebSocket connections scale

5. **Security Testing**
   - Test Firebase security rules (users can only read own data + public leaderboard)
   - Test payment flow security (no client-side secret exposure)
   - Test Deepgram token expiration + renewal
   - Verify HTTPS enforcement

**Deliverables:**
- [ ] Unit tests pass (70%+ critical path coverage)
- [ ] E2E tests for 5 critical flows pass
- [ ] Load test: handles 100 concurrent users without errors
- [ ] Security audit: 0 Critical findings
- [ ] Performance: Page load <2s, API responses <1s

### Phase 2C: Beta Launch & Monitoring

**Before Launch:**

1. **Deployment Checklist**
   - [ ] Environment variables configured (.env.production)
   - [ ] Database migrations tested
   - [ ] Stripe webhook secrets set
   - [ ] Firebase security rules deployed
   - [ ] Analytics events configured
   - [ ] Error tracking set up
   - [ ] Backups configured (Firestore)
   - [ ] Support system ready (email support, FAQ)

2. **Launch Sequence**
   - Deploy to staging (Vercel Preview)
   - Run final smoke tests
   - Deploy to production (Vercel main)
   - Monitor error rates (first 24 hours)
   - Monitor performance metrics (FCP, LCP)

3. **Beta Cohort**
   - Invite 100–500 pre-med students (Reddit, Discord, email list)
   - Collect feedback (in-app survey + Discord channel)
   - Monitor signup → session conversion
   - Monitor churn (Day 1, Day 7, Day 30)

4. **Post-Launch Monitoring (Weeks 11–14)**
   - Track metrics daily:
     - Signup rate
     - Session completion rate
     - Free-to-paid conversion rate
     - DAU / MAU
     - Average session duration
     - Leaderboard engagement
     - Error rates (Sentry)
   - Weekly analysis:
     - Are users converting at 30–40%?
     - Are streaks driving retention?
     - Are leaderboards increasing engagement?
   - Adjust pricing / onboarding if conversion is <20%

**Deliverables:**
- [ ] Production environment live on Vercel
- [ ] Monitoring dashboards set up (Sentry, analytics)
- [ ] Beta launch with 100+ users
- [ ] Launch metrics tracked daily
- [ ] Support system operational

---

## Complete Implementation Checklist

### Pre-Launch (Weeks 1–10)

**Week 1–3: Planning**
- [ ] Stage 0: Project Intake (COMPLETE)
- [ ] Stage 1: Visual Thesis (COMPLETE)
- [ ] Stage 2: Content Spine (COMPLETE)
- [ ] Stage 3: Asset Direction (COMPLETE)
- [ ] Stage 4: Interaction System (COMPLETE)
- [ ] Stage 5: Tech Spec (READY)

**Week 4–5: Foundation + Auth**
- [ ] Next.js + Tailwind setup
- [ ] Firebase project initialized
- [ ] Multi-method signup (Google, email, phone)
- [ ] Auth context + route guards
- [ ] Base layout responsive on mobile/desktop

**Week 5: Dashboard**
- [ ] Dashboard layout + engagement metrics
- [ ] PDF upload + passage parsing
- [ ] Recent sessions list
- [ ] Connected to Firestore

**Week 6–7: Karaoke Reader (CRITICAL)**
- [ ] Real-time word highlighting
- [ ] Deepgram WebSocket integration
- [ ] Accuracy % calculation
- [ ] MCQ modal
- [ ] Session summary

**Week 7–8: Leaderboards + Points**
- [ ] Global + private leaderboards
- [ ] Points allocation + level system
- [ ] Real-time rank updates
- [ ] Level-up celebrations

**Week 9: Motion + Performance**
- [ ] Motion polish (hero, reader, confetti)
- [ ] Performance optimization (<300KB bundle)
- [ ] Accessibility audit (WCAG AA)
- [ ] Lighthouse 90+

**Week 10: Validation**
- [ ] Visual validation (5 viewports)
- [ ] Screenshot QA report
- [ ] No Critical/High visual issues

### Launch Prep (Weeks 11–14)

**Week 11: Integration**
- [ ] Stripe payment end-to-end
- [ ] Firestore realtime sync
- [ ] OpenAI MCQ generation
- [ ] Analytics setup
- [ ] Error monitoring

**Week 12: Testing**
- [ ] Unit tests (70%+ coverage)
- [ ] E2E tests (5 critical flows)
- [ ] Load testing (100 concurrent users)
- [ ] Security audit

**Week 13: Pre-Launch**
- [ ] Final smoke tests
- [ ] Production deployment
- [ ] Monitoring dashboards
- [ ] Support system ready

**Week 14: Beta Launch**
- [ ] 100–500 beta users
- [ ] Daily metric tracking
- [ ] Feedback collection
- [ ] Iteration based on data

---

## Key Success Metrics (Launch + Beyond)

**Month 1 (Beta):**
- Target: 100 signups
- Target: 35% free-to-paid conversion
- Target: 40% Day 7 retention
- Target: 3–4 sessions/week per paid user

**Month 2–3 (Growth):**
- Target: 1,000 signups (organic + paid ads)
- Target: 40% free-to-paid conversion
- Target: 50% Day 7 retention
- Target: 3–5 sessions/week per paid user
- Target: $1–2K MRR

**Month 6 (Scaling):**
- Target: 10,000 signups
- Target: 40% free-to-paid conversion
- Target: 50%+ Day 7 retention
- Target: 4–6 sessions/week per paid user
- Target: $15–20K MRR

---

## Potential Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Deepgram API costs exceed budget | Medium | High | Implement caching; optimize token usage; set rate limits |
| Low MCQ quality hurts conversion | Medium | High | Hire MCAT expert for QA; use fine-tuned GPT model |
| Stripe webhook failures lose revenue | Low | Critical | Test webhook resilience; implement retry logic; monitor logs |
| Firebase Firestore costs scale unexpectedly | Medium | Medium | Optimize queries; batch operations; monitor read/write rates |
| High mobile app crash rate | Low | High | Test on 5+ devices; use error monitoring (Sentry) |
| Poor user retention (churn >10%/month) | High | Critical | Focus on engagement (streaks, leaderboards, badges) |
| Competitor launches similar app | High | Medium | Differentiate on UX polish + community features |

---

## Conclusion

**RETREIVE is production-ready for MVP launch** following this 14-week plan:

1. **Weeks 1–3:** Planning + design (stages 0–5) ✅ **ALREADY COMPLETE**
2. **Weeks 4–8:** Core build (stages 6–7)
3. **Week 9:** Motion + performance (stage 8)
4. **Week 10:** Validation (stages 9–10)
5. **Weeks 11–14:** Integration, testing, and beta launch

**Critical path dependencies:**
- Karaoke reader (real-time word highlighting) = MUST complete by Week 7
- Leaderboards (social engagement) = MUST complete by Week 8
- Stripe integration = MUST complete by Week 11
- Deepgram WebSocket = MUST work reliably before launch

**Team size for MVP:** 4–6 engineers
- 1 Backend (Firebase + Deepgram + Stripe)
- 1 Frontend (UI + animations)
- 1 Full-stack (reader logic + WebSocket)
- 1 QA (testing + performance validation)
- 1 DevOps (CI/CD + monitoring + deployment)

**Go/No-Go decision:** End of Week 10 (before launch prep)
- Must have: <300KB bundle, 90+ Lighthouse, 35%+ conversion on beta
- If missing: iterate Weeks 11–12, delay launch to Week 15

---

**End of Production Build Plan**

*For detailed specs, see: PRODUCT_BRIEF.md, SCREEN_GENERATION_PROMPT.md, ADDICTIVE_APP_STRATEGY_ANALYSIS.md*
