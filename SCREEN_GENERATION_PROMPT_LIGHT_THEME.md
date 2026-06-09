# RETREIVE UI/UX Screen Design Prompt for Figma/Stitch (Light Theme - Minimalist Health)

**Design System Foundation**

Use this comprehensive prompt with Figma, Stitch, or any design tool to generate high-fidelity screens for RETREIVE using a light, minimalist health-inspired aesthetic.

---

## Design System Overview

**Color Palette (Minimalist Health Theme):**
- **Primary Background:** White (#FFFFFF)
- **Secondary Background:** Off-white (#FAFAFA)
- **Surface Container:** Light gray (#F3F3F3)
- **Primary text:** Charcoal (#1A1C1C or #2D2D2D)
- **Secondary text:** Mid-gray (#757575 or #3C4A3F)
- **Dividers/Borders:** Light border (#EEEEEE or #E2E2E2)
- **Accent (highlight/CTA):** Bright green (#00D97D) - primary action indicator
- **Success (MCQ correct):** Green (#00D97D)
- **Error/Alert:** Red (#BA1A1A)
- **Outline/Focus:** Green focus ring (#00D97D with soft glow)

**Typography (Inter Font Family):**
- **Display Large (48px):** Bold, -0.02em letter spacing (headlines)
- **Headline Large (32px):** Semi-bold, -0.01em letter spacing
- **Headline Large Mobile (28px):** Semi-bold
- **Headline Medium (24px):** Semi-bold, 32px line height
- **Body Large (18px):** Regular, 28px line height
- **Body Medium (16px):** Regular, 24px line height (standard body text)
- **Body Small (14px):** Regular, 20px line height
- **Label Medium (14px):** Medium weight, 16px line height, 0.01em tracking
- **Label Small (12px):** Semi-bold, 16px line height, 0.05em tracking

**Spacing & Layout:**
- Base unit: 8px
- Container max-width: 1280px
- Gutter: 24px
- Margin desktop: 64px
- Margin mobile: 20px
- Card padding: 24px minimum (prefer 32px for breathing room)
- Border radius: 4px (buttons/inputs), 8px (cards/containers)

**Elevation & Depth:**
- Primary background: #FFFFFF
- Secondary surfaces: #FAFAFA
- Cards/Containers: 1px border (#EEEEEE), soft-glow shadow: `0px 4px 20px rgba(0, 0, 0, 0.04)`
- Hover state: Transition to soft-glow shadow + slight lift
- Focus state: 1px green border + 2px outer green glow

**Buttons:**
- Primary CTA: Solid #00D97D background, white text, 4px radius, no gradient
- Secondary: Ghost style with #EEEEEE border, charcoal text, 4px radius
- Disabled: Gray background (#DADADA) + 50% opacity

---

## Screen Designs (10 Core Screens - Light Theme)

### Screen 1: Landing Page with Opening Cards Carousel

**Layout:**
- Full-screen background (white #FFFFFF)
- Center: large animated carousel card
- Card dimensions: 320px × 480px (mobile-optimized)
- Card background: white with subtle 1px border (#EEEEEE), soft shadow

**Content:**
- **Top (emoji):** Large emoji (80-100px), centered, e.g., 🧠 for brain-related card
- **Title:** "Why Reading Aloud Improves Retention" (28px, semi-bold, charcoal #2D2D2D, center)
- **Body:** "When you speak, you engage 3 brain regions simultaneously: visual (reading), motor (speaking), and auditory (hearing yourself). This triple engagement strengthens memory encoding, increasing retention by up to 40% compared to silent reading." (16px, regular, mid-gray #757575, center, max-width 280px)
- **Dismiss hint:** "Tap anywhere to continue" (12px, mid-gray, italic, bottom center)

**Interactions:**
- Auto-advance card every 5 seconds OR on tap
- Smooth fade transition between cards
- Dot indicator at bottom showing current card (10 dots total)
- Active dot: green (#00D97D); inactive: light gray (#DADADA)

**States:**
1. Card 1: Brain emoji, retention psychology
2. Card 2: Hearing icon, auditory learning benefits
3. Card 3: Microphone icon, active engagement
4. Card 4: Clock icon, time efficiency
5. Card 5: Brain waves, neural pathways strengthened
6. Card 6: Speech bubble, verbalization importance
7. Card 7: Chart, measurable improvement
8. Card 8: Check mark, confidence boost
9. Card 9: Repeat cycle indicator
10. Card 10: Call-to-action card: "Ready to study smarter?"

**Mobile Responsive:**
- Full screen, center card
- Landscape mode: smaller card, side navigation dots

---

### Screen 2: Frictionless Multi-Method Signup (Google OAuth Primary) - Light Theme

**Layout:**
- Full-screen white background (#FFFFFF)
- Center signup card (320px width on mobile)
- Hero section: Student reading aloud with celebration confetti (illustration or video)
- Generous padding (40px desktop, 20px mobile)

**Content:**
- **Headline:** "Speak Your Way to MCAT Mastery" (32px, semi-bold, charcoal #2D2D2D, center)
- **Subheading:** "Read aloud, remember more. Free first session." (16px, regular, mid-gray #757575, center, max-width 280px)
- **Hero image:** Illustration (240px × 320px): student with headphones, speech wave, confetti burst

**Primary Signup Button (DOMINANT):**
- **CTA:** "Sign in with Google" (large green button, Google logo on left, 56px height, full emphasis)
  - Button text: "Sign in with Google"
  - Background: Bright green (#00D97D)
  - Width: 240px (centered)
  - Icon: Google logo (20px, left margin)
  - Font: 16px, bold, white
  - Hover: Slightly darker green (#00B857), subtle lift shadow
  - Active: Darker green (#009D4D)
  - Tap/Click: Redirect to Google OAuth

**Trust Signal (below Google button):**
- "Secure login • No password required" (12px, mid-gray #757575, italic, center)

**Divider:**
- Horizontal line (1px, #EEEEEE) with centered text "OR" (12px, mid-gray) on each side

**Secondary Signup Options (below divider - smaller, less prominent):**

**Option 1: Email & Password**
- **Button:** "Sign up with Email" (gray outline, 48px height, full width)
  - Background: transparent
  - Border: 1px solid #EEEEEE
  - Text: charcoal #2D2D2D, 14px
  - Icon: envelope icon (left, 16px, mid-gray)
  - Hover: border → #DADADA, slight background lift
  - Tap/Click: Expands to email/password form (inline)

**Option 2: Phone Number & OTP**
- **Button:** "Sign up with Phone" (gray outline, 48px height, full width)
  - Background: transparent
  - Border: 1px solid #EEEEEE
  - Text: charcoal #2D2D2D, 14px
  - Icon: phone icon (left, 16px, mid-gray)
  - Hover: border → #DADADA, slight background lift
  - Tap/Click: Expands to phone input + OTP form (inline)

**Form Expansion (Email Option):**
- **When clicked, "Sign up with Email" expands inline:**
  - **Email input field:**
    - Placeholder: "your@email.com" (mid-gray #757575)
    - Icon: envelope (left, mid-gray)
    - Background: #FFFFFF
    - Border: 1px solid #EEEEEE
    - Height: 48px
    - Focus: 1px solid #00D97D border + 2px outer green glow
    - Padding: 12px 16px
    - Font: 16px, charcoal
  - **Password input field:**
    - Placeholder: "At least 8 characters" (mid-gray)
    - Icon: lock (left, mid-gray)
    - Show/hide toggle (eye icon, right, mid-gray)
    - Background: #FFFFFF
    - Border: 1px solid #EEEEEE
    - Height: 48px
    - Focus: 1px solid #00D97D border + 2px outer green glow
    - Padding: 12px 16px
  - **"Create Account" button** (green #00D97D, 48px, full width, white text)
  - **"Back" link** (14px, green #00D97D, underline) to collapse

**Form Expansion (Phone Option):**
- **When clicked, "Sign up with Phone" expands inline:**

  **Stage 1: Phone Number Entry**
  - **Phone input field:**
    - Placeholder: "+1 (555) 123-4567" (mid-gray)
    - Icon: phone (left, mid-gray)
    - Auto-format phone number
    - Background: #FFFFFF
    - Border: 1px solid #EEEEEE
    - Height: 48px
    - Focus: 1px solid #00D97D border + 2px outer green glow
  - **"Send OTP" button** (green #00D97D, 48px, full width, white text)
  - **"Back" link** (14px, green #00D97D, underline) to collapse

  **Stage 2: OTP Verification (after "Send OTP" clicked)**
  - Status: "OTP sent to +1 (555) 123-4567" (12px, mid-gray #757575, center)
  - **OTP input fields (6 single-digit boxes):**
    - Each box: 40×40px, centered, auto-focus next box on digit entry
    - Background: #FFFFFF
    - Border: 1px solid #EEEEEE
    - Focus: 1px solid #00D97D border + green glow
    - Font: 24px, monospace, charcoal, center
    - Auto-submit when all 6 digits filled
  - **Resend OTP link** (12px, green #00D97D, underline, below):
    - "Didn't receive? Resend in 45s" (countdown timer)
    - Becomes clickable at 0s
  - **"Back" link** (14px, mid-gray) to return to phone input

**Mobile Responsive:**
- Full screen, center card
- Buttons and inputs span 90% width on mobile
- Hero image scales proportionally
- Form expansion stacks vertically

**Validation & Error States:**

**Email Validation:**
- Email format: "Please enter a valid email" (error text, red #BA1A1A, 12px, below field)
- Password length: "At least 8 characters required" (error text, red #BA1A1A, 12px)
- Success: green checkmark icon next to field

**Phone Validation:**
- Phone format auto-corrects (e.g., "555 123 4567" → "+1 (555) 123-4567")
- If invalid country code: "Please enter a valid phone number" (error text, red #BA1A1A, 12px)

**OTP Validation:**
- If OTP incorrect: "Incorrect code. Please try again." (error toast, red #BA1A1A border, 1px, auto-dismiss after 4s)
- If OTP expired: "Code expired. Request a new one." (error toast) + auto-show "Resend OTP" button

**Loading States:**
- Email signup: "Creating account..." (button shows spinner, green #00D97D)
- Phone OTP send: "Sending code..." (button shows spinner, green #00D97D)
- OTP verification: Auto-submit when all digits filled + show spinner

**Key UX Principles:**
- ✅ **Google first, alternatives available:** Dominant green button for fastest path
- ✅ **Progressive disclosure:** Email/phone options below divider, less visual weight
- ✅ **Seamless expansion:** Forms expand inline without leaving page
- ✅ **Mobile-friendly:** Large touch targets (48px), auto-formatting for phone
- ✅ **Light theme clarity:** High contrast (white bg, charcoal text) ensures readability
- ✅ **Accessibility:** Clear error messages, keyboard navigation, ARIA labels

---

### Screen 3: Dashboard (Post-Signup, First-Time Blank State) - Light Theme

**Layout:**
- Header bar: top, white background #FFFFFF with 1px border #EEEEEE
- Left sidebar: navigation (future)
- Center: upload area + engagement metrics
- Background: #FAFAFA (subtle off-white)

**Header:**
- **Logo/title:** "RETREIVE" (20px, semi-bold, green #00D97D, left)
- **User metrics bar:** Streak: 🔥 0 | Level: 1 | Recent: — (right side, 12px, mid-gray #757575)
- **User menu:** Avatar circle (40px) + dropdown (right), show name, settings, logout

**Main Content:**
1. **Engagement Metrics (First-time blank state)**
   - **Streak card:** 1px border #EEEEEE, white background, 24px padding
     - 🔥 0 | "Start reading to build your streak" (mid-gray #757575, 14px)
   - **Level card:** 1px border #EEEEEE, white background, 24px padding
     - Level 1 | "0/100 pts" (charcoal #2D2D2D, 14px, with progress bar: 0% filled green)
   - **Optional character:** Small animated character in corner (e.g., fox) with greeting: "Hey! Ready to study?" (can be toggled off)

2. **Upload Section (Prominent CTA)**
   - Card with dashed border (2px, green #00D97D), background: #FAFAFA
   - Icon: large cloud upload icon (64px, green #00D97D, center)
   - Text: "🚀 Upload your study PDF to start your first free session!" (20px, semi-bold, charcoal #2D2D2D, center)
   - Subtext: "Drag & drop or click to browse (PDF, max 50 MB)" (14px, mid-gray #757575, center)
   - Area dimensions: 240px height, 360px width (mobile responsive)
   - Border-radius: 8px
   - Hover state: green border intensifies, background lightens to #FFFFFF, cursor pointer, soft shadow

3. **File selector (hidden input)**
   - Accept: .pdf only
   - Multi-file: No (single upload initially)

4. **Progress Bar (conditional, during upload)**
   - Shows when file uploading
   - Green bar (#00D97D) filling left-to-right
   - Background: #E8E8E8
   - Percentage text: "45% uploaded" (12px, charcoal, center)
   - Cancel button next to bar

5. **Recent Sessions List (below upload)**
   - If no sessions: empty state icon (📚) + "No sessions yet. Your free session awaits!" (mid-gray #757575)
   - If sessions exist: list of past PDFs with stats
     - Each row: 1px border #EEEEEE, white background, 16px vertical padding
     - PDF name + date (charcoal #2D2D2D, 16px semi-bold)
     - Passages completed / total (mid-gray #757575, 12px)
     - Last read time ago (mid-gray, 12px)
     - "Resume" button (green #00D97D) or "Delete" (gray outline)

**Mobile Responsive:**
- Upload card full width
- Metrics stacked vertically at top
- Recent sessions as vertical stack

---

### Screen 4: PDF Upload & Passage Preview Modal - Light Theme

**Layout:**
- Full-screen modal overlay (white background #FFFFFF, 95% opacity, soft shadow)
- Center: white modal card (500px width on desktop, 360px on mobile)
- Border: 1px #EEEEEE
- Radius: 8px

**Header:**
- Title: "Parsing PDF..." (initially), then "Your passages are ready!" (20px, semi-bold, charcoal #2D2D2D)
- Close button (X, top right, mid-gray #757575)
- Bottom divider: 1px #EEEEEE

**Stages:**

**Stage 1: Upload in Progress**
- File name: "biology_chapter_3.pdf" (14px, charcoal)
- Progress bar: green #00D97D, animated fill (0-100%), background #EEEEEE
- Status text: "Extracting text..." → "Segmenting passages..." → "Parsing complete!" (12px, mid-gray #757575)
- Estimated time: "~2 seconds" (12px, mid-gray)

**Stage 2: Preview (Post-parse success)**
- **Passage list** (scrollable container, max-height 400px):
  - Each passage row:
    - Background: white, hover → #FAFAFA
    - **Index:** "Passage 1 of 8" (semi-bold, 14px, charcoal #2D2D2D)
    - **Preview:** First 100 characters + "..." truncated (14px, mid-gray #757575)
    - **Word count:** "412 words" (12px, mid-gray, right-aligned)
    - **Edit button:** pencil icon (optional, mid-gray)
    - **Divider line:** 1px #EEEEEE
    - Hover: slight background highlight, soft shadow

- **Confirmation buttons** (bottom, separated by 1px divider #EEEEEE):
  - **Primary:** "Start Reading (FREE!)" (bright green #00D97D, full width, 48px, semi-bold, white text)
  - **Secondary:** "Upload different PDF" (ghost style, 1px border #EEEEEE, charcoal text)

**Error State (if parsing fails):**
- Large error icon (⚠️, mid-gray)
- Title: "PDF parsing failed" (charcoal #2D2D2D, 20px, semi-bold)
- Message: "This PDF appears to be a scan. Please upload a text-based digital PDF or contact support." (14px, mid-gray #757575)
- Actions: "Retry" (green #00D97D) / "Upload different" (gray outline)

**Success State (post-confirmation):**
- Transition to Karaoke Reader screen (NO payment modal; first session is completely free)

---

### Screen 5: Karaoke Reader (Core Feature) - Light Theme

**Layout:**
- **Top bar:** Session info (passage number, timer, accuracy %)
- **Left sidebar:** Passage list (compact, collapsible)
- **Center:** Large passage text
- **Right sidebar:** Progress cylinder
- **Bottom bar:** Controls (play/pause, microphone status, next passage)
- Background: #FAFAFA

**Header Bar (top):**
- Background: white #FFFFFF, 1px border #EEEEEE below
- Left: "Passage 2 of 5" (14px, semi-bold, charcoal #2D2D2D)
- Center: Session timer "04:32" (16px, monospace, charcoal)
- Right: Accuracy % "82%" (14px, green #00D97D, semi-bold)

**Left Sidebar (Passage Navigator):**
- Background: white #FFFFFF, 1px border #EEEEEE right
- Scrollable list of passages (200px width on desktop, hidden on mobile)
- Current passage: highlighted in light green (#E8F5E9)
- Completed passages: green checkmark icon #00D97D
- Current passage: green dot #00D97D
- Future passages: mid-gray text #757575
- Each row clickable to jump (for review mode only, not during active reading)
- Hover: background #FAFAFA

**Center Content (Main Passage Text):**
- Background: white #FFFFFF
- Padding: 40px
- Font: 20px, regular, charcoal #2D2D2D
- Line height: 1.6
- Responsive: adjusts to screen size

**Word Highlighting Animation:**
- Unread words: charcoal #2D2D2D text
- Current word (just read): green #00D97D underline + light green background #F0F8F5, fade-in
- Previously read words: light green text #7FD99D (dim), fade-out
- Transition time: 100-150ms ease-out
- Word spacing: letter-spacing 0.5px for clarity

**Right Sidebar (Progress Cylinder):**
- Background: white #FFFFFF, 1px border #EEEEEE left
- Vertical cylinder visual (60px width, height = passage length proportional)
- Green filled portion at top (#00D97D, % complete)
- Light gray unfilled portion below (#DADADA)
- Numbers: "245/412 words" (12px, mid-gray #757575, centered below)
- Smooth drain animation as words are read
- Color gradient: green (#00D97D) → light gray (#DADADA)

**Bottom Control Bar:**
- Background: white #FFFFFF, 1px border #EEEEEE above
- Padding: 16px
- Left side:
  - **Play/Pause button:** 56px circle, green #00D97D when recording, mid-gray #757575 when paused
  - **Microphone status:** icon + text ("Recording..." or "Paused" or "Ready"), charcoal #2D2D2D
- Center:
  - **Confidence score:** "91% confident" (12px, mid-gray #757575, if available)
  - **Noise level indicator:** animated bars (4-5 bars, green #00D97D if clear, yellow if noisy)
- Right side:
  - **Next Passage button:** green outline #00D97D, 48px height, white text
  - **End Session button:** gray outline #EEEEEE, 48px height, charcoal text

**Mobile Layout:**
- Hide left sidebar (show icon to toggle)
- Reduce right sidebar (smaller cylinder, numbers inline)
- Bottom controls adapt to screen

**States:**

**State 1: Paused (before reading)**
- Play button large, green #00D97D, highlighted
- Text: "Ready to start? Click play to begin." (charcoal #2D2D2D, 14px)

**State 2: Recording (active)**
- Pause button visible (orange for contrast)
- Real-time highlights flowing
- Cylinder draining
- Microphone icon animated (pulsing)

**State 3: Complete passage**
- Button label changes to "Next Passage" (green #00D97D)
- Summary: "Great! 412 words read, 88% accuracy" (charcoal #2D2D2D, 14px)
- Auto-advance option: "Next passage in 3 seconds..." or manual button

**State 4: Deepgram error**
- Toast notification: "Speech recognition temporarily unavailable. Try again." (white text on red #BA1A1A background, 1px red border)
- Pause/retry buttons

---

### Screen 6: MCQ Modal (After Each Passage) - Light Theme

**Layout:**
- Full-screen overlay (white background #FFFFFF, 95% opacity)
- Center modal card: 500px width (mobile: 360px)
- Border: 1px #EEEEEE
- Radius: 8px
- Shadow: soft-glow shadow `0px 4px 20px rgba(0, 0, 0, 0.04)`

**Question Section:**
- **Header:** "Question 1 of 4" (12px, semi-bold, green #00D97D, top left)
- **Question text:** (20px, semi-bold, charcoal #2D2D2D, max-width 440px, center)
- Example: "Based on the passage, which of the following best explains why prokaryotes lack mitochondria?"

**Options (4 choices):**
- Each option is a card-style button (full width, 60px height, border-radius 8px)
- Default style: white background #FFFFFF, 1px border #EEEEEE, charcoal text #2D2D2D
- Hover: border → green #00D97D, slight background lift
- Selected (before answer): green border #00D97D + green text #00D97D, background light green #F0F8F5
- Layout: vertical stack, 12px gap between

**Answer States:**

**Correct Answer:**
- Transition to green background (light green #F0F8F5 or very light)
- Selected option highlighted with green border #00D97D and background
- Checkmark icon (48px, green #00D97D)
- **Nudge text:**
  - Heading: "Correct! 🎉" (24px, semi-bold, green #00D97D, center)
  - Explanation: "Prokaryotes evolved before the endosymbiotic event that introduced mitochondria. They rely on their cell membrane for energy production." (16px, regular, charcoal #2D2D2D, center, max-width 400px)
- **Button:** "Next question" (green #00D97D, 48px, white text)

**Incorrect Answer:**
- Transition to light pink/salmon background (light error background #FDE8E8 or similar)
- Correct option: green background #00D97D + white text
- Selected option: gray background #DADADA, charcoal text with strikethrough
- **X icon** (48px, red #BA1A1A, top center)
- **Nudge text:**
  - Heading: "Not quite right" (24px, semi-bold, charcoal #2D2D2D, center)
  - Explanation: "The correct answer is [option letter]. Reason: [nudge text]" (16px, regular, charcoal #2D2D2D, center)
- **Button:** "Next question" (green #00D97D outline, 48px, charcoal text)

**Loading state (fetching next question):**
- Spinner animation (green #00D97D)
- "Loading next question..." (12px, mid-gray #757575)

---

### Screen 7: Session Summary & Analytics - Light Theme

**Layout:**
- Full-screen page (no modal), white background #FFFFFF
- Header bar with session title
- Center: stats cards in grid layout
- Bottom: action buttons
- Margin: 64px desktop, 20px mobile

**Header:**
- Back button (left, mid-gray #757575)
- Title: "Session Summary" (28px, semi-bold, charcoal #2D2D2D)
- Date/time: "Today, 4:32 PM" (14px, mid-gray #757575)
- Bottom divider: 1px #EEEEEE

**Stats Cards Grid (4 columns on desktop, 2×2 on tablet, 1 column on mobile):**
- Each card: white background, 1px border #EEEEEE, 24px padding, 8px radius, shadow on hover

1. **Passages Completed**
   - Large number: "5" (48px, green #00D97D, semi-bold)
   - Label: "of 8 passages" (14px, mid-gray #757575)
   - Progress bar: 5/8 filled (green #00D97D background, light gray #DADADA unfilled)

2. **Total Words Read**
   - Large number: "2,144" (48px, charcoal #2D2D2D, semi-bold)
   - Label: "words read" (14px, mid-gray #757575)
   - Rate: "~25 words/min" (12px, mid-gray)

3. **Session Duration**
   - Large number: "42:15" (48px, charcoal #2D2D2D, semi-bold)
   - Label: "minutes and seconds" (14px, mid-gray #757575)

4. **Overall Accuracy**
   - Large number: "86%" (48px, green #00D97D, semi-bold)
   - Label: "transcription accuracy" (14px, mid-gray #757575)
   - Breakdown: "34 words unmatched" (12px, mid-gray)

5. **Average MCQ Accuracy**
   - Large number: "75%" (48px, charcoal #2D2D2D, semi-bold)
   - Label: "correct answers" (14px, mid-gray #757575)
   - Breakdown: "12 correct, 4 incorrect" (12px, mid-gray)

6. **Session Saved**
   - Icon: ✅ (green #00D97D)
   - Text: "Session saved — resume anytime" (14px, charcoal #2D2D2D)
   - Subtext: "Your progress synced to cloud" (12px, mid-gray #757575)

**Action Buttons (bottom, full width on mobile, row on desktop):**
- **Primary:** "Resume Reading" (green #00D97D, 48px height, white text, icon: ▶️)
- **Secondary:** "Start New Session" (green outline #00D97D, white background, 48px height)
- **Tertiary:** "View Dashboard" (gray outline #EEEEEE, white background, 48px height)

**Optional (Phase 1+):**
- "Download as PDF" (gray link #757575, 14px)
- "Share with tutor" (gray link #757575, 14px)

---

### Screen 8: Dashboard with Engagement Metrics - Light Theme

**Layout:**
- Full-screen, white background #FFFFFF
- Top bar: user avatar (small circle, initials), "Dashboard" title (28px, semi-bold, charcoal #2D2D2D), logout icon
- Main content: scrollable vertical stack, padding 40px desktop / 20px mobile

**Header Section (Engagement Prominence):**
- **Streak Card (highlighted):**
  - Background: light green #F0F8F5, 1px border #00D97D
  - Large flame emoji (64px) + "12" (48px, semi-bold, green #00D97D)
  - Label: "day streak" (16px, charcoal #2D2D2D)
  - Subtext: "🔥 Keep it alive! Resets in 18 hours." (14px, orange #FF9800 for urgency)
  - Small countdown timer visualization (ring progress indicator, 18 hours shown, green #00D97D)
  - Radius: 8px, padding: 32px

- **Level & Progress Card (below streak):**
  - Background: white #FFFFFF, 1px border #EEEEEE
  - "Level 4" (32px, semi-bold, charcoal #2D2D2D)
  - Progress bar: "67 / 250 points" (14px, mid-gray #757575)
  - Visual progress bar: 67% filled (green #00D97D gradient), background #DADADA
  - Subtext: "183 points to Level 5!" (14px, mid-gray #757575)
  - Icon: trophy (small, left of "Level", mid-gray)
  - Radius: 8px, padding: 24px

**Quick Stats Row (3 cards, 1px borders #EEEEEE):**
1. **Accuracy PR:** "94.2% 🏆" (24px, green #00D97D, semi-bold) + "New PR! (+2.1%)" (12px, green accent)
2. **Session Streak:** "5 sessions this week" (16px, charcoal #2D2D2D)
3. **Study Group:** "Dr. Smith's MCAT Biology" (14px, mid-gray #757575) + member count

**Engagement Widgets:**
- **Badges Section (horizontal scroll):**
  - Title: "Your Badges" (18px, semi-bold, charcoal #2D2D2D)
  - Horizontal scroll of earned badges (50×50px icons):
    - Badges with light background circle (#E8E8E8), green icon #00D97D
    - "Level 5" badge
    - "Streak Master (30 days)" badge
    - "Accuracy Ace (95%+)" badge
    - "Weekly Warrior" badge
  - On hover: show badge name + date earned, slight lift
  - Empty slot: "?" icon (locked, gray #DADADA) for next earnable badge
  - CTA: "View all badges" (green link #00D97D, 14px, underline)

- **Study Group Leaderboard Preview (card, white background, 1px border #EEEEEE):**
  - Title: "Group Leaderboard (This Week)" (18px, semi-bold, charcoal #2D2D2D)
  - Top 3 members (table, compact):
    - Row format: Rank | Avatar + Name | Points | Streak
    - Example: "1 🥇 | Sarah M. | 340 pts | 🔥 8 days" (14px, charcoal)
    - User's row highlighted (if not in top 3): light green background #F0F8F5, "You 🏅 | You | 245 pts | 🔥 12 days | [Arrow] #2 rank"
    - Motivation text: "You're 95 points away from 1st place! 2 more sessions this week!" (12px, green #00D97D)
  - CTA: "View full leaderboard" (green link #00D97D, 14px, underline)
  - Radius: 8px, padding: 24px

- **Recent Sessions (card, white background, 1px border #EEEEEE):**
  - Title: "Recent Sessions" (18px, semi-bold, charcoal #2D2D2D)
  - Scrollable list (show 3, ellipsis for more):
    - Row format: Date | Words read | Accuracy | Time | [Arrow]
    - Example: "Today, 4:32 PM | 2,144 words | 92% | 42m" (14px, mid-gray #757575)
    - Hover: highlighted background #FAFAFA, clickable (resume session)
    - Dividers: 1px #EEEEEE between rows

**Bottom Section (Character & CTA):**
- Optional animated character (fox, robot, etc.) in corner:
  - Reaction based on dashboard state:
    - Good streak: thumbs up, smile, "Keep it up!" (mid-gray #757575)
    - Streak at risk: concerned, pointing at timer, "Don't break your streak!"
  - Toggle: off by default, can enable in settings
- **Primary CTA:** "Start Session" (green #00D97D, 48px, full width on mobile, white text, semi-bold)
- **Secondary CTA:** "Upload New PDF" (outline, 1px border #EEEEEE, charcoal text)

**Mobile Responsive:**
- Single column, full width
- Cards stack vertically
- Leaderboard shows top 1 + user rank
- Character smaller or hidden on very small screens

---

### Screen 9: Weekly Leaderboard (Study Group) - Light Theme

**Layout:**
- Full screen, white background #FFFFFF
- Top bar: back button, "Group Leaderboard" title (28px, semi-bold, charcoal #2D2D2D), date range selector (dropdown)

**Leaderboard Header:**
- Background: light gray #FAFAFA, padding 24px
- Group name: "Dr. Smith's MCAT Biology" (24px, semi-bold, charcoal #2D2D2D)
- Member count: "5 members studying" (14px, mid-gray #757575)
- Period indicator: "📊 This Week's Rankings (June 17–23)" (16px, green #00D97D, semi-bold) + reset timer "Resets in 2 days" (12px, orange #FF9800)
- Weekly theme: "Earn points via sessions (words read + accuracy bonus + MCQ bonus)" (12px, mid-gray #757575)

**Leaderboard Table:**
- Headers: Rank | Member | Points | Streak | Level | Recent Activity (charcoal #2D2D2D, 12px semi-bold, all-caps tracking 0.05em)
- Background: white #FFFFFF, borders 1px #EEEEEE
- Column widths: responsive (full width on mobile, 2-3 key columns shown)
- Rows:

| Rank | Member | Points | Streak | Level | Recent |
|------|--------|--------|--------|-------|--------|
| 1 🥇 | Sarah M. | 450 pts | 🔥 8d | Lvl 5 | 2 min ago |
| 2 🥈 | Marcus K. | 320 pts | 🔥 5d | Lvl 4 | 45 min ago |
| 3 🥉 | Jessica T. | 280 pts | 🔥 3d | Lvl 4 | 1 hr ago |
| 4 | You (Alex) | 245 pts | 🔥 12d | Lvl 4 | Now |
| 5 | Jordan R. | 180 pts | 🔥 2d | Lvl 3 | 3 hrs ago |

**Styling:**
- Rank 1–3: light gold background tint (5% opacity gold/yellow)
- Current user row: green left border 4px #00D97D, light green background #F0F8F5
- Hover: row background → #FAFAFA, slight lift shadow
- Points: green text #00D97D (16px, semi-bold)
- Streak: green flame icon #00D97D + number (charcoal)
- Recent activity: mid-gray text #757575 (12px, e.g., "2 min ago", "Now")
- Row dividers: 1px #EEEEEE

**Tied Ranks:**
- If tied points: show "T-1", "T-2" (tied ranking notation, charcoal #2D2D2D)
- Sort secondarily by most recent session (latest first)

**Bottom Section (Challenge & Archive):**
- **Active Challenge Card (if applicable):**
  - Background: light green #F0F8F5, 1px border #00D97D
  - Title: "📢 Weekly Challenge" (18px, semi-bold, charcoal #2D2D2D)
  - Challenge text: "Read 5,000 words this week" (14px, charcoal)
  - Progress bar: "3,200 / 5,000 words" (14px, mid-gray) + "64% to completion" (12px, green #00D97D)
  - Badge reward: "⚡ Accuracy Master" (icon + name, green)
  - CTA: "View challenge details" (green link #00D97D, 14px)
  - Padding: 24px, radius: 8px

- **Historical Rankings (Archive):**
  - "View previous weeks" (green link #00D97D, 14px, underline) → Expands or navigates to archive

- **Member Actions (on hold/swipe, mobile):**
  - View member profile (click on row)
  - Message member (icon, mobile)

**Mobile Responsive:**
- Table condenses: Rank | Member | Points (highlighted in green #00D97D)
- Streak/Level shown as inline (smaller font)
- Horizontal scroll for full table on smaller screens
- Challenge card full width

---

### Screen 10: Session Summary with Engagement Celebrations - Light Theme

**Expanded Header:**
- Background: light green #F0F8F5, border-bottom 1px #00D97D
- "Session Complete!" (32px, semi-bold, charcoal #2D2D2D, center)
- Celebratory animation: confetti burst (CSS), optional celebratory sound
- Optional character reaction: celebratory dance, confetti burst around character

**Main Summary Cards (Organized by Engagement Theme, white background, 1px border #EEEEEE, padding 24px, radius 8px):**

**Section 1: Learning Progress**
- **Words Read:**
  - Large number: "2,144" (56px, green #00D97D, semi-bold)
  - Label: "words read" (14px, mid-gray #757575)
  - Points earned: "+180 points earned" (16px, green #00D97D, semi-bold) animated counter
  - Level progress: "Level 4 → 67/250 pts" (14px, mid-gray) with fill animation

- **Transcription Accuracy:**
  - Large percentage: "92.3%" (56px, green #00D97D, semi-bold)
  - Label: "accuracy" (14px, mid-gray #757575)
  - PR notification (if new): "🏆 New Personal Record! (+2.1%)" (16px, green #00D97D, toast-style background light green)
  - Trend: small sparkle animation or arrow indicator (↑ +2.1%, green)

- **MCQ Performance:**
  - Percentage: "86%" (40px, charcoal #2D2D2D, semi-bold)
  - Label: "correct answers" (12 / 14, 14px, mid-gray #757575)
  - Skill badge (if ≥80%): "Quiz Master" badge preview (40×40px icon)

**Section 2: Engagement Metrics**
- **Time Invested:**
  - "42 minutes 15 seconds" (24px, charcoal #2D2D2D, semi-bold)
  - Passages completed: "5 / 8 passages" (14px, mid-gray #757575) with progress bar (green)

- **Streak Status:**
  - Prominent green badge background light green #F0F8F5: "🔥 12-day Streak!" (24px, semi-bold, green #00D97D)
  - Countdown: "Your streak resets in 18 hours" (12px, orange #FF9800)
  - Tip: "Complete 1 session tomorrow to keep your streak alive!" (12px, mid-gray #757575, italic)

**Section 3: Milestone Notifications**
- **Level-Up (if applicable):**
  - Background: light green #F0F8F5, border 2px #00D97D
  - Banner: "✨ Level 5!" (32px, semi-bold, green #00D97D)
  - Animation: level icon fill from bottom
  - Celebration text: "You've reached a new milestone!" (16px, charcoal #2D2D2D)
  - Sound: celebratory chime (optional, can mute)

- **Badge Earned (if applicable):**
  - Badge card: large badge icon (80×80px), name, description, date earned
  - Background: white #FFFFFF, 1px border #EEEEEE
  - Example: "🎖️ Accuracy Ace" (20px, semi-bold, charcoal) | "Achieved 95%+ transcription accuracy" (14px, mid-gray) | "Earned today" (12px, green)
  - CTA: "Share this achievement" (green link #00D97D, 14px, underline)

- **Personal Record (if broken):**
  - Toast notification style: background light green #F0F8F5, border 1px #00D97D
  - "🏆 New PR!" (16px, green #00D97D, semi-bold)
  - Metric: "Transcription Accuracy: 94.2%" (14px, charcoal #2D2D2D)
  - Improvement: "(+2.1% vs. previous best)" (12px, green #00D97D)

**Section 4: Study Group Activity (if applicable)**
- **Leaderboard Snapshot:**
  - "You're ranked #2 in your study group this week!" (16px, charcoal #2D2D2D)
  - Top 3 members:
    - 1. Sarah M. 450 pts
    - 2. **You (Alex)** 245 pts ← highlighted light green #F0F8F5
    - 3. Marcus K. 320 pts
  - Motivation: "You're 95 points away from 1st place! 2 more sessions this week!" (12px, green #00D97D)
  - CTA: "View full leaderboard" (green link #00D97D, 14px)

**Action Buttons (Full Width on Mobile, Row on Desktop, margin-top 32px):**
- **Primary:** "Resume Session" (green #00D97D, 48px, white text, icon: ▶️, semi-bold)
- **Secondary:** "Start New Session" (green outline #00D97D, white background, 48px, charcoal text)
- **Tertiary:** "View Dashboard" (gray outline #EEEEEE, white background, 48px, charcoal text)
- **Optional links (below):** "View statistics" (green link #00D97D), "Share summary" (green link), "View badges" (green link)

**Bottom Character Interaction (Optional):**
- Character animation (celebrates with user, gives thumbs up, or shows data chart)
- Dismissible (toggle in settings)

**Mobile Responsive:**
- Full-screen summary card
- Cards stack vertically
- Badges shown in carousel (swipeable)
- Buttons full width

---

## Component Reusable Styles (Light Theme)

### Button Variants

**Primary Button (Green CTA)**
```
Background: #00D97D
Text: white, 16px semi-bold
Padding: 12px 24px
Border-radius: 4px
Height: 48px minimum
Hover: darken to #00B857, shadow lift
Active: darken to #009D4D, inset shadow
Disabled: #DADADA, opacity 50%
```

**Secondary Button (Outline)**
```
Background: transparent
Border: 1px solid #EEEEEE
Text: charcoal #2D2D2D, 16px
Padding: 12px 24px
Border-radius: 4px
Hover: border → #DADADA, background → #FAFAFA
Active: border green #00D97D, text green
```

**Ghost Button (Link)**
```
Background: transparent
Text: green #00D97D, 14px, underline on hover
Padding: 8px 0
Hover: text brightens to #22E285
```

### Input Fields

**Text Input**
```
Background: #FFFFFF
Border: 1px solid #EEEEEE
Border-radius: 4px
Padding: 12px 16px
Text: charcoal #2D2D2D, 16px
Placeholder: mid-gray #757575, opacity 70%
Focus: border green #00D97D, shadow green 2px glow
Error: border red #BA1A1A
```

### Modals

**Modal Overlay**
```
Background: #000000, opacity 30% (lighter for light theme)
Backdrop-filter: blur(4px) optional
```

**Modal Card**
```
Background: #FFFFFF
Border-radius: 8px
Border: 1px #EEEEEE
Padding: 32px
Box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04)
Max-width: 500px (responsive down to 360px)
```

### Toast Notifications

**Success Toast**
```
Background: #F0F8F5, border 1px solid #00D97D
Text: charcoal #2D2D2D, 14px
Padding: 16px
Border-radius: 4px
Icon: checkmark, green #00D97D
Auto-dismiss: 4 seconds
```

**Error Toast**
```
Background: #FDE8E8, border 1px solid #BA1A1A
Text: charcoal #2D2D2D, 14px
Padding: 16px
Border-radius: 4px
Icon: X, red #BA1A1A
Auto-dismiss: 6 seconds
```

---

## Animation Standards (Light Theme)

**Fade transitions:** 200ms ease-in-out
**Slide transitions:** 250ms ease-out
**Word highlight:** 100-150ms ease-out
**Button interactions:** 100ms ease-out (hover), 50ms (click)
**Progress cylinder:** smooth drain, no discrete steps
**Card carousel:** 300ms fade between cards
**Shadow lift:** 150ms ease-out on hover

---

## Responsive Breakpoints

**Mobile (<600px):**
- Single column layout
- Full-width modals (90% width)
- Larger touch targets (48px minimum)
- Hide non-essential sidebars
- Margin: 20px

**Tablet (600px - 1024px):**
- 2-column layout (where applicable)
- Condensed sidebars
- Modals 80% width
- Gutter: 24px

**Desktop (>1024px):**
- Full multi-column layout
- All sidebars visible
- Modals 500px fixed width
- Margin: 64px

---

## Accessibility Requirements (WCAG 2.1 AA - Light Theme)

**Color Contrast:**
- All text on background: minimum 4.5:1 (AA); aim for 7:1 (AAA)
- Charcoal on white: ✅ 21:1
- Green text on white: ✅ 10:1
- Mid-gray on white: ✅ 6.5:1

**Interactive Elements:**
- All buttons: minimum 48px × 48px touch target
- Keyboard focus: visible outline (green #00D97D, 2px)
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

## Implementation Notes for Developers (Light Theme)

1. **Component library:** Consider Shadcn/ui or Radix UI for accessible base components with light theme
2. **Animation library:** Framer Motion for smooth word highlighting and transitions
3. **Form handling:** React Hook Form + Zod for validation
4. **State management:** Zustand or Jotai for session/user state
5. **PDF rendering:** pdf.js with custom styling (light theme colors)
6. **Speech recognition:** Deepgram WebSocket with error boundaries
7. **Tailwind CSS:** Use light mode config (default) + custom color palette in `tailwind.config.ts`
8. **Font:** Import Inter from Google Fonts or Fontsource

---

**End of Light Theme Screen Design Prompt**
