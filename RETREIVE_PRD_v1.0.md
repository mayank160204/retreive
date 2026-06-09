# RETREIVE — Product Requirements Document

**Document Header**

| Field | Value |
|-------|-------|
| Project Name | RETREIVE |
| Version | 1.0 |
| Date | 27 May 2026 |
| Author | Principal Product Manager & Senior Software Architect |

---

## Executive Summary

**Overview of the product vision and goals**

RETREIVE is a focused web application that helps MCAT retakers improve retention by reading study PDFs aloud in a "karaoke" mode. The app tracks spoken words in real time, highlights text word-by-word as students speak, and enforces progress only while actively speaking. After each passage, MCQ questions pop up to test retention. Simple analytics at session end show reading progress and quiz performance.

**Key differentiators:**
- Real-time speech-to-text highlighting with word-level precision.
- Progress tied directly to active speech (no passive scrolling).
- Guaranteed per-passage persistence — users resume exactly where they left off.
- Low friction: $5/month subscription, free first PDF upload on signup.

**Vision:** Increase active recall and retention for MCAT retakers by combining auditory learning, immediate visual feedback, spaced-retrieval quizzing, and reliable session recovery.

**Primary goals:**
1. Enable fast frictionless onboarding: free signup, upload PDF, then pay $5/month to unlock reading.
2. Deliver robust real-time speech-to-text highlighting synchronized with study text.
3. Guarantee per-passage persistence and session recovery.
4. Provide clear retention feedback via MCQs and basic session analytics.

---

## Terminology Clarification: Passage vs. Paragraph

**Recommended terminology for RETREIVE: Use "Passage" as the primary unit.**

| Term | Definition | MCAT Context | Use in RETREIVE |
|------|------------|--------------|-----------------|
| **Passage** | A longer section of text (typically 200–400 words), a self-contained unit with one or more topics. Natural MCAT unit. | MCAT Reading Comprehension: one passage = one question set. | ✅ Primary unit. MCQ questions follow each passage. |
| **Paragraph** | A smaller text block (50–150 words), logical subdivision within a passage. | MCAT Passage is subdivided into paragraphs. | Secondary: used internally for highlighting granularity and persistence. |

**Implementation:**
- **Passage:** Top-level document organization. Each passage is a discrete reading unit with associated MCQs (3–4 questions per passage).
- **Paragraphs (internal):** For UX and persistence, divide each passage into smaller chunks (typically 2–5 paragraphs per passage) to trigger more frequent saves and provide intermediate progress checkpoints. This improves perceived responsiveness and minimizes data loss on network interruption.

---

## Objectives & Success Metrics

**Business goals and KPIs**

**Business goals:**
1. Establish recurring $5/month subscription revenue stream with freemium model: first read free, then convert.
2. Drive fast conversion: free signup, immediate value (PDF upload + first free read), then convert after trial.
3. Reduce signup friction; capture users before payment, give them taste of value, then monetize on subscription.
4. Improve retention and learning outcomes for paying subscribers.
5. Build cohort of engaged MCAT retakers as product advocates.

**Primary KPIs:**
- **Signup rate:** % of visitors completing free signup (target: 20%+ first cohort; low friction, no payment barrier).
- **PDF upload rate:** % of signups who upload PDF (target: 60%+; strong value signal).
- **Payment conversion from free trial:** % of users completing first session then subscribing to $5/month (target: 30–40%; monetize engaged users post-trial).
- **Monthly active users (MAU) / Subscription renewal:** % renewing $5 subscription monthly (target: 50%+ retention by month 3; higher engagement due to upload before payment).
- **Time-to-first-session:** median time from signup to beginning first read (target: < 5 minutes including upload only; no payment gate).
- **Session completion:** % sessions completing at least one full passage (target: > 75%).

**Persistence & reliability KPIs:**
- **Per-passage Firestore write success rate:** 99.9% (critical requirement).
- **Speech recognition accuracy:** average confidence score across sessions (baseline metric for Q2 optimization).
- **Word-highlight latency:** median < 250 ms (P99 < 500 ms).

**Learning outcome KPIs:**
- **MCQ accuracy:** average % correct across all sessions (expected baseline 60–70%; improvement tracked over repeated sessions).
- **Engagement depth:** average passages read per session, repeat session frequency.

---

## User Personas

**Detailed user profiles**

### Persona A: "Re-taker Rebecca" (Primary)
- **Demographics:** 24–30, US/Canada, completed one or two prior MCAt attempts, preparing for retake.
- **Frustration:** Prior attempts underperformed; looking for differentiated study method.
- **Needs:** Efficient active study (30–90 min blocks), low-cost tools, ability to import own study notes/PDFs, accountability + streak motivation, visible progression.
- **Tech comfort:** Moderate; comfortable with web apps, mobile browsing.
- **Behaviors:** Studies during commute or evening block study; values quick session setup and meaningful feedback. Fears losing progress; motivated by visible streaks and level progression.
- **Goals:** Improve verbalization and conceptual recall; reliably track progress; maintain study consistency via streaks and levels.
- **Motivation:** Medical school admission; willing to pay $5/month for demonstrably better retention. Responds to loss aversion (streak freeze mechanic) and long-term progression (reading levels).

### Persona B: "Last-Minute Leo"
- **Demographics:** 22–25, shorter prep timeline, aggressive study frequency.
- **Frustration:** Limited time; wants maximum ROI on study effort. Wants to feel like he's winning, not just grinding.
- **Needs:** Minimal friction, immediate feedback, ability to cram efficiently. Weekly competitive challenges to stay motivated.
- **Behavior:** High repetition, short intense sessions, possibly noisy environments. Highly competitive; motivated by micro-competitions with peers.
- **Tech comfort:** High; native to web/app-based tools.
- **Goals:** Quick confidence boost; measurable improvement in a compressed timeframe. Win this week's challenge vs. study group.

### Persona C: "Structured Sonia"
- **Demographics:** 26–32, methodical long-term prep, values data. Works with a tutor.
- **Frustration:** Wants to know exactly what's working; distrusts vague "better retention" claims. Wants external validation of progress.
- **Needs:** Reliable saves across devices, accurate word-level tracking, clear MCQ feedback with nudges explaining why answers are correct. Visible personal records (PRs), reading level progression, tutor visibility.
- **Tech comfort:** High; data-driven decision maker.
- **Goals:** Optimize study strategy; track measurable improvement over weeks. Have tutor see progress and provide feedback. Unlock higher levels and skill badges through consistent study.

### Accessibility considerations
- Large readable fonts (18pt+ for karaoke text), high contrast (white text on dark background).
- Keyboard navigation for core flows (play/pause, next passage, answer selection).
- ARIA labels on MCQ options and interactive elements for screen-reader support.
- Caption/transcript option for speech-recognition edge cases (future).

---

## Features & Requirements

### Core Features (Prioritized: Must-have, Should-have, Could-have)

#### Must-have

1. **Landing page + opening science cards**
   - 10 rotating cards explaining the neuroscience and psychology of reading aloud as a study technique.
   - Sample topics: "Speaking engages 3 brain regions simultaneously (visual, motor, auditory)," "Hearing your own voice strengthens memory encoding," "Active vocalization increases retention by 40% vs silent reading," etc.
   - Dark background, bold uppercase title, body text, centered cosmic emoji at bottom.
   - Tap anywhere to skip; no repeats until all 10 shown.
   - Cards reinforce product value proposition during onboarding.

2. **Signup flow (free, no payment required, Google Auth)**
   - **Frictionless single-tap Google OAuth signup:** "Sign in with Google" button on landing.
   - User taps → redirects to Google sign-in → redirects back to app → account created instantly.
   - No passwords, emails forms, or verification steps (zero friction).
   - Account created immediately; user lands directly on dashboard (skip welcome screens if desired).
   - No payment at signup — user can explore the app, upload PDF for free.
   - Dashboard shows: reading streak (🔥), reading level, recent sessions.

3. **Reading Streak + Loss Aversion Mechanic**
   - Track **Reading Streak:** "You've read 7 days in a row" (visible on dashboard + session start).
   - UI: Large streak counter badge (e.g., "🔥 12 days") prominently displayed in header.
   - Logic: +1 if user reads ≥100 words in a session that day; resets to 0 if user misses a day.
   - Countdown timer: "Streak resets in 18 hours" (creates urgency to maintain streak).
   - **Streak Freeze system:** Allow 2 "free" streak freezes per month (purchased for $0.99 if needed to save streak).
   - Psychological effect: Loss aversion activation drives continued engagement and optional monetization (freeze purchase).
   - Milestone celebration: "🔥 On fire! 7-day streak unlocked" (toast + animation on reaching 7+ day milestone).

4. **Reading Level Progression (Infinite, No Cap)**
   - Track **cumulative words read across all time** (never resets, infinite progression).
   - Create **Reading Level tiers:**
     - Level 1: 0–5k words ("Novice Reader")
     - Level 2: 5k–20k words ("Emerging Scholar")
     - Level 3: 20k–50k words ("Proficient Reader")
     - Level 4: 50k–100k words ("Advanced Analyst")
     - Level 5: 100k+ words ("Master Comprehensionist")
     - Level 6: 250k+ words ("Elite Strategist")
   - UI: Large progress bar on dashboard showing "45% to Level 4"; level icon on session start.
   - End-of-session toast: "You've read 2,144 words! (+45 to next level)."
   - Optional cosmetics: Unlock app themes or avatar skins at each level (free; builds attachment).
   - Psychology: Infinite game mechanic with no end state; compounding value drives long-term engagement.

5. **Personal Records (PRs) + Competence-Based Achievements**
   - Track user PRs: Highest single-session word count, highest accuracy %, longest session, fastest reading speed (words/min), consecutive MCQ correct answers.
   - Milestone badges (competence-based, not usage-based):
     - "Laser Focus" — Read 1,000+ words without pause
     - "Accuracy Expert" — 90%+ transcription accuracy for 5 consecutive sessions
     - "Speed Reader" — Average 50+ words/min across 3 sessions
     - "Quiz Master" — 90%+ MCQ accuracy for 1 week
     - "Consistency Pro" — 30-day reading streak
     - "Brain Athlete" — Improved MCQ accuracy by 15% week-over-week
   - Display badges on user profile + session summary.
   - Psychology: Rewards actual skill improvement (competence), not app usage.

6. **PDF upload (free, first read free)**
   - User navigates to Upload screen after signup (free, no subscription required).
   - User uploads PDF (drag-drop or file picker).
   - PDF parses successfully.
   - **No payment gate:** User proceeds directly to karaoke reader (first session completely free).
   - Firebase Storage manages uploaded PDFs.
   - Firestore tracks: `users/{userId}.firstSessionCompleted = false` (initially).

6. **PDF upload, parsing, and text extraction**
   - Drag-and-drop or file picker UI.
   - Client-side parsing via pdf.js with paragraph segmentation.
   - Text cleaning (whitespace, formatting).
   - User preview of parsed passages and optional paragraph break editing.

7. **Karaoke reading mode (core complex feature)**
   - Display current passage in large readable text (18pt+, dark background, white text).
   - Real-time speech recognition via Deepgram (word-level timestamps).
   - Word-by-word text highlighting synchronized with speech transcription with micro-interactions (sparkle particles, smooth glow).
   - **Progress tied to active speech:** Vertical green progress cylinder drains only when words are recognized; pauses on silence.
   - Automatic paragraph completion detection (when ~85% of words matched) or manual "Next" button.
   - Smooth CSS animations for highlight and progress.

8. **Per-passage persistence (CRITICAL)**
   - **Every paragraph completion triggers immediate Firestore write** (non-negotiable).
   - Write includes: current passage index, words read, accuracy, paragraphsCompleted array.
   - Transactional writes to avoid race conditions.
   - Automatic retry on transient failures; client-side queue for offline backfill.
   - On session resume (page reload), read last saved state from Firestore and resume at first incomplete passage.

9. **MCQ modal flow with engagement polish**
   - **Optimal number: 3–4 MCQs per passage** (balances retention testing without overwhelming user; aligns with MCAT format).
   - Modal overlay after each passage is completed.
   - Each MCQ shows: question, 4–5 options, selection mechanism.
   - **Correct answer:** Full-screen green background, show selected answer highlighted green, display correct nudge (explanation of why correct).
   - **Celebration feedback:** Confetti burst animation + celebration text ("Excellent reasoning!" or "Spot on!", randomized).
   - **Incorrect answer:** Full-screen white background, show correct answer highlighted, display wrong nudge (explanation of why incorrect).
   - **Micro-interaction polish:** Thoughtful character animation (optional, opt-in study companion reacts to answers).
   - Tap/click anywhere to continue to next passage.
   - MCQ responses persisted to Firestore immediately.

10. **Session summary analytics + engagement UI + subscription prompt (first session)**
    - At session end, display engaging summary card:
      - Total words read with level progress: "2,144 words read! (+45 to Level 4)"
      - Overall transcription accuracy (%) with PR notification if new personal best
      - Time spent
      - Passages completed / total
      - MCQ average accuracy (%) with skill badges if thresholds hit
      - Streak status: "🔥 12-day streak! Streak resets in 18 hours"
    - Celebratory toast with smooth animation: "🎉 Amazing session!"
    - **If first session:** Show subscription prompt: "Love it? Subscribe to $5/month for unlimited reading + track your progress forever." [CTA: "Subscribe now" or "Maybe later"].
    - **If subscribed:** CTA buttons: "Resume session" or "Start new session".
    - **If not subscribed after first session:** Show gentle reminder on dashboard: "You've completed 1 free session. Subscribe to keep reading!" [CTA: "Subscribe"].

11. **Engagement mechanics: Streaks, levels, and personal records**
    - **Daily Streak system:**
      - Displayed on dashboard as "🔥 N-day streak".
      - Streak persists if user completes ≥1 session daily within UTC day boundary.
      - Streak resets if user misses a day. Warning toast when streak at risk (e.g., "Your streak resets in 2 hours!").
      - High performers earn **milestone badges** at streaks: 7, 30, 100 days.
    - **Reading Level progression:**
      - User starts at Level 1 (0/100 points).
      - Each word read = +1 point; bonus +5 if transcription accuracy ≥90%.
      - Level up at 100 points → Level 2 (0/150 points), then +50 every level up to 500pts max.
      - Display on dashboard: "Level 4 | 67/250 points" with visual progress bar.
      - Level-up animation: screen glow + "✨ Level 5!" banner.
    - **Personal Records (PRs):**
      - Track: highest transcription accuracy, highest MCQ accuracy, longest session duration, most words read in one session.
      - Persistent display on dashboard with comparison to last session.
      - Notification on PR break: "🏆 New PR! Transcription accuracy: 94.2% (+2.1%)"
      - Archive of 5 most recent PRs in dedicated view.
    - **Variable reward magnitude:**
      - Base streak reward: +5 points at daily session completion.
      - Accuracy bonus: +5 points if accuracy ≥90%; +10 if ≥95%; +15 if ≥98%.
      - MCQ bonus: +10 points if MCQ accuracy ≥80% for session.
      - Streak multiplier: +1 bonus point per 7-day streak (e.g., 3x at 21-day streak).

12. **Micro-competitions & social engagement**
    - **Study Group Leaderboard:**
      - Weekly leaderboard showing top 5 members by points earned that week (streak bonus + accuracy bonus + MCQ bonus).
      - Tied ranks shown as "T-1", "T-2".
      - Leaderboard resets weekly; historical rankings archived (accessible view).
      - Motivation text: "You're 45 points away from 1st place! Keep up the daily sessions!" (if user not first).
    - **Weekly Challenge (Phase 2):**
      - Community challenges: "Read 5,000 words this week" or "Achieve 90%+ accuracy on all sessions".
      - Leaderboard of users who completed challenge.
      - Badge awarded upon challenge completion (e.g., "⚡ Accuracy Master").

13. **Micro-interactions & emotional design**
    - **Visual micro-animations:**
      - Word highlight in karaoke mode: smooth 100ms fade-in/out with particle sparkles (CSS).
      - Progress cylinder: smooth drain animation synced to recognized words.
      - Level-up: full-screen glow, banner slide-in, celebratory sound (optional, user can mute).
      - Correct MCQ: green full-screen flash, confetti burst from screen center.
      - Incorrect MCQ: gentle white flash, supportive nudge text slide-in.
    - **Haptic feedback (mobile):**
      - Light pulse on each word recognized (via Vibration API).
      - Stronger pulse on correct MCQ; softer double-pulse on incorrect.
    - **Optional Study Companion Character (opt-in):**
      - Small animated character (e.g., fox, robot) appears on dashboard.
      - Reacts to user behavior: thumbs up on accuracy ≥90%, encouraging nod during streak warning, celebrates on level-up.
      - Character can be toggled off in settings (default off for conservative users).
      - Character state persists (e.g., "Happy" if on streak, "Curious" if user hasn't logged in 2+ days).

14. **Settings & personalization**
    - **Theme toggle:** Light/dark mode (default: dark mode for reading).
    - **Text size:** Adjustable font size for karaoke (16pt–24pt default 18pt).
    - **Accessibility:**
      - High-contrast mode.
      - Closed captions for MCQ explanations (opt-in).
      - Keyboard navigation support (Tab through MCQ options, Enter to select).
    - **Engagement settings:**
      - Disable character animation (toggle).
      - Disable celebratory sounds (toggle).
      - Disable streak notifications (toggle, but keep streak tracking).
    - **Account:**
      - Logout.
      - Delete account (data deletion within 30 days).

#### Session Summary & Core Analytics (Built-in)
   - At session end, display simple card:
     - Total words read
     - Overall transcription accuracy (%)
     - Time spent
     - Passages completed
     - MCQ average accuracy (%)
   - CTA to resume session or start new session.

9. **Secure API key handling**
   - Deepgram API key: serverless endpoint generates ephemeral tokens; client never sees permanent key.
   - Stripe secret key: server-side only; never committed to repo.
   - Firebase credentials managed via environment variables.
   - All sensitive data handled by Vercel/Firebase, not in version control.

10. **Responsive UI (desktop + mobile browsers)**
    - Optimized layouts for 375px (mobile) to 1920px (desktop).
    - Touch-friendly targets for mobile; keyboard-navigable for desktop.
    - Audio input from device microphone (mobile + desktop).

#### Should-have

1. **Retry/backfill logic for transient failures**
   - Client-side queue of pending Firestore writes.
   - Exponential backoff for retries.
   - Automatic flush on reconnect; user-facing toast for transient errors.

2. **Advanced speech/text matching**
   - Normalization: lowercase, punctuation strip, contraction handling.
   - Fallback highlighting when exact match fails (closest token match).

3. **Smooth animations**
   - Progress cylinder drains smoothly with easing function.
   - Word highlight transitions (fade or underline animations).

4. **Noise filtering / microphone-level indicator**
   - Visual feedback on microphone input level.
   - Optional noise suppression toggle (for noisy environments).

5. **Server-side logging**
   - Log all Firestore write failures, Deepgram errors, payment webhook failures.
   - Integrate with Sentry for frontend error tracking.

#### Could-have (post-MVP, Phase 1+)

1. **User settings**
   - Font size adjustment, speech sensitivity, dark/light mode toggle.
   - Notification preferences for monthly renewal reminders.

2. **Export / sharing**
   - Export session summary as PDF or CSV.
   - Share performance report with tutor or study group (privacy-controlled).

3. **Audio recording (opt-in)**
   - Store recorded session audio for self-review (user consent required).
   - GDPR/privacy compliance for audio storage.

4. **Advanced analytics**
   - Session history, performance trends, weak topics.
   - Comparative analytics (vs. previous attempts, vs. peers anonymously).

5. **Multi-language support**
   - Internationalization (i18n) for UI; multilingual MCQ content.

---

### High-Level User Flows (By User Type)

#### Onboarding Flow: Frictionless First-Time Experience
**Goal:** Get user from landing page to first free read in <2 minutes (zero friction).

1. **Landing Page:** 
   - Hero image of student reading aloud with confetti/celebration.
   - Headline: "Speak Your Way to MCAT Mastery"
   - Subheading: "Read aloud, remember more. Free first session."
   - Single CTA button: "Sign in with Google" (blue, large, bottom center).
   - Science cards carousel (10 rotating cards explaining learning benefits, auto-play with skip option).

2. **Google OAuth Sign-In:**
   - User taps "Sign in with Google" → Single-tap OAuth redirect.
   - No email form, no password field, no verification email.
   - Instant redirect back to app → User profile auto-populated (name, avatar from Google).
   - **Total time: 15–20 seconds.**

3. **Instant Dashboard:**
   - User lands on dashboard immediately post-signup (no welcome wizard, no form-filling).
   - Dashboard shows: blank state with "🚀 Ready to start? Upload your first PDF!" [CTA: "Upload PDF"].
   - Engagement metrics default: Streak 0, Level 1 (0 pts), no sessions.
   - Optional: Character greets user ("Hey there! Ready to study?") — can be dismissed.

4. **PDF Upload (Frictionless):**
   - Drag-and-drop area: "Drop your MCAT PDF here" or "Choose file".
   - Upload + auto-parsing (2–5 seconds for most PDFs).
   - Preview shown: "Your PDF has 5 passages. Ready to read?"
   - [CTA: "Start reading" or "Edit passages first"].

5. **First Free Session Starts:**
   - No payment modal (completely free).
   - Karaoke reader loads immediately.
   - User reads aloud → real-time word highlighting, progress cylinder, MCQ feedback.
   - **Total signup-to-reading: <2 minutes.**

6. **End of First Session:**
   - Engaging summary card (words, accuracy, level progress, streak started).
   - **Subscription prompt:** "Love it? Subscribe to $5/month to read more + keep your progress forever."
   - [CTA: "Subscribe now" or "Maybe later" → user can still see dashboard, streak starts ticking].

**Key UX Principles for Onboarding:**
- ✅ **One-tap signup (Google OAuth):** Zero friction; no password/email hell.
- ✅ **No welcome forms/wizards:** Land on functional dashboard immediately.
- ✅ **Instant first session:** Upload PDF → read in seconds; no paywalls.
- ✅ **Show value before asking for money:** Users experience benefit first; conversion happens post-trial.
- ✅ **Minimal optional elements:** Character, settings all toggleable; don't force configuration.

---

#### User Flow A: Student Study Session (Engagement-Focused)
1. **Dashboard Entry:** Student logs in → Dashboard shows engagement metrics (🔥 12-day streak, Level 4 | 67/250 pts, PR: 94.2% accuracy).
   - Optional character animation reacts to streak status (thumbs up if good streak, encouraging if risk).
   - Dashboard displays leaderboard rank, badges earned, recent sessions.
2. **Session Initiation:** Student taps "Start session" → Selects to start solo session.
3. **PDF Selection:** Student uploads new PDF or selects pre-uploaded file. Parsing and preview shown.
4. **Karaoke Reading (No payment gate on first read):**
   - Passage displayed in large text (18pt+).
   - Student reads aloud; speech recognized word-by-word in real time.
   - Progress cylinder animates (drains) as words matched.
   - Word highlights sync smoothly with speech recognition (particle sparkles on each highlight, smooth fade-in/out).
   - **Micro-interactions:** Light haptic feedback on word recognition (mobile), character optional reaction to recognition streak.
5. **Passage Completion:** ~85% words matched or user clicks "Next" → Immediate Firestore write persists progress.
6. **MCQ Modal:** 3–4 MCQs per passage appear.
   - Student selects answer → Celebration feedback (green full-screen + confetti + character celebratory reaction if enabled).
   - Incorrect answer → White full-screen + gentle nudge explanation + supportive character reaction (if enabled).
7. **Session End:** Session ends (user exits or all passages complete).
   - **Engaging summary card:**
     - "2,144 words read! (+45 to Level 4)" [animated progress bar fill].
     - "Overall accuracy: 92.3% 🏆 New PR! (+2.1%)" [toast notification].
     - "Time spent: 34 minutes | Passages: 5/5 | MCQ accuracy: 86%".
     - "🔥 12-day streak! Resets in 18 hours." [with countdown timer].
     - "You earned the badge: 'Accuracy Ace (95%+)'" [if applicable].
     - Leaderboard snippet: "You're ranked #2 this week! 45 pts away from #1." [CTA: "View full leaderboard"].
     - Celebratory sound (optional, can be muted in settings).
     - **⭐ If first session:** Subscription prompt: "Love it? Subscribe to $5/month for unlimited reading + track your progress forever." [CTA: "Subscribe now" or "Maybe later"].
   - **Level-up animation** (if applicable): Full-screen glow, banner "✨ Level 5!" with confetti burst, character celebratory dance.
8. **Post-Session Navigation:** 
   - **If not subscribed (after first session):** Dashboard shows "You've completed 1 free session. Subscribe to keep reading!" [CTA: "Subscribe"].
   - **If subscribed:** Buttons: "Resume session" or "Start new session" or "View leaderboard".

#### User Flow B: Dashboard & Engagement Mechanics
1. **Streak Management:**
   - Dashboard displays prominent "🔥 12-day streak" badge.
   - If streak at risk (< 2 hours to day boundary and no session today): Toast "⏰ Your 12-day streak resets in 1 hour! Start a quick session now." [Dismiss or "Start session" CTA].
   - Streak resets on day boundary if no session completed.
2. **Level Progression & PRs:**
   - Dashboard shows "Level 4 | 67/250 pts" with animated progress bar.
   - Clicking shows: "You're 183 pts away from Level 5! Keep up the daily sessions."
   - PR section: "Personal Records: Accuracy 94.2%, MCQ Accuracy 88%, Words in 1 session 3,200".
   - Clicking "PRs" opens modal with 5 most recent PRs (ranked, dated, compared to prior).
3. **Badges & Achievements:**
   - Earned badges displayed as small icons on dashboard (e.g., "Level 5", "Streak Master (30 days)", "Accuracy Ace (95%+)").
   - Clicking badge shows when earned, option to share: "Share achievement" → Copies text like "I earned 'Accuracy Ace' badge on RetrieveRx! Can you beat 95%+ accuracy?" (shareable to clipboard or social).
4. **Study Group Leaderboard:**
   - Dashboard shows group name and member count.
   - Tapping "View leaderboard" → Weekly leaderboard with top 5 members (ranked by points).
   - Each member shows: rank, name, points earned this week, streak, level.
   - User's rank shown with motivation message (e.g., "You're 45 points away from #1! Complete 2 more sessions to catch up.").
   - Leaderboard resets weekly; historical rankings archived.
5. **Character Interaction (Optional):**
   - Small animated character in corner (e.g., fox, robot) reacts to dashboard state.
   - On good streak: thumbs up, smile.
   - On streak risk: concerned expression, pointing at timer.
   - On new level: celebratory dance, confetti.
   - User can toggle character on/off in settings (default: off for conservative users).

#### User Flow C: Engagement Mechanics Deep Dive

**Streak Mechanics:**
- Definition: User completes ≥100 words read in a single session per UTC day.
- Visual: "🔥 12-day streak" badge on dashboard, header of every page.
- Countdown timer: "Resets in 18 hours" shown below streak badge.
- **Streak Freeze (opt-in monetization):**
  - User gets 2 free freezes per month.
  - If streak at risk (< 2 hours to day boundary) and user hasn't completed session:
    - Toast: "⏰ Your 12-day streak resets in 1 hour! Tap to freeze or start a session." [Freeze button or Dismiss].
    - Tapping "Freeze" uses one free freeze; resets countdown to 24 hours.
    - If out of free freezes: "Freeze for $0.99?" modal.
  - After day boundary, streak resets to 0 (or freezes if freeze applied).

**Reading Level Progression:**
- User starts Level 1 (0/100 pts).
- Points earned: +1 per word read; +5 bonus if session accuracy ≥90%; +10 if accuracy ≥95%; +15 if accuracy ≥98%.
- Additional bonuses: +5 base per daily session; +1 per 7-day streak (e.g., 3x multiplier at 21-day streak).
- MCQ bonus: +10 if session MCQ accuracy ≥80%.
- Level-up thresholds: 100, 150, 200, ... up to 500 max per level.
- **Level-up animation:** Full-screen glow, banner "✨ Level 5!", confetti burst, celebratory sound (optional).
- Display on dashboard: "Level 4 | 67/250 pts" with progress bar and motivational text ("183 pts to Level 5!").

**Personal Records (PRs):**
- Tracked metrics: highest transcription accuracy, highest MCQ accuracy, longest session duration, most words read in one session.
- **PR display on dashboard:** "Personal Records: Accuracy 94.2%, MCQ Accuracy 88%, Words (1 session) 3,200".
- **PR break notification:** Post-session, if new PR: Toast "🏆 New PR! Transcription accuracy: 94.2% (+2.1%)" [Auto-dismiss after 5 sec or tap to view].
- **PR history:** Modal showing 5 most recent PRs (ranked, dated, compared to prior session).

**Badges & Achievements:**
- Earned on milestones:
  - Streaks: "Streak Starter (7 days)", "Streak Master (30 days)", "On Fire (100 days)".
  - Level: "Level 5", "Level 10" etc.
  - Accuracy: "Accuracy Ace (95%+)", "Precision Master (98%+)".
  - Engagement: "Weekly Warrior (read 5+ sessions this week)", "Study Buddy (joined study group)".
  - MCQ: "Quiz Master (MCQ accuracy 90%+)".
- **Badge display:** Earned badges shown as small icons on dashboard. Clicking badge shows earned date, description, and "Share achievement" option.
- **Sharing:** Copy text like "I earned 'Accuracy Ace' badge on RetrieveRx! Can you beat 95%+ accuracy?" to clipboard or social share.

**Micro-Interactions & Emotional Design:**
- **Word highlighting in karaoke:** Smooth 100ms fade-in/out with particle sparkles (CSS), light green background + underline.
- **Progress cylinder:** Smooth drain animation, visual pause indicator on silence.
- **Correct MCQ:** Full-screen green flash, confetti burst from screen center, celebratory sound (optional), character thumbs-up (optional).
- **Incorrect MCQ:** Gentle white flash, supportive nudge explanation slide-in below question, character encouraging nod (optional).
- **Haptic feedback (mobile):** Light vibration pulse on each word recognized, stronger pulse on correct MCQ, softer double-pulse on incorrect.
- **Character reactions (optional, default off):**
  - Thumbs up on accuracy ≥90%.
  - Encouraging nod during streak warning.
  - Celebratory dance on level-up.
  - Curious/worried expression if user hasn't logged in 2+ days (shown on next login).

### Detailed User Flows and Functional Requirements

#### 1) Landing & Opening Cards

**Flow:**
- On first app load, display full-screen or modal carousel with opening science cards.
- Rotate through 10 unique cards (stored in Firestore `openingCards` collection with fields: `id`, `title`, `body`, `emoji`).
- Tap/click anywhere on card to skip and proceed to signup.
- Track which cards have been shown; no repeats until all 10 displayed; then cycle repeats.

**Functional requirements:**
- Cards must load within 1 second (cached in Firestore or preloaded client-side).
- Dismiss action must be non-intrusive (tap anywhere, not small button).
- Dark background with high contrast text.
- Emoji centered at bottom with padding.

#### 2) Signup Flow (Free, No Payment)

**Flow:**
1. User lands on landing page, views opening science cards (why reading aloud improves retention).
2. User clicks **Sign Up**.
3. Client redirects to signup form: email, password, (optional name).
4. Client calls Firebase Auth to create account with email/password.
5. On success, Firebase Auth account created immediately.
6. User redirected to Dashboard; prompted to upload PDF.

**Functional requirements:**
- Fast, frictionless signup (< 1 minute).
- Clear error messaging if signup fails (e.g., email already registered).
- No payment processing at this stage.

**Edge cases:**
- User tries to signup twice with same email → Firebase Auth returns error; show "Account already exists. Please log in." and offer login link.
- Network error during signup → allow retry.

#### 2b) Payment Gate (After PDF Upload)

**Flow:**
1. User uploads PDF and parsing completes successfully.
2. User is ready to start reading (karaoke mode).
3. **Payment gate modal appears:** "Start reading aloud for $5/month".
4. Client calls serverless endpoint `/api/create-checkout-session` with userId and email.
5. Server creates Stripe Checkout session (monthly recurring, $5/month).
6. User redirected to Stripe Checkout; completes payment.
7. Stripe webhook (`/api/stripe-webhook`) confirms payment success.
8. Server verifies payment → sets `users/{userId}.hasPaid = true`.
9. User is redirected back to karaoke reader and can begin reading session.

**Functional requirements:**
- Payment gate only appears after successful PDF upload and parse.
- Secure payment processing; no card data stored client-side.
- Idempotent webhook handling (prevent duplicate charges on webhook retry).
- Clear error messaging if payment fails (e.g., card declined, insufficient funds).
- Monthly recurring billing enforced; user can manage subscription in Stripe Customer Portal (future phase).
- User can upload multiple PDFs without additional payment (one subscription covers all).

**Edge cases:**
- Payment fails → user stays on karaoke reader with blocked state; option to retry payment or cancel.
- User closes browser during Stripe Checkout → session times out; user can retry by clicking "Unlock reading" again.
- User navigates away during payment flow → upon return, check payment status and proceed accordingly.

#### 3) PDF Upload, Parsing, and Passage Extraction

**Flow:**
1. On login, user sees upload prompt: **"Upload your study PDF to get started"** (prominently displayed).
2. User drags/drops or clicks file picker to select PDF.
3. Client validates file (PDF, < 50 MB).
4. Client uploads to `firebase.storage/pdfs/{userId}/{timestamp}/{filename}`.
5. On upload complete, client-side PDF parser (pdf.js) extracts text and segments into passages.
   - **Passage definition:** Continuous section of text typically 200–400 words; often separated by visible spacing or markdown headers (if available in PDF metadata).
   - If PDF lacks clear passage boundaries, parser uses heuristic: segment into chunks of ~300 words.
6. Client displays preview modal: list of extracted passages with optional edit controls (adjust paragraph breaks, trim whitespace).
7. User confirms segmentation; client saves parsed passages to `sessions/{newSessionId}` Firestore document.
8. **After confirmation, payment gate appears** (see section 2b).
9. User completes payment and proceeds to karaoke mode.

**Functional requirements:**
- PDF parsing completes within 2 seconds for typical PDFs (< 10 MB).
- Passage preview shows first 50 chars of each passage + word count.
- User can manually split/merge passages if auto-segmentation is imperfect.
- All users can upload PDFs free; payment required only to unlock reading (karaoke mode).
- Users with active subscription can upload unlimited PDFs without additional charges.

**Edge cases:**
- Scanned PDF (image-only, no selectable text) → fallback message: "This PDF is a scan. Please upload a digital PDF or contact support for OCR."
- Very long passage (>1000 words) → warn user but allow; internally split into sub-passages for persistence granularity.
- Parsing fails → show error and allow retry or contact support.

#### 4) Karaoke Mode (Core Complex Flow)

**Flow:**
1. User enters karaoke reader with a loaded passage.
2. **UI layout:**
   - Center: large passage text (18pt+, dark bg, white text).
   - Right sidebar: vertical **ProgressCylinder** (green, drains top-to-bottom).
   - Top bar: session timer, current passage index (e.g., "Passage 2 of 5"), accuracy % live.
   - Bottom bar: play/pause, microphone status, "Next Passage" button.
3. User clicks **Play** or taps microphone icon to start recording.
4. Client opens WebSocket stream to Deepgram using an **ephemeral token** (fetched from `/api/deepgram-token` serverless endpoint).
5. Client streams audio from device microphone to Deepgram in real time.
6. Deepgram returns transcript with word-level timestamps and confidence scores.
7. **Word highlighting:**
   - Client normalizes both Deepgram transcript and passage text (lowercase, strip punctuation, handle contractions).
   - As Deepgram returns each word, client matches it to the passage and highlights the corresponding token.
   - Highlight style: underline + light green background; transition smoothly over 100–150 ms.
   - If match fails for a word, fallback: highlight closest token or skip (log for later analysis).
8. **Progress cylinder:**
   - Bind cylinder height to total words in passage.
   - For each recognized word, decrement progress (cylinder drains from top).
   - Progress **only advances (drains) when Deepgram returns recognized words.**
   - On silence > 2 seconds, pause cylinder (visual "paused" indicator).
   - When speech resumes, resume draining.
9. **Paragraph completion & persistence (CRITICAL):**
   - Passage is divided into 2–5 internal paragraphs for finer persistence granularity.
   - When a paragraph's recognized words ≥ 85% of expected tokens:
     - Mark paragraph complete locally (optimistic UI update).
     - **Immediately write to Firestore `sessions/{sessionId}`:**
       - Append paragraph index to `paragraphsCompleted`.
       - Update `wordsRead`, `accuracy`, `timeSpent`, `progressPercent`.
     - Implement transaction or single atomic update to prevent race conditions.
     - On transient write failure, enqueue to client-side retry queue; retry on reconnect.
     - **Non-negotiable:** User must not lose progress on network hiccup or refresh.
10. **Repeat paragraph / Next passage:**
    - User can click **Repeat** to re-read current paragraph.
    - User can click **Next** to advance to next passage (with or without completing 85% threshold).
    - Either action triggers paragraph completion write if not already persisted.
11. **Microphone/audio management:**
    - Only one active stream per session.
    - Pause button pauses transcription and drains cylinder.
    - Resume resumes from current position.
    - Session can be closed/backgrounded; on resume (page load), fetch last saved state and resume at first incomplete paragraph.

**Functional requirements:**
- Word highlight latency: median < 250 ms (P99 < 500 ms).
- Passage persistence latency: < 500 ms from completion to Firestore write confirmation.
- Accuracy: average Deepgram confidence > 80% (goal; baseline metric).
- Offline handling: queue writes client-side; flush when online.
- Resume on reload: within 3 seconds, fetch and display last saved passage.

**Edge cases:**
- Deepgram stream disconnects → pause recording, show toast "Mic connection lost. Click to reconnect."
- User speaks non-English or heavily accented English → reduced match accuracy; show helpful message and allow manual override/skip.
- Network lag causes highlight delay > 500 ms → accept and improve in Phase 1.
- User refreshes mid-passage → resume at last completed paragraph, retain all prior progress.

#### 5) MCQ Modal Flow

**Content & Delivery:**
- **Trigger:** After each passage is marked complete (85% word match or user click Next).
- **Number:** 3–4 MCQs per passage (optimal for retention testing without fatigue; aligns with MCAT).
- **Source:** MCQs stored in Firestore `mcqs` collection, linked to passage (or bundled with passage metadata).
  - Each MCQ doc: `topic`, `question`, `options` (array of 4–5), `correctAnswer` (string), `correctNudge` (text explaining why correct), `wrongNudge` (text explaining why incorrect).

**UX Flow:**
1. Passage complete → modal overlay appears, slightly dimmed background.
2. Display first MCQ: question, options as buttons/selectable boxes.
3. User taps/clicks option.
4. **If correct:**
   - Transition to **full-screen green background.**
   - Display selected option highlighted in green.
   - Show `correctNudge` text below: "Great! [explanation]".
   - Wait for tap/click to continue.
5. **If incorrect:**
   - Transition to **full-screen white background.**
   - Display correct answer highlighted in green; selected answer greyed/crossed out.
   - Show `wrongNudge` text below: "[Explanation of correct answer]".
   - Wait for tap/click to continue.
6. Advance to next MCQ in set (up to 4 MCQs per passage).
7. After final MCQ, close modal and display next passage or end-of-session summary.

**Functional requirements:**
- MCQ answer locked after selection (no changing).
- Immediate Firestore write of MCQ response: `sessions/{sessionId}.mcqResults` → append `{ mcqId, userId, selectedAnswer, correct, timestamp }`.
- Smooth transition animations between screens (< 300 ms).
- Accessibility: keyboard selectable options (arrow keys to navigate, Enter to select).

**Edge cases:**
- No MCQs available for passage → skip modal, show toast "No quiz available for this passage", continue.
- MCQ data malformed → fallback, skip, and log error.

#### 6) Session Summary & Analytics

**Flow:**
1. User completes all passages or clicks **End Session**.
2. Summary screen displays:
   - **Sessions stats card:**
     - Total passages completed
     - Total words read
     - Session duration (HH:MM:SS)
     - Overall transcription accuracy (%)
     - Average MCQ accuracy (%)
   - **CTA buttons:**
     - **Resume session** (if incomplete passages remain).
     - **Start new session** (with same PDF or upload new one).
     - **Dashboard** (future: shows all past sessions).
3. All metrics persisted to `sessions/{sessionId}` document.

**Functional requirements:**
- Analytics calculated and displayed within 1 second.
- Summary screen optimized for both mobile and desktop.
- Data available for future analytics dashboard (Phase 1+).

---

### Non-Functional Requirements

#### Performance
- **Word highlight latency:** Median < 250 ms from Deepgram word event to DOM update.
- **Page load:** Initial karaoke reader loads within 2 seconds.
- **PDF parsing:** < 3 seconds for typical 5–20 page PDFs.
- **Firestore writes:** Per-paragraph write confirms within 500 ms (P95); retries transparent to user.

#### Availability & Reliability
- **Uptime SLO:** 99.5% for user-facing flows (landing, signup, upload, karaoke).
- **Graceful degradation:**
  - Deepgram unavailable → pause recording, show message "Speech recognition temporarily unavailable."
  - Stripe unavailable → pause signup, show "Payment processing unavailable. Try again in a few moments."
  - Firestore unavailable → queue writes locally, flush on reconnect; show "Syncing..." indicator.
- **Client-side resilience:**
  - Implement automatic retry queues for failed writes.
  - Periodic reconnect attempts with exponential backoff.
  - Offline-first philosophy: assume network may fail, recover gracefully.

#### Scalability
- **Backend:** Vercel serverless scales horizontally; no persistent server state.
- **Database:** Firestore structure avoids hot-shard writes:
  - Per-user session writes → distributed by `userId`.
  - MCQ writes → distributed by `mcqId`.
  - No global counters.
- **Storage:** Firebase Storage auto-scales; estimate ~500 MB per 1000 active users (PDFs + session metadata).
- **Deepgram:** Usage billed per audio minute; monitor quota and alert on overages.

#### Security & Privacy
- **Authentication:**
  - Firebase Auth email/password; no social login in V1.
  - Session tokens valid for 1 hour; auto-refresh.
- **Data access:**
  - Firestore security rules: User can only read/write their own `users/{userId}`, `sessions/{sessionId}`.
  - Rule: `allow read, write: if request.auth.uid == resource.data.userId`.
- **API keys:**
  - Deepgram API key: server-side only; client requests ephemeral token from `/api/deepgram-token`.
  - Stripe secret key: server-side only; webhook verified with Stripe secret.
  - Never commit keys to GitHub; use Vercel environment variables.
- **Payment:**
  - Stripe Checkout handles PCI compliance; no raw card data touched by app.
  - Stripe webhook signed; verify signature server-side before trusting event.
- **Audio:**
  - Do not store raw audio by default (privacy). Stream and discard.
  - If future opt-in audio storage, require explicit user consent + GDPR/CCPA compliance.
- **HTTPS:** All endpoints HTTPS only; CSP headers to prevent XSS.

#### Cost Management
- **Deepgram:** Free $200 credit on signup. Monitor API usage; estimate ~$0.01 per 10 min of audio (varies by plan). Alert on 80% credit burn.
- **Firestore:** Estimate ~10–20 read/writes per session (paragraph + MCQ persistence). Monitor usage; aim for < $50/month for first 1000 active users.
- **Firebase Storage:** Minimal cost for PDFs; estimate < $5/month initially.
- **Stripe:** 2.9% + $0.30 per transaction (~$0.45 per $5 charge = 9% effective). Acceptable.
- **Vercel:** Free tier suitable for MVP; upgrade if needed at scale.

#### Accessibility (WCAG 2.1 AA)
- Large readable fonts: minimum 16px for body, 18px for karaoke text.
- High contrast: white text on dark background (WCAG AAA contrast ratio ≥ 7:1).
- Keyboard navigation: Tab through all interactive elements, Enter to select, Esc to close modals.
- Screen reader support: ARIA labels on buttons, form fields, MCQ options. Announce dynamic changes (highlights, modal open).
- Color not sole indicator: use underline + color for highlight; use text + icon for status.
- No auto-play audio; microphone requires explicit user click.

---

## Technical Considerations

### High-Level Architecture Recommendations

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser (SPA)                   │
│  React + TypeScript                                     │
│  - UI components (landing, karaoke, MCQ, analytics)    │
│  - Web Audio API for microphone stream                 │
│  - WebSocket to Deepgram for STT                       │
│  - Firebase SDK for auth, storage, database            │
└────────────┬──────────────────────────────┬─────────────┘
             │                              │
             │ HTTPS                        │ HTTPS
             │                              │
    ┌────────▼──────────────┐      ┌────────▼──────────────┐
    │  Vercel Serverless     │      │  Firebase             │
    │  (Node.js Functions)   │      │                       │
    │  - /api/deepgram-token │      │  - Auth               │
    │  - /api/create-checkout│      │  - Firestore (users,  │
    │  - /api/stripe-webhook │      │    sessions, mcqs)    │
    │  - /api/parse-pdf      │      │  - Storage (PDFs)     │
    │  (optional)            │      │                       │
    └────────┬───────────────┘      └────────┬──────────────┘
             │                              │
             │ Stripe API                   │
             │ Deepgram API                 │
             │                              │
    ┌────────▼──────────────┐              │
    │  Third-party Services │              │
    │  - Stripe (payments)   │              │
    │  - Deepgram (STT)      │              │
    └───────────────────────┘              │
                                           │
                     ┌─────────────────────┘
                     │ Firestore Data
                     │ - users/{userId}
                     │ - sessions/{sessionId}
                     │ - mcqs/{mcqId}
                     │ - openingCards/{cardId}
```

### Suggested Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + TypeScript | Type safety, component reusability, large ecosystem. |
| | Tailwind CSS or styled-components | Rapid UI development, dark theme support. |
| | React Router v6 | Client-side routing (landing, signup, session). |
| | pdf.js | Open-source PDF parsing client-side; avoids server-side OCR complexity initially. |
| **Real-time Audio** | Web Audio API (getUserMedia) | Native browser microphone access. |
| | WebSocket or Deepgram SDK | Stream audio to Deepgram with low latency. |
| **Backend / Serverless** | Vercel Functions (Node.js 18+) | Zero-config deployment, integrated with Next.js or standalone. |
| | TypeScript | Type safety for APIs, same language as frontend. |
| **Auth & Data** | Firebase Auth | Email-based, managed authentication. |
| | Firestore | Real-time document database, built-in scaling. |
| | Firebase Storage | Managed PDF uploads, no server-side storage. |
| **Payments** | Stripe API | Secure recurring billing, webhook integration. |
| **Hosting & CI** | Vercel | Seamless Next.js/serverless deployment, GitHub integration. |
| | GitHub Actions | Optional: custom CI workflows for testing. |
| **Monitoring** | Sentry | Frontend error tracking. |
| | Vercel Analytics | Serverless logs and monitoring. |
| | Firestore Monitoring | Database performance and quota alerts. |
| **Testing** | Jest | Unit testing for utilities, matching logic. |
| | React Testing Library | Component integration tests. |
| | Cypress or Playwright | End-to-end tests for critical flows (signup, session). |

### Modular Design Approach and Best Practices

**Component hierarchy:**
```
App (root)
├─ Landing
│  ├─ OpeningCards (carousel)
│  └─ SignupForm (email, password)
├─ AuthGuard (check Firebase Auth)
├─ Dashboard
│  ├─ UploadManager (drag-drop PDF, progress)
│  └─ SessionList (past sessions)
├─ KaraokeReader (main session)
│  ├─ PassageDisplay (text, highlighting)
│  ├─ ProgressCylinder (animated)
│  ├─ ControlBar (play/pause, next)
│  └─ MicrophoneStatus (indicator)
├─ MCQModal
│  ├─ MCQCard (question + options)
│  ├─ FeedbackScreen (green/white)
│  └─ NudgeText
└─ SessionSummary (analytics card)
```

**Service layer (abstraction):**
- `authService.ts` — Firebase Auth wrapper (login, logout, user info).
- `firestoreService.ts` — CRUD ops on users, sessions, MCQs with retry logic.
- `storageService.ts` — PDF upload, download, delete.
- `deepgramService.ts` — Ephemeral token fetching, WebSocket management.
- `stripeService.ts` — Server-side only; no client calls directly to Stripe.
- `pdfService.ts` — PDF parsing, text extraction, passage segmentation.

**State management:**
- Local component state for UI toggles (modals, play/pause).
- React Context for session-level state (current passage, wordsRead, accuracy, mcqResults).
- Consider Redux or Zustand if state becomes complex (Phase 2+).

**Persistence strategy:**
- Single source of truth: Firestore document `sessions/{sessionId}`.
- Optimistic UI updates: increment word count and accuracy locally; queue Firestore write.
- On write success, confirm. On failure, retry with exponential backoff.
- Client-side queue: `Map<paragraphIndex, pendingWrite>` flushed on reconnect.

**Testing strategy:**
- Unit: matching logic (normalize text, find token in passage), paragraph completion heuristic.
- Integration: Firestore write/retry flow, Deepgram token refresh.
- E2E: signup flow, upload, karaoke + persistence, MCQ, analytics.

**Security:**
- Environment variables: `NEXT_PUBLIC_*` for client-side public data only (Firebase config).
- Sensitive: `DEEPGRAM_API_KEY`, `STRIPE_SECRET_KEY`, `FIREBASE_ADMIN_KEY` — server-side only.
- No secrets in `.env.local` or `.gitignore` violations.

**Code organization:**
```
/src
├─ components/
│  ├─ Landing.tsx
│  ├─ SignupForm.tsx
│  ├─ KaraokeReader.tsx
│  ├─ MCQModal.tsx
│  ├─ ProgressCylinder.tsx
│  └─ SessionSummary.tsx
├─ services/
│  ├─ authService.ts
│  ├─ firestoreService.ts
│  ├─ deepgramService.ts
│  ├─ pdfService.ts
│  └─ storageService.ts
├─ types/
│  └─ index.ts (TypeScript interfaces)
├─ hooks/
│  ├─ useSession.ts
│  ├─ useMicrophone.ts
│  └─ useDeepgramStream.ts
├─ utils/
│  ├─ textMatching.ts
│  └─ analytics.ts
├─ styles/
│  └─ globals.css (Tailwind config, dark theme)
└─ App.tsx
/pages/api (Vercel serverless)
├─ deepgram-token.ts
├─ create-checkout-session.ts
└─ stripe-webhook.ts
```

---

## User Interface & Experience

### Key Screens and Flows

#### Screen 1: Landing + Opening Cards
- **Full-screen carousel**
- Dark background, bold uppercase card title, body text, centered cosmic emoji at bottom.
- Tap anywhere to skip → directs to signup.
- Cards randomly ordered; no repeat until all 10 shown.

#### Screen 2: Signup Form
- Email input, password input, name (optional).
- Stripe payment button: "$5/month → Pay Now".
- On success, confirm payment + account created.

#### Screen 3: Upload & Parse PDF
- Prominent heading: "Upload your first free PDF".
- Drag-and-drop zone or file picker.
- Progress bar (upload + parsing).
- Preview modal: list of extracted passages, optional edit controls.
- Confirm → proceed to karaoke.

#### Screen 4: Karaoke Reader
- **Center:** Large passage text (18pt+, white on dark).
- **Right sidebar:** Vertical ProgressCylinder (green, drains top-to-bottom).
- **Top bar:** Session timer, passage counter (e.g., "2/5"), live accuracy %.
- **Bottom bar:** Play/Pause, Next Passage, Repeat buttons. Microphone status.
- Real-time word highlighting: underline + light green background.

#### Screen 5: MCQ Modal
- Modal overlay with question and 4–5 options.
- On correct: transition to full-screen green, show nudge.
- On incorrect: transition to full-screen white, highlight correct answer, show nudge.
- Tap to continue → next MCQ or next passage.

#### Screen 6: Session Summary
- Simple card with totals: words read, accuracy, time, MCQ avg.
- Buttons: Resume session, Start new session, Dashboard (future).

### Visual Design Direction

- **Color scheme:** Dark background (charcoal or dark gray), white text, green accents (progress cylinder, correct MCQs), red/orange for errors.
- **Typography:** Serif for body (e.g., Georgia, readable); sans-serif for UI (e.g., Inter, Helvetica).
- **Spacing:** Generous padding (16px–32px), clear hierarchy, no clutter.
- **Animations:** Smooth easing (cubic-bezier) for progress cylinder, highlight transitions, modal fade-in/out.
- **Mobile-first:** Design responsive from 375px (mobile) upward; touch targets ≥ 48px.
- **Accessibility:** High contrast (7:1+), keyboard navigation, large fonts (18pt+).

---

## Assumptions & Dependencies

### Assumptions

1. **PDF quality:** Users upload reasonably clean, machine-readable PDFs (not scans). OCR fallback deferred to Phase 1.
2. **Deepgram accuracy:** Word-level timestamps and confidence scores are sufficient for reliable highlighting. Occasional mismatches acceptable (<5% of words).
3. **Network:** Users have broadband or decent mobile connectivity during sessions. Brief network hiccups (< 10s) recoverable by client-side queue.
4. **Device:** Modern browsers (Chrome, Firefox, Safari, Edge) with WebRTC and Web Audio API support.
5. **API availability:** Deepgram, Stripe, and Firebase have 99.9% uptime; brief outages gracefully handled by app.
6. **Subscription model:** $5/month recurring billing is acceptable and sustainable for target user base (MCAT retakers).

### External Dependencies

- **Deepgram API:** Real-time speech-to-text with word-level timestamps. Free $200 credit; monitor usage.
- **Stripe API:** Payment processing and recurring subscription management.
- **Firebase:** Auth, Firestore, Storage; managed by Phalesh.
- **Vercel:** Hosting and serverless function execution.
- **GitHub:** Repository hosting and CI/CD integration.

### Access & Repo Constraints

- **Developer:** Collaborator access (write permissions). API keys managed by Phalesh (repo owner).
- **Secrets management:** Vercel environment variables or Firebase secrets (not in `.gitignore` or `.env` file committed).
- **Code review:** Before merge to main, code must not contain hardcoded keys, secrets, or sensitive data.

### Device & Browser Requirements

- **Minimum browsers:**
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **Audio input:** Device with functional microphone.
- **Viewport:** 375px (mobile) to 1920px (desktop).

---

## Risks and Open Questions

### Risks

1. **Critical requirement (per-passage persistence):**
   - Risk: Network interruption causes Firestore write failure; user loses progress.
   - Mitigation: Implement client-side retry queue, offline backfill, transactional writes. Log all failures. Test failure scenarios.

2. **Speech recognition inaccuracy in noisy environments:**
   - Risk: Poor word matching → poor highlight → bad UX → user frustration.
   - Mitigation: Offer noise suppression toggle, microphone level indicator, manual override (user can skip unmatched words). Monitor Deepgram confidence; surface low-confidence warnings.

3. **PDF parsing complexity:**
   - Risk: Scanned PDFs, complex layouts, multi-column text → poor passage segmentation.
   - Mitigation: Client-side preview + edit UI for passage breaks. Fallback to serverless OCR if needed (Phase 1). Educate users on PDF quality.

4. **API key exposure:**
   - Risk: Deepgram/Stripe keys accidentally committed to GitHub or exposed in browser console.
   - Mitigation: Code review checklist, pre-commit hooks (e.g., git-secrets), environment variable enforcement in Vercel.

5. **Deepgram quota exceeded:**
   - Risk: Unexpected high usage exhausts free $200 credit; API calls start failing.
   - Mitigation: Monitor usage daily, set alerts at 50% and 75% quota. Plan paid plan transition before production.

6. **Firestore write contention:**
   - Risk: Multiple clients writing to same session → race conditions → data loss or inconsistency.
   - Mitigation: Use transactional writes, batched updates, and server-side validation. Avoid global counters; partition by sessionId.

7. **Subscription churn:**
   - Risk: Low retention (< 20% after month 1) → revenue insufficient to cover costs.
   - Mitigation: Gather user feedback on product-market fit during MVP phase. Iterate on MCQ difficulty, passage variety, and analytics.

### Open Questions (Require Stakeholder Input)

1. **Paragraph vs. passage completion:**
   - Should completion be automatic (85% word match) or require explicit user confirmation?
   - Recommended: Auto-complete on 85% threshold to reduce friction; allow user override.

2. **Audio storage:**
   - Should app record and store audio for user playback/review?
   - Privacy implication: GDPR/CCPA compliance needed.
   - Recommended: Discard by default; offer opt-in storage in Phase 2 with clear consent.

3. **MCQ authorship:**
   - Are MCQs provided by user (embedded in PDF metadata) or supplied by RETREIVE?
   - Initial MVP: stub MCQs stored in Firestore; future: integrate with learning partners or let users upload MCQs.

4. **Transcription accuracy threshold:**
   - What % confidence/match rate triggers highlighting? (Current suggestion: 85% word match.)
   - Recommended: Start at 85%; adjust post-MVP based on user feedback.

5. **Session data retention policy:**
   - How long are sessions kept? (Compliance, storage cost.)
   - Recommended: Keep indefinitely for paying users; delete after account deletion.

6. **Multi-device sync:**
   - Can user resume session on different device?
   - Recommended: Yes, via Firestore session state. Implement in Phase 1.

7. **Pricing experimentation:**
   - Is $5/month optimal, or should we test $3, $7, $10?
   - Recommended: Start at $5; gather user feedback and consider A/B testing in Phase 1.

---

## Phased Roadmap

### MVP Phase (Week 1–4; Target: public beta launch)

#### Week 1: Foundations & Free Signup
- **Frontend:**
  - Landing page + opening cards carousel (hardcoded or fetched from Firestore).
  - Signup form (email, password, name) — NO payment required.
  - Dashboard page (prompt to upload PDF).
  - Basic routing (landing → signup → dashboard).
- **Backend:**
  - Firestore setup (schema for users, sessions, mcqs, openingCards collections).
  - Firebase Auth integration (free signup, no Stripe).
- **Infrastructure:**
  - GitHub repo initialized; Vercel connected.
  - Firestore security rules drafted (basic access control).
  - Environment variables configured (Vercel).
- **Testing:**
  - Manual signup flow test; Firebase Auth validation.
- **Deliverables:** Signup page live; users table created in Firestore; users can sign up without payment friction.

#### Week 2: PDF Upload, Payment Gate & Karaoke Engine
- **Frontend:**
  - PDF upload UI (drag-drop, file picker).
  - pdf.js parsing library integrated; passage extraction preview.
  - Payment gate modal (appears after successful PDF upload).
  - KaraokeReader component (text display, highlight hooks).
  - ProgressCylinder component (CSS animation, binding to word progress).
  - Microphone access (Web Audio API, getUserMedia).
- **Backend:**
  - Vercel function `/api/create-checkout-session` (Stripe; called after PDF upload confirmation).
  - Vercel function `/api/deepgram-token` (ephemeral token generation).
  - Deepgram WebSocket integration (server-side token generation).
  - Word highlight matching logic (text normalization, token matching).
  - Firestore writes: immediate per-paragraph (non-negotiable).
- **Infrastructure:**
  - Firebase Storage setup for PDF uploads.
  - Deepgram account + free credits provisioned.
- **Testing:**
  - Integration test: upload PDF → parse → highlight words.
  - Firestore write reliability test (success rate > 99%).
- **Deliverables:** Karaoke reader functional; real-time highlighting working; per-paragraph persistence confirmed.

#### Week 3: MCQ Flow & Analytics
- **Frontend:**
  - MCQModal component (question + options, green/white feedback screens).
  - FeedbackScreen (correct/incorrect, nudge text).
  - SessionSummary component (totals: words read, accuracy, time, MCQ avg).
  - MCQ result persistence logic.
- **Backend:**
  - MCQ collection in Firestore (schema: topic, question, options, correctAnswer, nudges).
  - Sample MCQs seeded for testing.
- **Testing:**
  - MCQ flow end-to-end (answer correctly → green; answer incorrectly → white).
  - Analytics calculation correctness.
- **Deliverables:** MCQ modal + feedback screens; session summary displayed; analytics stored in Firestore.

#### Week 4: Polish, Testing & Release
- **Frontend:**
  - UI polish (responsive mobile, dark theme consistency, animations smoothed).
  - Accessibility audit (WCAG 2.1 AA); fix contrast, keyboard nav, ARIA labels.
  - Error handling (graceful fallbacks for Deepgram, Stripe, Firestore failures).
  - Browser testing (Chrome, Firefox, Safari, mobile).
- **Backend:**
  - Server-side logging (Sentry integration for frontend errors).
  - Firestore security rules finalized and tested.
  - Rate limiting for serverless functions.
- **Testing:**
  - Full end-to-end test (signup → upload → read → MCQ → summary).
  - Edge cases: network failures, missing PDFs, invalid MCQs.
  - Load test: simulate 10–20 concurrent users.
- **Deployment:**
  - Deploy to Vercel: `retreive.vercel.app`.
  - Firestore rules deployed.
  - Stripe webhook verified live.
  - DNS / custom domain (if applicable).
- **Deliverables:** Public beta live; invite-only access; first cohort of MCAT retakers onboarded.

### Phase 1 (Post-MVP; 1–2 months; Target: stabilization + engagement launch)

**Goals:** Improve reliability, launch engagement mechanics, and drive user retention.

**Reliability & Resilience:**
- **Deepgram resilience:**
  - Implement advanced noise filtering, confidence-based filtering (hide low-confidence words).
  - Fallback speech recognition (browser-based Web Speech API if Deepgram unavailable).
  - Retry with exponential backoff.

- **PDF parsing improvements:**
  - OCR fallback for scanned PDFs (consider Tesseract or cloud OCR service).
  - Advanced passage boundary detection (heuristics, ML model in Phase 2).
  - User feedback: crowdsourced passage correction.

- **Offline resilience:**
  - Service Worker for offline access (preload passages, MCQs).
  - Enhanced client-side queue with persistent storage (IndexedDB).
  - Sync on reconnect.

**Engagement Mechanics Launch (Weeks 1–4 post-MVP):**
- **Weeks 1–2: High-Impact Mechanics**
  - Reading Streak system (daily tracking, reset logic, countdown timer).
  - Reading Level progression (points per word, accuracy bonuses, level-up animations).
  - Personal Records tracking (accuracy, MCQ accuracy, session duration, words per session).
  - Dashboard engagement UI (streak, level, PRs, badges display).
  
- **Weeks 2–3: Micro-Interactions & Emotional Design**
  - Word highlight animations with particle sparkles.
  - Progress cylinder smooth animations.
  - Correct/incorrect MCQ feedback (green/white full-screen, confetti bursts).
  - Character reactions (optional, default off).
  - Haptic feedback on mobile (vibration API).
  - Celebratory sounds (optional, mutable in settings).

- **Weeks 3–4: Study Group & Competitive Features**
  - Study group creation and invite links.
  - Weekly leaderboard (points-based ranking, tied ranks, reset logic).
  - Study group dashboard for tutors (aggregated metrics, member list, engagement analytics).
  - Weekly challenges (tutor-posted, auto-tracked, badge rewards).
  - Badge system (milestone badges, streak badges, accuracy badges, engagement badges).

- **Weeks 4+: Polish & Rollout**
  - A/B testing on engagement features (streak frequency, level thresholds, badge rarity).
  - User feedback collection and iteration.
  - Comprehensive instrumentation for engagement metrics (streak retention, level progression rate, leaderboard engagement).

**User Retention Features:**
- Email notifications for subscription renewal reminders.
- Streak protection notifications (in-app toast when streak at risk).
- Streak Freeze monetization ($0.99 per freeze after 2 free per month).
- Daily engagement emails (optional, opt-in): "You read 2,000 words yesterday! Keep your streak going today."
- Referral incentive ($5 credit for successful referrals).

**Instrumentation & Monitoring (Engagement Focus):**
- Sentry error tracking fully configured.
- Firestore monitoring (quota alerts, latency SLOs).
- Deepgram usage tracking + cost alerts.
- User behavior analytics:
  - Session duration trends.
  - MCQ accuracy trends.
  - Streak retention rate (% maintaining streaks by day 7, 30, 100).
  - Level progression velocity (days to reach each level).
  - Leaderboard engagement (% viewing leaderboard, update frequency).
  - Churn prediction (flag users not active ≥ 7 days).
  - Badge earn rates (identify undervalued / overvalued badges).

**Security & Compliance:**
- Penetration testing (light).
- GDPR/privacy policy finalized.
- Audio data handling compliance (discard or consent-based).

### Phase 2 (3–6 months; Target: scale + advanced features)

**Goals:** Multi-user scale, advanced analytics, optional premium features, enhanced competitive engagement.

- **Advanced Analytics Dashboard:**
  - User can view all past sessions, performance trends over time.
  - Topic-level analysis (which topics improving, which weak).
  - Comparative analytics (vs. own baseline, vs. anonymized peer averages).
  - Yearly reading level projections and milestone predictions.

- **Advanced Engagement Features:**
  - **Study companion character customization** (users select character, unlock skins via milestones).
  - **Micro-competitions:** Daily challenges ("Read X words today"), monthly tournaments.
  - **Social sharing:** Pre-designed achievement cards (shareable to social media).
  - **Referral dashboard:** Track referrals, earn badges ("Referral Master"), leaderboard for top referrers.
  - **Seasonal events:** "Summer Study Challenge" (limited-time leaderboards, exclusive badges).

- **Audio recording (opt-in):**
  - User can enable recording for session playback and review.
  - GDPR-compliant consent + deletion.
  - Playback with word-level scrubbing.

- **Admin UI (light):**
  - Simple CRUD form for MCQ management (add/edit/delete questions).
  - View user metrics (subscription count, session count, DAU, engagement scores).
  - Release notes management for app announcements.

- **Subscription tiers:**
  - Starter ($5/month): unlimited uploads, basic analytics, leaderboard access.
  - Pro ($12/month): advanced analytics, audio recording, custom character skins, early access to new features.
  - Tutor tier ($25/month): unlimited study groups, advanced group analytics, bulk user management, API access.
  - Free tier (limited): 1 free PDF, basic reading (no leaderboard), limited MCQs.

- **Mobile app (iOS/Android, optional):**
  - Consider native app vs. PWA. PWA likely sufficient initially.
  - Native features: background audio, offline sync, faster performance, push notifications.

- **Integrations & Partnerships:**
  - OneNote, Google Drive import (let users upload from cloud storage).
  - Tutor marketplace: allow tutors to create/sell study group sessions.
  - Integration with MCAT prep platforms (Kaplan, Princeton Review API partnerships).
  - LMS integrations (Canvas, Blackboard for tutor groups).

- **AI-Powered Enhancements (Phase 2+):**
  - Intelligent passage recommendation (suggest passages user struggles with).
  - Adaptive MCQ difficulty (adjust MCQ difficulty based on accuracy trends).
  - Personalized study schedule suggestions (based on streak patterns and engagement).
  - Automated tutor feedback (analyze student recordings, suggest pronunciation improvements).

---

## Appendix

### Database Schema (Firestore)

#### Collection: `users`
```
users/{userId}
  - name: string
  - email: string
  - createdAt: Timestamp
  - hasPaid: boolean (true if subscription active)
  - freePdfToken: boolean (true if free upload not yet used)
  - subscriptionStatus: string (active | cancelled | past_due)
  - stripeCustomerId: string (for recurring billing)
  - lastSessionId: string (optional, for quick resume)
```

#### Collection: `sessions`
```
sessions/{sessionId}
  - userId: string (FK to users)
  - pdfName: string
  - pdfUrl: string (Firebase Storage path)
  - passages: array<{
      index: number
      text: string
      tokenized: array<string>
      wordCount: number
    }>
  - paragraphsCompleted: array<number> (paragraph indices)
  - wordsRead: number (cumulative)
  - accuracy: number (0–100, %)
  - timeSpent: number (seconds)
  - progressPercent: number (0–100)
  - mcqResults: array<{
      mcqId: string
      userId: string
      selectedAnswer: string
      correct: boolean
      timestamp: Timestamp
    }>
  - createdAt: Timestamp
  - updatedAt: Timestamp
  - completedAt: Timestamp (optional, if session ended)
```

#### Collection: `mcqs`
```
mcqs/{mcqId}
  - topic: string (e.g., "Biochemistry", "Organic Chemistry")
  - question: string
  - options: array<string> (4–5 options)
  - correctAnswer: string (exact match to one option)
  - correctNudge: string (explanation when correct)
  - wrongNudge: string (explanation when incorrect)
  - difficulty: string (easy | medium | hard, optional)
  - createdAt: Timestamp
```

#### Collection: `openingCards`
```
openingCards/{cardId}
  - id: string (unique)
  - title: string (bold uppercase)
  - body: string (explanation text)
  - emoji: string (Unicode emoji, centered at bottom)
```

---

### Serverless Endpoints (Vercel Functions)

#### 1. `/api/create-checkout-session` (Payment Gate)
```typescript
// POST /api/create-checkout-session
// Request: { userId: string, email: string, sessionId: string }
// Response: { sessionId: string, url: string }

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { userId, email, sessionId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // $5/month recurring
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/session/${sessionId}?payment=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/session/${sessionId}?payment=cancelled`,
    metadata: { userId, sessionId },
  });

  res.status(200).json({
    sessionId: session.id,
    url: session.url,
  });
}
```

#### 2. `/api/deepgram-token`
```typescript
// POST /api/deepgram-token
// Request: { }
// Response: { token: string, expiresIn: number }

import { createClient } from '@deepgram/sdk';

export default async function handler(req, res) {
  const client = createClient({ apiKey: process.env.DEEPGRAM_API_KEY });
  
  const token = await client.auth.getProjectKeyByID(
    process.env.DEEPGRAM_PROJECT_ID,
    process.env.DEEPGRAM_API_KEY_ID
  );
  
  res.status(200).json({
    token: token.key,
    expiresIn: 3600, // 1 hour
  });
}
```

#### 2. `/api/create-checkout-session`
```typescript
// POST /api/create-checkout-session
// Request: { email: string, userId?: string }
// Response: { sessionId: string, url: string }

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { email, userId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // $5/month recurring
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    metadata: { userId },
  });

  res.status(200).json({
    sessionId: session.id,
    url: session.url,
  });
}
```

#### 3. `/api/stripe-webhook`
```typescript
// POST /api/stripe-webhook
// Webhook endpoint for Stripe events

import Stripe from 'stripe';
import { admin } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body; // must be raw string, not parsed JSON

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = admin.firestore();

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.userId;

      // Mark user as paid and grant free PDF upload
      await db.collection('users').doc(userId).update({
        hasPaid: true,
        freePdfToken: true,
        subscriptionStatus: 'active',
        stripeCustomerId: session.customer,
      });
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      const customerId = subscription.customer;

      // Find user by Stripe customer ID and mark unpaid
      const usersSnapshot = await db.collection('users')
        .where('stripeCustomerId', '==', customerId)
        .get();

      usersSnapshot.docs.forEach(async (doc) => {
        await doc.ref.update({ subscriptionStatus: 'cancelled' });
      });
      break;
  }

  res.status(200).json({ received: true });
}
```

#### 4. `/api/parse-pdf` (Optional, serverless parsing)
```typescript
// POST /api/parse-pdf
// Request: { pdfUrl: string, sessionId: string }
// Response: { passages: array, status: string }

// Use pdf-parse or similar library for server-side parsing
// Useful if client-side pdf.js insufficient for complex layouts.
```

---

### Firestore Security Rules (Recommended)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users: only user can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Sessions: only owner (user) can read/write
    match /sessions/{sessionId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // MCQs: public read; admin write only
    match /mcqs/{mcqId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == "ADMIN_UID"; // replace with actual admin UID
    }

    // Opening cards: public read
    match /openingCards/{cardId} {
      allow read: if true;
    }

  }
}
```

---

### Text Matching Algorithm (Client-side)

```typescript
// Normalize text for matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();
}

// Tokenize passage into words
function tokenizePassage(passage: string): string[] {
  return normalizeText(passage).split(' ');
}

// Find token in passage given Deepgram word
function findTokenInPassage(
  word: string,
  tokens: string[],
  startIndex: number = 0
): number {
  const normalizedWord = normalizeText(word);
  
  for (let i = startIndex; i < tokens.length; i++) {
    if (tokens[i] === normalizedWord) {
      return i;
    }
  }
  
  return -1; // not found
}

// Highlight tokens as Deepgram transcription arrives
function highlightToken(tokenIndex: number, passage: string) {
  const token = document.querySelector(`[data-token-index="${tokenIndex}"]`);
  if (token) {
    token.classList.add('highlighted');
    // Optional: fade out previous highlight
    document.querySelectorAll('[data-token-index]').forEach((el) => {
      if (el !== token) el.classList.remove('highlighted');
    });
  }
}
```

---

### Paragraph Completion Heuristic

```typescript
// Determine if paragraph is complete
function isParagraphComplete(
  paragraph: {
    text: string;
    tokenized: string[];
    highlightedTokenCount: number;
  },
  threshold: number = 0.85
): boolean {
  const matchRatio = paragraph.highlightedTokenCount / paragraph.tokenized.length;
  return matchRatio >= threshold;
}

// On completion, trigger Firestore write immediately
async function persistParagraphCompletion(
  sessionId: string,
  paragraphIndex: number,
  wordsRead: number,
  accuracy: number
) {
  try {
    await db.collection('sessions').doc(sessionId).update({
      paragraphsCompleted: firestore.FieldValue.arrayUnion(paragraphIndex),
      wordsRead: wordsRead,
      accuracy: accuracy,
      updatedAt: firestore.Timestamp.now(),
    });
    console.log(`Paragraph ${paragraphIndex} persisted.`);
  } catch (error) {
    console.error('Firestore write failed:', error);
    // Enqueue for retry
    retryQueue.push({ sessionId, paragraphIndex, wordsRead, accuracy });
  }
}
```

---

### Implementation Checklist (Developer)

**Week 1:**
- [ ] GitHub repo initialized; Vercel linked.
- [ ] Firebase project created; Firestore, Auth, Storage provisioned.
- [ ] Deepgram account created; free $200 credit confirmed.
- [ ] Landing page UI (hard-coded opening cards).
- [ ] Signup form + Firebase Auth integration (free, no payment).
- [ ] Dashboard page (prompt to upload PDF).
- [ ] Firestore schema created (users, sessions, openingCards collections).
- [ ] Environment variables configured in Vercel.
- [ ] Test: signup flow end-to-end → Firebase Auth success.

**Week 2:**
- [ ] PDF upload UI (drag-drop, file picker).
- [ ] pdf.js integrated; passage extraction working.
- [ ] Payment gate modal UI (appears after PDF upload).
- [ ] `/api/create-checkout-session` endpoint + Stripe test.
- [ ] Stripe account created; test API keys configured.
- [ ] KaraokeReader component skeleton.
- [ ] Web Audio API (getUserMedia) working.
- [ ] `/api/deepgram-token` endpoint.
- [ ] Deepgram WebSocket integration (test in browser console).
- [ ] Word highlighting logic (matching, tokenization).
- [ ] ProgressCylinder component + CSS animation.
- [ ] Per-paragraph Firestore writes + retry logic.
- [ ] Test: upload PDF → payment gate → highlight → persist.

**Week 3:**
- [ ] MCQModal component.
- [ ] Green/white feedback screens.
- [ ] MCQ persistence to Firestore.
- [ ] SessionSummary component.
- [ ] Analytics calculation.
- [ ] Test: answer MCQs → feedback → analytics.

**Week 4:**
- [ ] Responsive mobile CSS.
- [ ] Accessibility audit (contrast, keyboard nav, ARIA).
- [ ] Error handling (Deepgram, Stripe, Firestore failures).
- [ ] Sentry integration for error tracking.
- [ ] Firestore security rules deployed.
- [ ] Full end-to-end test (signup → upload → read → MCQ → summary).
- [ ] Browser compatibility test (Chrome, Firefox, Safari, mobile).
- [ ] Deploy to Vercel `retreive.vercel.app`.
- [ ] Stripe webhook verified live.
- [ ] First user invite cohort.

---

### Success Metrics Dashboard (Phase 1+)

Track these metrics weekly:

| Metric | Target | Method |
|--------|--------|--------|
| Signups | 50+ per week | Google Analytics |
| PDF upload rate (% of signups) | 60%+ | Firestore queries |
| Payment conversion (% of uploads) | 25–35% | Stripe dashboard |
| Monthly renewal rate | 40%+ | Stripe subscription dashboard |
| Session completion (% of paid users) | 75%+ | Firestore sessions with `completedAt` |
| Average MCQ accuracy | Baseline + 5% improvement | Firestore analytics |
| Word highlight latency (P95) | < 500 ms | Browser DevTools / Sentry |
| Firestore write success rate | 99.9%+ | Server logs |
| User NPS | 30+ | Post-session survey |

---

**Document Version History**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 27 May 2026 | Initial comprehensive PRD; terminology clarified (passage vs. paragraph); pricing changed from $5 one-time to $5/month; free first PDF upload added; MCQ count optimized to 3–4 per passage. |

---

**End of Document**
