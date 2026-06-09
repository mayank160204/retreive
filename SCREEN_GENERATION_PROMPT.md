ssite text
- Current word (just read): green underline + light green background, fade-in
- Previously read words: light green text (dim), fade-out
- Transition time: 100-150ms ease-out
- Word spacing: letter-spacing 0.5px for clarity

**Right Sidebar (Progress Cylinder):**
- Vertical cylinder visual (60px width, height = passage length proportional)
- Green filled portion at top (% complete)
- White unfilled portion below
- Numbers: "245/412 words" (12px, gray, centered below)
- Smooth drain animation as words are read
- Color gradient: green (#00D97D) → white (#FFFFFF)

**Bottom Control Bar:**
- Dark background, padding 16px
- Left side:
  - **Play/Pause button:** 56px circle, green when recording, gray when paused
  - **Microphone status:** icon + text ("Recording..." or "Paused" or "Ready")
- Center:
  - **Confidence score:** "91% confident" (12px, gray, if available)
  - **Noise level indicator:** animated bars (4-5 bars, green if clear, yellow if noisy)
- Right side:
  - **Next Passage button:** green outline, 48px height
  - **End Session button:** gray outline, 48px height

**Mobile Layout:**
- Hide left sidebar (show icon to toggle)
- Reduce right sidebar (smaller cylinder, numbers inline)
- Bottom controls adapt to screen

**States:**

**State 1: Paused (before reading)**
- Play button large, green, highlighted
- Text: "Ready to start? Click play to begin."

**State 2: Recording (active)**
- Pause button visible (red/orange for contrast)
- Real-time highlights flowing
- Cylinder draining
- Microphone icon animated (pulsing)

**State 3: Complete passage**
- Button label changes to "Next Passage" (green)
- Summary: "Great! 412 words read, 88% accuracy"
- Auto-advance option: "Next passage in 3 seconds..." or manual button

**State 4: Deepgram error**
- Toast notification: "Speech recognition temporarily unavailable. Try again."
- Pause/retry buttons

---

### Screen 6: MCQ Modal (After Each Passage)

**Layout:**
- Full-screen dark overlay (98% opacity)
- Center modal card: 500px width (mobile: 360px)

**Question Section:**
- **Header:** "Question 1 of 4" (12px, bold, green, top left)
- **Question text:** (20px, bold, white, max-width 440px, center)
- Example: "Based on the passage, which of the following best explains why prokaryotes lack mitochondria?"

**Options (4 choices):**
- Each option is a card-style button (full width, 60px height, border-radius 8px)
- Default style: dark background (#1A1A1A), 1px border (#333), white text
- Hover: border green, slight background lift
- Selected (before answer): green border + green text
- Layout: vertical stack, 12px gap between

**Answer States:**

**Correct Answer:**
- Transition to **green full-screen background**
- Selected option highlighted in green
- Checkmark icon (48px, white)
- **Nudge text:** 
  - Heading: "Correct! 🎉" (24px, bold, white, center)
  - Explanation: "Prokaryotes evolved before the endosymbiotic event that introduced mitochondria. They rely on their cell membrane for energy production." (16px, regular, white, center, max-width 400px)
- **Button:** "Next question" (green, 48px, bottom)

**Incorrect Answer:**
- Transition to **white full-screen background**
- Correct option: green background + white text
- Selected option: gray background, white text with strikethrough
- **X icon** (48px, red, top center)
- **Nudge text:**
  - Heading: "Not quite right" (24px, bold, dark gray, center)
  - Explanation: "The correct answer is [option letter]. Reason: [nudge text]" (16px, regular, dark gray, center)
- **Button:** "Next question" (dark green, 48px, bottom)

**Loading state (fetching next question):**
- Spinner animation
- "Loading next question..."

---

### Screen 7: Session Summary & Analytics

**Layout:**
- Full-screen page (no modal)
- Header bar with session title
- Center: stats cards in grid layout
- Bottom: action buttons

**Header:**
- Back button (left, gray)
- Title: "Session Summary" (28px, bold, white)
- Date/time: "Today, 4:32 PM" (14px, gray)

**Stats Cards Grid (4 columns on desktop, 2x2 on tablet, 1 column on mobile):**

1. **Passages Completed**
   - Large number: "5" (48px, green, bold)
   - Label: "of 8 passages" (14px, gray)
   - Progress bar: 5/8 filled (green)

2. **Total Words Read**
   - Large number: "2,144" (48px, white, bold)
   - Label: "words read" (14px, gray)
   - Rate: "~25 words/min" (12px, light gray)

3. **Session Duration**
   - Large number: "42:15" (48px, white, bold)
   - Label: "minutes and seconds" (14px, gray)

4. **Overall Accuracy**
   - Large number: "86%" (48px, green, bold)
   - Label: "transcription accuracy" (14px, gray)
   - Breakdown: "34 words unmatched" (12px, gray)

5. **Average MCQ Accuracy**
   - Large number: "75%" (48px, white, bold)
   - Label: "correct answers" (14px, gray)
   - Breakdown: "12 correct, 4 incorrect" (12px, gray)

6. **Next Passage Ready**
   - Icon: ✅
   - Text: "Session saved — resume anytime" (14px, white)
   - Subtext: "Your progress synced to cloud" (12px, gray)

**Action Buttons (bottom, full width on mobile, row on desktop):**
- **Primary:** "Resume Reading" (green, 48px height, icon: ▶️)
- **Secondary:** "Start New Session" (green outline, 48px height)
- **Tertiary:** "View Dashboard" (gray outline, 48px height)

**Optional (Phase 1+):**
- "Download as PDF" (gray link)
- "Share with tutor" (gray link)

---

## Engagement-Focused Screens (Phase 1+)

### Screen 8: Dashboard with Engagement Metrics

**Layout:**
- Full-screen, dark background
- Top bar: user avatar (small circle, initials), "Dashboard" title (28px, bold, white), logout icon
- Main content: scrollable vertical stack

**Header Section (Engagement Prominence):**
- **Streak Card (highlighted):**
  - Background: dark gradient with subtle green accent (top-left)
  - Large flame emoji (64px) + "12" (48px, bold, green)
  - Label: "day streak" (16px, white)
  - Subtext: "🔥 Keep it alive! Resets in 18 hours." (14px, yellow/orange accent color for urgency)
  - Small countdown timer visualization (ring progress indicator, 18 hours shown)

- **Level & Progress Card (below streak):**
  - "Level 4" (32px, bold, white)
  - Progress bar: "67 / 250 points" (14px, gray)
  - Visual progress bar: 67% filled (green gradient)
  - Subtext: "183 points to Level 5!" (14px, light gray)
  - Icon: trophy (small, left of "Level")

**Quick Stats Row (3 cards):**
1. **Accuracy PR:** "94.2% 🏆" (24px, green) + "New PR! (+2.1%)" (12px, green accent)
2. **Session Streak:** "5 sessions this week" (16px, white)
3. **Study Group:** "Dr. Smith's MCAT Biology" (14px, gray) + member count

**Engagement Widgets:**
- **Badges Section (horizontal scroll):**
  - Title: "Your Badges" (18px, bold, white)
  - Horizontal scroll of earned badges (50×50px icons):
    - "Level 5" badge
    - "Streak Master (30 days)" badge
    - "Accuracy Ace (95%+)" badge
    - "Weekly Warrior" badge
  - On hover: show badge name + date earned
  - Empty slot: "?" icon (locked) for next earnable badge
  - CTA: "View all badges" (link)

- **Study Group Leaderboard Preview (card):**
  - Title: "Group Leaderboard (This Week)" (18px, bold, white)
  - Top 3 members (table, compact):
    - Row format: Rank | Avatar + Name | Points | Streak
    - Example: "1 🥇 | Sarah M. | 340 pts | 🔥 8 days"
    - User's row highlighted (if not in top 3): "You 🏅 | You | 245 pts | 🔥 12 days | [Arrow] #2 rank"
    - Motivation text: "You're 95 points away from 1st place! 2 more sessions this week!" (12px, green)
  - CTA: "View full leaderboard" (link)

- **Recent Sessions (card):**
  - Title: "Recent Sessions" (18px, bold, white)
  - Scrollable list (show 3, ellipsis for more):
    - Row format: Date | Words read | Accuracy | Time | [Arrow]
    - Example: "Today, 4:32 PM | 2,144 words | 92% | 42m" (14px, gray)
    - Hover: highlighted background, clickable (resume session)

**Bottom Section (Character & CTA):**
- Optional animated character (fox, robot, etc.) in corner:
  - Reaction based on dashboard state:
    - Good streak: thumbs up, smile, "Keep it up!"
    - Streak at risk: concerned, pointing at timer, "Don't break your streak!"
  - Toggle: off by default, can enable in settings
- **Primary CTA:** "Start Session" (green button, 48px, full width on mobile)
- **Secondary CTA:** "Upload New PDF" (outline button)

**Mobile Responsive:**
- Single column, full width
- Cards stack vertically
- Leaderboard shows top 1 + user rank
- Character smaller or hidden on very small screens

---

### Screen 9: Weekly Leaderboard (Study Group)

**Layout:**
- Full screen, dark background
- Top bar: back button, "Group Leaderboard" title (28px, bold, white), date range selector (dropdown: "This Week", "Last Week", "Last Month")

**Leaderboard Header:**
- Group name: "Dr. Smith's MCAT Biology" (24px, bold, white)
- Member count: "5 members studying" (14px, gray)
- Period indicator: "📊 This Week's Rankings (June 17–23)" (16px, green) + reset timer "Resets in 2 days" (12px, orange accent)
- Weekly theme: "Earn points via sessions (words read + accuracy bonus + MCQ bonus)" (12px, gray)

**Leaderboard Table:**
- Headers: Rank | Member | Points | Streak | Level | Recent Activity
- Column widths: responsive (full width on mobile, 2-3 key columns shown)
- Rows (example data):

| Rank | Member | Points | Streak | Level | Recent |
|------|--------|--------|--------|-------|--------|
| 1 🥇 | Sarah M. | 450 pts | 🔥 8d | Lvl 5 | 2 min ago |
| 2 🥈 | Marcus K. | 320 pts | 🔥 5d | Lvl 4 | 45 min ago |
| 3 🥉 | Jessica T. | 280 pts | 🔥 3d | Lvl 4 | 1 hr ago |
| 4 | You (Alex) | 245 pts | 🔥 12d | Lvl 4 | Now |
| 5 | Jordan R. | 180 pts | 🔥 2d | Lvl 3 | 3 hrs ago |

**Styling:**
- Rank 1–3: Gold/silver/bronze background tint (subtle, 5% opacity)
- Current user row: green border left (4px), highlighted background (10% opacity green)
- Hover: row background darkens 5%, slight lift shadow
- Points: green text (16px, bold)
- Streak: green flame icon + number
- Recent activity: gray text (12px, e.g., "2 min ago", "Now")

**Tied Ranks:**
- If tied points: show "T-1", "T-2" (tied ranking notation)
- Sort secondarily by most recent session (latest first)

**Bottom Section (Challenge & Archive):**
- **Active Challenge Card (if applicable):**
  - Title: "📢 Weekly Challenge" (18px, bold, white)
  - Challenge text: "Read 5,000 words this week" (14px, white)
  - Progress bar: "3,200 / 5,000 words" (14px, gray) + "64% to completion" (12px, green)
  - Badge reward: "⚡ Accuracy Master" (icon + name)
  - CTA: "View challenge details" (link)

- **Historical Rankings (Archive):**
  - "View previous weeks" (link) → Expands or navigates to archive (shows past week leaderboards)

- **Member Actions (on hold/swipe, mobile):**
  - View member profile (click on row)
  - Message member (icon, mobile)

**Mobile Responsive:**
- Table condenses: Rank | Member | Points (highlighted in green)
- Streak/Level shown as inline (smaller font)
- Horizontal scroll for full table on smaller screens
- Challenge card full width

---

### Screen 10: Session Summary with Engagement Celebrations

**Expanded Header:**
- "Session Complete!" (32px, bold, white, center)
- Celebratory animation: confetti burst (CSS), optional celebratory sound
- Optional character reaction: celebratory dance, confetti burst around character

**Main Summary Cards (Organized by Engagement Theme):**

**Section 1: Learning Progress**
- **Words Read:**
  - Large number: "2,144" (56px, white, bold)
  - Label: "words read" (14px, gray)
  - Points earned: "+180 points earned" (16px, green, bold) animated counter
  - Level progress: "Level 4 → 67/250 pts" (14px, gray) with fill animation

- **Transcription Accuracy:**
  - Large percentage: "92.3%" (56px, green, bold)
  - Label: "accuracy" (14px, gray)
  - PR notification (if new): "🏆 New Personal Record! (+2.1%)" (16px, green accent, toast-style)
  - Trend: small sparkle animation or arrow indicator (↑ +2.1%)

- **MCQ Performance:**
  - Percentage: "86%" (40px, white, bold)
  - Label: "correct answers" (12 / 14, 14px, gray)
  - Skill badge (if ≥80%): "Quiz Master" badge preview (40×40px icon)

**Section 2: Engagement Metrics**
- **Time Invested:**
  - "42 minutes 15 seconds" (24px, white)
  - Passages completed: "5 / 8 passages" (14px, gray) with progress bar

- **Streak Status:**
  - Prominent green badge: "🔥 12-day Streak!" (24px, bold, green)
  - Countdown: "Your streak resets in 18 hours" (12px, orange accent) with countdown timer
  - Tip: "Complete 1 session tomorrow to keep your streak alive!" (12px, gray, italic)

**Section 3: Milestone Notifications**
- **Level-Up (if applicable):**
  - Full-screen glow effect (background shimmer), banner: "✨ Level 5!" (32px, bold, green)
  - Animation: level icon fill from bottom
  - Celebration text: "You've reached a new milestone!" (16px, white)
  - Sound: celebratory chime (optional, can mute)

- **Badge Earned (if applicable):**
  - Badge card: large badge icon (80×80px), name, description, date earned
  - Example: "🎖️ Accuracy Ace" | "Achieved 95%+ transcription accuracy" | "Earned today"
  - CTA: "Share this achievement" (link) → copies share text to clipboard

- **Personal Record (if broken):**
  - Toast notification style: "🏆 New PR!" (16px, green)
  - Metric: "Transcription Accuracy: 94.2%" (14px)
  - Improvement: "(+2.1% vs. previous best)" (12px, green)

**Section 4: Study Group Activity (if applicable)**
- **Leaderboard Snapshot:**
  - "You're ranked #2 in your study group this week!" (16px, white)
  - Top 3 members:
    - 1. Sarah M. 450 pts
    - 2. **You (Alex)** 245 pts ← highlighted
    - 3. Marcus K. 320 pts
  - Motivation: "You're 95 points away from 1st place! 2 more sessions this week!" (12px, green)
  - CTA: "View full leaderboard" (link)

**Action Buttons (Full Width on Mobile, Row on Desktop):**
- **Primary:** "Resume Session" (green, 48px, icon: ▶️) — loads next passage
- **Secondary:** "Start New Session" (green outline, 48px)
- **Tertiary:** "View Dashboard" (outline, 48px)
- **Optional links:** "View statistics", "Share summary", "View badges"

**Bottom Character Interaction (Optional):**
- Character animation (celebrates with user, gives thumbs up, or shows data chart)
- Dismissible (toggle in settings)

**Mobile Responsive:**
- Full-screen summary card
- Cards stack vertically
- Badges shown in carousel (swipeable)
- Buttons full width

---

---

## Component Reusable Styles

### Button Variants

**Primary Button (Green CTA)**
```
Background: #00D97D (or #10B981)
Text: white, 16px bold
Padding: 12px 24px
Border-radius: 6px
Height: 48px minimum
Hover: darken 10%, shadow lift
Active: darken 20%, inset shadow
Disabled: gray, opacity 50%
```

**Secondary Button (Outline)**
```
Background: transparent
Border: 1px solid #333
Text: white, 16px
Padding: 12px 24px
Border-radius: 6px
Hover: border green, text green
Active: border green, background fade green 5%
```

**Ghost Button (Link)**
```
Background: transparent
Text: green, 14px, underline on hover
Padding: 8px 0
Hover: text brightens
```

### Input Fields

**Text Input**
```
Background: #1A1A1A
Border: 1px solid #333
Border-radius: 6px
Padding: 12px 16px
Text: white, 16px
Placeholder: gray, opacity 60%
Focus: border green, shadow outline green 2px
Error: border red
```

### Modals

**Modal Overlay**
```
Background: #000000, opacity 95-98%
Backdrop-filter: blur(4px) optional
```

**Modal Card**
```
Background: #0F0F0F
Border-radius: 12px
Padding: 32px
Box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8)
Max-width: 500px (responsive down to 360px)
```

### Toast Notifications

**Success Toast**
```
Background: #1A1A1A, border 2px solid #00D97D
Text: white, 14px
Padding: 16px
Border-radius: 8px
Icon: checkmark, green
Auto-dismiss: 4 seconds
```

**Error Toast**
```
Background: #1A1A1A, border 2px solid #EF4444
Text: white, 14px
Padding: 16px
Border-radius: 8px
Icon: X, red
Auto-dismiss: 6 seconds
```

---

## Animation Standards

**Fade transitions:** 200ms ease-in-out
**Slide transitions:** 250ms ease-out
**Word highlight:** 100-150ms ease-out
**Button interactions:** 100ms ease-out (hover), 50ms (click)
**Progress cylinder:** smooth drain, no discrete steps
**Card carousel:** 300ms fade between cards

---

## Responsive Breakpoints

**Mobile (320px - 480px):**
- Single column layout
- Full-width modals
- Larger touch targets (48px minimum)
- Hide non-essential sidebars

**Tablet (481px - 1024px):**
- 2-column layout
- Condensed sidebars
- Modals 80% width

**Desktop (1025px+):**
- Full 4-column layout (where applicable)
- All sidebars visible
- Modals 500px fixed width

---

## Accessibility Requirements (WCAG 2.1 AA)

**Color Contrast:**
- All text on background: minimum 4.5:1 (AA); aim for 7:1 (AAA)
- White on dark: ✅ 21:1
- Green text on dark: ✅ 10:1

**Interactive Elements:**
- All buttons: minimum 48px × 48px touch target
- Keyboard focus: visible outline (green, 2px)
- Tab order: logical, left-to-right, top-to-bottom

**Semantic HTML:**
- Form labels associated with inputs (`<label for="...">`)
- Heading hierarchy: H1 → H2 → H3
- ARIA labels on icon-only buttons
- Live regions for dynamic content (MCQ feedback, toasts)

**Screen Readers:**
- Button text descriptive ("Sign Up" not "Click here")
- Form error messages announced
- Modal announced as dialog with role="alertdialog" for critical messages

---

## Implementation Notes for Developers

1. **Component library:** Consider Shadcn/ui or Radix UI for accessible base components with dark theme
2. **Animation library:** Framer Motion for smooth word highlighting and transitions
3. **Form handling:** React Hook Form + Zod for validation
4. **State management:** Zustand or Jotai for session/user state
5. **PDF rendering:** pdf.js with custom styling
6. **Speech recognition:** Deepgram WebSocket with error boundaries
7. **Tailwind CSS:** Use dark mode config (`dark:` prefix) + custom color palette in `tailwind.config.ts`

---

**End of Screen Design Prompt**
