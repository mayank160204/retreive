# RETREIVE - Product Brief

**Version:** 1.0  
**Date:** May 2026  
**Status:** Ready for Development

---

## Executive Summary

**RETREIVE** is a mobile-first MCAT study platform that transforms how students learn by combining **speech-based reading** with **real-time AI feedback, engagement gamification, and adaptive quizzes**. Unlike passive reading or cramming apps, RETREIVE uses the neuroscience principle that **speaking + listening + reading simultaneously increases retention by 40%** compared to silent reading alone.

**Target User:** Pre-med/undergrad students preparing for the MCAT (ages 18–25)  
**Primary Goal:** Help students retain MCAT material 40% better while studying 30% less through active, enjoyable sessions  
**Business Model:** Freemium (1 free session, then $5/month subscription)

---

## Product Vision

### Mission
To democratize high-performance MCAT preparation by making active learning accessible, engaging, and neuroscience-backed.

### Core Value Proposition
- ✅ **Karaoke-style reading:** Students read passages aloud; app provides real-time word-by-word highlighting
- ✅ **Instant MCQ feedback:** After each passage, adaptive quizzes test comprehension with personalized nudges
- ✅ **Gamified engagement:** Streaks, badges, leaderboards, and level progression keep users motivated
- ✅ **Session analytics:** Real-time metrics (accuracy, retention, study time) track progress
- ✅ **Frictionless onboarding:** Google OAuth signup + first free session = conversion in <2 minutes

### Success Criteria
- **User Acquisition:** 10K signups in Month 1 (organic + paid)
- **Conversion:** 30–40% free-to-paid conversion (within 1 week of first free session)
- **Retention:** 60% DAU / 40% MAU
- **Session Quality:** Avg session duration 25–45 min; 85%+ accuracy threshold

---

## User Personas

### Persona 1: The Ambitious Pre-Med (Primary)
- **Name:** Sarah, 22
- **Goal:** Score 520+ on MCAT; already strong in STEM
- **Pain Points:** Spends 15+ hours/week studying; retains ~50% of material; feels burned out
- **Motivation:** Wants to study smarter, not harder; loves competition
- **Behavior:** Uses Anki, Khan Academy; watches YouTube lectures; studies with friends
- **RETREIVE Appeal:** Gamified engagement + competitive leaderboard + retention proof

### Persona 2: The Busy Undergraduate (Secondary)
- **Name:** Marcus, 20
- **Goal:** Prepare for MCAT over next 6 months; currently part-time work
- **Pain Points:** Limited time; struggles with long reading passages; needs quick wins
- **Motivation:** Flexibility; wants to see progress fast
- **Behavior:** Studies in short bursts (20–30 min); prefers mobile apps; studies solo
- **RETREIVE Appeal:** Flexible session lengths + mobile-first + quick confidence boosts

### Persona 3: The Comprehensive Studier (Tertiary)
- **Name:** Jessica, 23
- **Goal:** Achieve 515+; wants all study tools in one place
- **Pain Points:** Juggling multiple apps (flashcards, QBank, study guides); wants cohesion
- **Motivation:** Efficiency; loves data/analytics
- **Behavior:** Tracks study metrics; uses Notion for organization; follows study schedules
- **RETREIVE Appeal:** All-in-one session analytics + progress tracking + study group features

---

## Core Features (14 Total)

### Learning Features (1–6)

**Feature 1: PDF Upload & Passage Auto-Parse**
- Upload MCAT PDFs (biology, chemistry, physics, psychology, etc.)
- Auto-segments PDFs into optimized passages (400–600 words)
- Supports up to 50 MB per file
- Drag-drop UI on dashboard
- Status: First-time free; unlimited after subscription

**Feature 2: Frictionless Multi-Method Signup**
- **Primary:** Google OAuth (single-tap, instant account)
- **Secondary:** Email + password
- **Tertiary:** Phone number + OTP verification
- Zero welcome wizard; instant dashboard entry
- Account auto-populated with profile data (Google) or optional manual entry

**Feature 3: Karaoke Reader (Core Learning Tool)**
- Real-time word-by-word highlighting as student reads aloud
- Microphone captures speech; Deepgram API transcribes in real-time
- Word-level timestamps for accuracy scoring
- Progress cylinder (visual indicator of passage completion %)
- Session timer; accuracy meter
- Passage navigation (prev/next, jump to specific passage)
- Support for 1.5x/2x playback speed (future)

**Feature 4: Transcription Accuracy Scoring**
- Real-time comparison of student's spoken words vs. passage text
- Flags misread/skipped words with visual indicators
- Calculates per-session accuracy % (target: 85%+)
- Tracks accuracy trends week-over-week
- Provides nudges for consistently mispronounced terms

**Feature 5: Adaptive MCQ Generator**
- After each passage, 1–2 context-aware MCQs based on passage content
- Deepgram + OpenAI API generates questions (future: fine-tuned model)
- Immediate feedback: correct ✅ (green celebration) / incorrect ❌ (nudge with explanation)
- Spaced repetition: weak questions re-appear in future sessions
- Tracks per-question accuracy over timsse

**Feature 6: Session Summary & Analytics**
- Post-session card displays:
  - Words read (total count)
  - Transcription accuracy %
  - MCQ performance (% correct, breakdown)
  - Session duration
  - Passages completed / total
  - Points earned toward level progression
  - Personal best records (if beaten)
- Data synced to Firestore in real-time
- Subscription prompt: "Subscribe to continue studying"

---

### Engagement Features (7–14)

**Feature 7: Streak Tracker**
- Prominent streak counter (🔥) on dashboard
- Increments by 1 per day if ≥1 session completed
- Resets after 24 hours of inactivity
- Countdown timer showing time until reset
- Push notification 2 hours before reset (future)
- Leaderboard bonus: +10 points per day streak maintained

**Feature 8: Level & XP System**
- Sstudents progres through levels (1–10 visible, infinite scaling)
- Points earned per session:
  - Base: +10 per passage completed
  - Accuracy bonus: +5 for 85%+ accuracy
  - MCQ bonus: +10 per correct MCQ
  - Streak bonus: +10 if streak ≥7 days
- 100 points = 1 level; level cap increases progressively (e.g., 100 → 250 → 500)
- Level up unlocks cosmetic badges (no gameplay changes)

**Feature 9: Badge System**
- Earned badges:
  - "Accuracy Ace" (95%+ accuracy in single session)
  - "Streak Master" (7/14/30 day streaks)
  - "Word Champion" (10,000+ words read lifetime)
  - "Quiz Legend" (10 consecutive correct MCQs)
  - "Level 5/10 Milestone" (level progression)
- 15+ total badges (customizable by admin)
- Badges displayed on profile + leaderboard (premium)
- Shareable achievement cards (social proof)

**Feature 10: Study Group (Private Leaderboards)**
- Students can create/join private study groups (up to 50 members)
- Group-specific weekly leaderboard (rank by points)
- Group challenges: "Read 50,000 words this week" → top 3 earn badges
- Private messaging with groupmates (future)
- Admin controls: set challenges, mute members, archive groups
- Status: Free in MVP; premium in Phase 2

**Feature 11: Weekly Leaderboard (Global)**
- Global top 100 ranking by weekly points
- Filters: All Users, Friends, Study Groups
- Ranked by:
  - Primary: Points (words + accuracy + MCQ)
  - Tiebreaker: Most recent session
- Top 3 medal display (🥇🥈🥉)
- User can see own rank + distance to next rank
- Resets every Sunday
- Motivation text: "You're X points away from [rank]!"

**Feature 12: Personal Dashboard**
- Real-time engagement metrics:
  - Streak (days alive)
  - Level + progress bar
  - Weekly word count
  - Session count this week
  - Accuracy trend chart (7-day avg)
- Quick actions: "Start Session", "Upload PDF", "View Leaderboard"
- Recent sessions list (resumable)
- Optional animated mascot character (toggleable)
- Notification badges (streak at risk, challenge progress, etc.)

**Feature 13: Session Celebrations & Milestones**
- Confetti animation on session complete
- Level-up modal (full-screen celebration)
- Personal record toast ("🏆 New PR! 94.2% accuracy")
- Badge earned notification
- Milestone card: "You've studied for 50 hours!"
- Share to social: copy achievement link to clipboard

**Feature 14: User Profile & Settings**
- Profile: Avatar, name, bio (optional), study goal (e.g., "Target: 520")
- Privacy settings: Profile visibility, leaderboard opt-out
- Study preferences: Session duration target, mascot on/off, notifications
- Account: Edit email/password, change subscription, delete account
- Study stats: Lifetime words read, sessions completed, accuracy all-time

---

## User Flows (3 Total)

### Flow A: Student Study Session (Engagement-Focused)

**Pre-Session:**
1. User logs in (Google OAuth, email, or phone OTP)
2. Dashboard loads with engagement metrics
3. User taps "Start Session" or selects a PDF from history
4. Upload flow (if new PDF): Drag-drop → Parse → Review passages → "Start Reading (FREE!)"

**During Session:**
5. Karaoke Reader screen loads (passage 1 of N)
6. User taps "Play" to start recording
7. Real-time word highlighting + transcription accuracy shown
8. User reads passage aloud; microphone captures speech
9. Session displays: timer, accuracy %, progress cylinder
10. User taps "Next Passage" after completing passage
11. MCQ modal appears (1–2 questions on passage content)
12. User selects answer → Immediate feedback (correct/incorrect with explanation)
13. User repeats steps 10–12 for remaining passages OR taps "End Session" to finish

**Post-Session:**
14. Session Summary screen displays: words read, accuracy %, MCQ score, time, points earned
15. Level-up modal (if applicable) or badge earned notification
16. Subscription prompt: "Subscribe to $5/month to continue" (if first free session just ended)
17. CTAs: "Resume Session", "Start New Session", "View Dashboard"
18. Dashboard updates: streak increments, level bar progresses, leaderboard refreshes

---

### Flow B: Dashboard Navigation & Engagement

1. User logs in → Dashboard loads
2. Engagement metrics visible: Streak 🔥, Level, Weekly words
3. Quick stats row: Accuracy PR, Session count, Study group preview
4. Badges section: Earned badges displayed (horizontal scroll)
5. Study group leaderboard preview: Top 3 + user's rank
6. Recent sessions: List of past PDFs (resumable or new)
7. User can:
   - Tap "Start Session" → Choose PDF or upload new
   - Tap "View Leaderboard" → Global weekly rankings
   - Tap "Upload New PDF" → File picker
   - Tap "View Badges" → Achievement gallery
   - Tap "Study Group" → Join/manage groups
   - Tap settings icon → Profile, preferences, logout
8. Dashboard auto-refreshes every 30 sec (leaderboard, streak timer)

---

### Flow C: Onboarding (Frictionless First-Time Experience)

**Target Time: <2 minutes from landing to first session**

1. Landing page loads (hero + "Speak Your Way to MCAT Mastery")
2. User taps "Sign in with Google" (15–20 sec OAuth redirect)
3. Google OAuth completes → Account auto-created, instant redirect to dashboard
4. Dashboard shows blank state: "Upload your study PDF to start your first free session!"
5. User drags/drops PDF or clicks upload → File parses (2–5 sec)
6. Passage preview modal shows segments
7. User taps "Start Reading (FREE!)" → Karaoke Reader loads immediately (no payment gate)
8. User reads first passage aloud → Real-time highlighting + accuracy scoring
9. MCQ appears after passage → User answers
10. Post-session summary → Subscription prompt: "Subscribe $5/month to continue" or "Maybe later" (free trial)
11. If "Maybe later": User can resume later, or retry free session (limited to 1 per day until paid)

**Fallback Auth Methods (if Google unavailable):**
- Email + password (expands below divider, inline form)
- Phone + OTP (2-stage: phone entry, OTP verification)
- Same post-auth flow as Google

---

## Monetization Strategy

### Pricing Model: Freemium

**Free Tier:**
- 1 free session per account (first use only)
- Upload unlimited PDFs (text stored locally)
- Access to karaoke reader during free session
- No MCQ feedback (MCQs disabled)
- No streak/level/leaderboard access
- No study group access
- Can retry free session once per 24 hours (limited)

**Paid Tier ($5/month):**
- Unlimited sessions
- Full MCQ feedback + adaptive generation
- Streak, levels, badges enabled
- Study group access + private leaderboards
- Session analytics + accuracy trends
- Ad-free experience
- Family plan: $8/month (3 accounts)
- Annual plan: $50/year (2-month savings)

### Conversion Strategy
1. **First-session free:** Low barrier to entry; user experiences full product
2. **Post-session prompt:** Gentle CTA after session ends: "Subscribe to continue studying"
3. **Streak/gamification:** Users invested in streaks → motivated to subscribe to maintain
4. **Social proof:** Friends' leaderboard progress visible only to paid users → FOMO
5. **Retention:** 1 free session per day (limited) keeps free users coming back, but paid unlimited

### Revenue Targets
- **Conversion rate:** 30–40% free → paid (within 1 week)
- **ARPU (Average Revenue Per User):** $3.50–$4.50/month
- **LTV:** $100–$150 (assuming 24-month average lifetime)
- **CAC:** <$30 (organic growth + referral incentives)

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS (dark theme: #0F0F0F, #1A1A1A; green accent: #00D97D)
- **Components:** Shadcn/ui (accessible base components)
- **Animations:** Framer Motion (word highlighting, transitions)
- **State Management:** Zustand or Jotai (session state, user data)
- **Form Handling:** React Hook Form + Zod (validation)
- **PDF Rendering:** pdf.js (client-side parsing)

### Backend
- **Hosting:** Vercel (serverless functions, auto-scaling)
- **Database:** Firebase Firestore (real-time sync, scalable)
- **Authentication:** Firebase Auth (Google OAuth, email, phone OTP via Firebase)
- **API Services:**
  - **Speech Recognition:** Deepgram WebSocket (real-time transcription, ephemeral tokens)
  - **MCQ Generation:** OpenAI API (GPT-4, future: fine-tuned model)
  - **Payment Processing:** Stripe (subscription management, webhooks)
  - **Email/Notifications:** SendGrid or Firebase Cloud Messaging

### Monitoring & Analytics
- **Analytics:** PostHog or Mixpanel (event tracking, funnels)
- **Error Tracking:** Sentry (bug detection, performance monitoring)
- **Logging:** Vercel logs + Firebase Cloud Logging

### DevOps
- **Version Control:** GitHub (Git workflow)
- **CI/CD:** GitHub Actions (auto-deploy on main push)
- **Environment:** Dev (local), Staging (Vercel preview), Production (vercel.app)

---

## Design Systems

### Dark Theme (Primary - Current)
- **Background:** #0F0F0F (charcoal)
- **Text:** #FFFFFF (white)
- **Accent:** #00D97D (bright green)
- **Surfaces:** #1A1A1A (elevated)
- **Borders:** #333333 (subtle)
- **Button Style:** Solid green, no outline
- **Typography:** Modern sans-serif (e.g., Inter, system fonts)
- **Aesthetic:** High-contrast, energetic, modern

### Light Theme (Alternative - Minimalist Health)
- **Background:** #FFFFFF (white)
- **Text:** #2D2D2D (charcoal)
- **Accent:** #00D97D (bright green)
- **Surfaces:** #FAFAFA (off-white)
- **Borders:** #EEEEEE (light gray)
- **Button Style:** Solid green, soft shadows
- **Typography:** Inter font (clinical, professional)
- **Aesthetic:** Clean, clinical, trustworthy, high-legibility

### Components
- **Buttons:** 48px height minimum (mobile accessible)
- **Inputs:** 1px borders, focus state green glow
- **Cards:** 1px borders, soft shadow on hover
- **Modals:** Full-screen overlay with soft background
- **Icons:** 24px × 24px, 1.5px stroke (thin)

---

## Marketing & Go-to-Market

### Pre-Launch (Month 0)
- [ ] Beta testing with 50 pre-med students
- [ ] Collect feedback on UX, MCQ quality, session timing
- [ ] Build waitlist (email opt-in)
- [ ] Social media assets (TikTok, Instagram, Reddit)

### Launch (Month 1)
- [ ] Soft launch via Reddit (r/MCAT, r/premed)
- [ ] Instagram/TikTok teaser videos ("Read aloud, remember more")
- [ ] Email to waitlist (10K+ early access)
- [ ] Paid ads (Google, Meta) targeting "MCAT study" keywords
- [ ] Target: 10K signups

### Scale (Months 2–6)
- [ ] Referral program (refer a friend, both get 1 free month)
- [ ] YouTube partnerships (MCAT prep creators)
- [ ] PR outreach (EdTech publications, pre-med forums)
- [ ] In-app referral incentives
- [ ] Target: 50K+ total users

### Positioning
- **Primary message:** "Study MCAT 30% smarter with scientifically-backed active learning"
- **Secondary:** "Join 50K+ students crushing the MCAT with karaoke-style study sessions"
- **Tertiary:** "Free first session. See your accuracy improve instantly."

---

## Success Metrics & KPIs

### User Acquisition
- **DAU (Daily Active Users):** 1K (Month 1) → 5K (Month 3) → 10K (Month 6)
- **Monthly Signups:** 10K (Month 1) → 15K (Month 2) → 10K organic (steady state)
- **Signup Source:** Organic 40%, Paid ads 35%, Referral 15%, Partnerships 10%

### Conversion & Monetization
- **Free-to-Paid Conversion Rate:** 30–40% within 7 days
- **ARPU:** $3.50–$4.50/month
- **Churn Rate:** <8% monthly (target 5–6%)
- **LTV/CAC Ratio:** >3:1 (target 5:1)

### Engagement
- **Session Duration:** Avg 25–45 min
- **Sessions/User/Week:** 3–5 (paid users); 0.5 (free)
- **Accuracy Target:** 85%+ average across users
- **Retention:**
  - Day 1: 80%
  - Day 7: 50%
  - Day 30: 40%

### Content Quality
- **Passage Parse Accuracy:** 99%+ (no text corruption)
- **MCQ Relevance Score:** 4.2/5 (user feedback)
- **Session Completion Rate:** 85% (users finish sessions, not abandon mid-way)

### Product Health
- **Session Load Time:** <2 sec (Deepgram latency <200ms)
- **App Crash Rate:** <0.1%
- **API Uptime:** 99.9%
- **Support Response Time:** <4 hours (email)

---

## Roadmap

### Phase 1 (MVP - Months 0–2)
**Focus:** Launch core product, validate freemium model
- ✅ Karaoke reader with real-time highlighting
- ✅ Transcription accuracy scoring
- ✅ Adaptive MCQ generation
- ✅ Streak + level system
- ✅ Global leaderboard
- ✅ Multi-method signup (Google, email, phone)
- ✅ Stripe subscription management
- ✅ Session analytics
- [ ] Email notifications (streak at risk, new friend activity)

**Success Criteria:**
- 10K signups
- 35% free-to-paid conversion
- 50% Day 7 retention
- 4.0+ App Store rating (if mobile)

### Phase 2 (Polish & Growth - Months 3–5)
**Focus:** Improve retention, expand features, scale acquisition
- [ ] Spaced repetition for MCQs (re-serve weak questions)
- [ ] Study group messaging + challenges
- [ ] Referral program incentives
- [ ] In-app analytics dashboard (cohort insights, trending topics)
- [ ] Family plan ($8/month, 3 accounts)
- [ ] Android native app (React Native or Flutter)
- [ ] Push notifications (streak countdowns, new friend activity, challenges)
- [ ] Admin dashboard (moderation, analytics, feature flags)

**Success Criteria:**
- 50K+ total users
- 40% free-to-paid conversion
- 60% Day 7 retention
- CAC <$30

### Phase 3 (Monetization & Scale - Months 6–12)
**Focus:** Additional revenue streams, institutional partnerships
- [ ] Tutoring marketplace (connect students with tutors)
- [ ] Premium content (official AAMC practice tests, partner content)
- [ ] B2B: University licenses (bulk student access)
- [ ] AI tutor chatbot (personalized study recommendations)
- [ ] Video explanations for difficult passages (YouTube-style)
- [ ] Personalization: ML-driven passage recommendations
- [ ] International expansion (MCAT prep in Canada, UK medical exams)

**Success Criteria:**
- 200K+ total users
- 5K+ paid subscribers
- $50K+ MRR
- 35% churn rate
- Multiple revenue streams >10% each

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Low free-to-paid conversion | Medium | High | A/B test subscription prompt timing; offer limited free sessions per week |
| High churn after free trial | High | High | Focus on engagement (streaks, badges, social); improve MCQ quality |
| Deepgram API costs scale faster than revenue | Medium | Medium | Build in-house speech recognition; optimize Deepgram caching |
| User acquisition too expensive | Medium | High | Prioritize organic (Reddit, TikTok); referral incentives; partner with YouTubers |
| MCQ quality poor (low relevance) | Low | High | Fine-tune LLM on MCAT data; hire MCAT experts for QA |
| Competitor launches similar product | High | Medium | Focus on community (leaderboards) + UX polish; build moats (study groups, family plans) |
| Firebase Firestore costs exceed budget | Low | Medium | Optimize query patterns; batch operations; consider PostgreSQL migration |

---

## Competitive Analysis

### Direct Competitors
- **Khan Academy (MCAT):** Free; passive video-based; no gamification; low engagement
- **Kaplan/Princeton Review:** Expensive ($1–3K); comprehensive but dated UX; includes tutoring
- **AAMC:** Official practice tests; gold-standard content; weak UX; no engagement features

### Competitive Advantages
- ✅ **Only active learning (speech-based) MCAT app**
- ✅ **Gamification + social engagement** (streaks, leaderboards, badges)
- ✅ **Real-time feedback** (accuracy scoring, MCQ explanations)
- ✅ **Freemium model** (lower barrier to entry than Kaplan)
- ✅ **Mobile-first design** (study on-the-go)
- ✅ **Neuroscience-backed** (40% retention improvement claim)

### Differentiation
- Primary: Active learning (karaoke-style)
- Secondary: Engagement gamification + social
- Tertiary: Freemium pricing + mobile-first

---

## Team & Roles

**Phase 1 (MVP) - Lean Team (4–6 people)**
- **Founder/Product:** Product vision, roadmap, user research
- **Backend Lead:** Firebase, Deepgram integration, Stripe, APIs
- **Frontend Lead:** Next.js, React, UI/UX implementation
- **Full-Stack Eng:** Support frontend + backend, DevOps
- **QA/Content:** Testing, MCAT content validation, MCQ review
- **Growth/Marketing:** User acquisition, social media, analytics

**Phase 2+ - Expanded Team**
- Add: ML Engineer (spaced repetition, personalization), Mobile Eng (Android), Support/Customer Success

---

## Appendix: Glossary

- **Karaoke Reader:** Core feature where students read passages aloud while app highlights words in real-time
- **Transcription Accuracy:** % of words spoken correctly (matched to passage text)
- **Streak:** Consecutive days with ≥1 session completed
- **MCQ:** Multiple-choice question generated from passage content
- **Spaced Repetition:** Algorithm that surfaces weak questions at optimal intervals
- **Freemium:** Free tier + paid subscription model
- **ARPU:** Average Revenue Per User (monthly)
- **LTV:** Lifetime Value (total revenue from single user over lifetime)
- **CAC:** Customer Acquisition Cost (total marketing spend / new users acquired)
- **DAU:** Daily Active Users
- **Churn:** % of paid users who cancel subscription monthly

---

**End of Product Brief**

*For detailed specifications, see:*
- *Feature specs: `/RETREIVE_PRD_v1.0.md`*
- *Screen designs (dark): `/SCREEN_GENERATION_PROMPT.md`*
- *Screen designs (light): `/SCREEN_GENERATION_PROMPT_LIGHT_THEME.md`*
- *Integration summaries: `/ENGAGEMENT_INTEGRATION_*.md`*
