# RETREIVE — Duolingo-Inspired Design System

This design system is inspired by the playful, gamified, high-contrast, and tactile aesthetic of modern educational applications (like Duolingo). It uses a vibrant light theme, bold borders, distinct 3D-like tactile buttons, and rounded card surfaces to maximize readability and engagement for pre-med students preparing for the MCAT.

---

## 1. Typography

*   **Primary Font Family:** `Plus Jakarta Sans`, sans-serif (clean, friendly, high legibility)
*   **Secondary Font Family:** `Inter`, sans-serif (for compact tables, stats, and interface labels)

### Typography Scale

| Token | Size | Line Height | Weight | Letter Spacing | Context / Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | `48px` (36px mobile) | `56px` | `800` (Extra Bold) | `-0.02em` | Main hero titles (e.g., Landing Hero) |
| `headline-lg` | `32px` (28px mobile) | `40px` | `800` (Extra Bold) | `-0.01em` | Section headers (e.g., "Weekly Study Group") |
| `headline-md` | `24px` | `32px` | `700` (Bold) | `0` | Subsection headers, modal titles, card titles |
| `body-lg` | `18px` | `28px` | `500` (Medium) | `0` | Subheadings, intro text, block quotes |
| `body-md` | `16px` | `24px` | `500` (Medium) | `0` | Main text blocks, form text, settings options |
| `label-bold` | `14px` | `20px` | `700` (Bold) | `0.05em` | Button labels, badges, table column headers |
| `caption` | `12px` | `16px` | `500` (Medium) | `0` | Subtext, timestamps, info messages |

---

## 2. Colors

The color palette consists of a clean light grey/white background canvas contrasted with vibrant brand colors (Green, Blue, Gold) and structural dark charcoal text.

### Brand & Interactive Colors

```css
:root {
  /* Canvas & Base Neutrals */
  --color-bg: #FAF9F9;                      /* Primary light background canvas */
  --color-surface-lowest: #FFFFFF;          /* Cards, input fields, sidebar backgrounds */
  --color-surface-container: #EEEEED;       /* Divider lines, disabled states */
  --color-surface-container-low: #F4F3F3;   /* Alternate list item backgrounds */
  --color-surface-container-high: #E9E8E8;  /* Hover background overlay */
  --color-surface-container-highest: #E3E2E2;/* Pressed state overlay */

  /* Text Colors */
  --color-text-primary: #1A1C1C;            /* Headers, critical text contrast */
  --color-text-secondary: #5F6A59;          /* Subtext, secondary descriptors */
  --color-text-tertiary: #A6A6A6;           /* Timestamps, disabled text placeholders */

  /* Primary Brand (Duolingo Green) */
  --color-brand-green: #58CC02;             /* Vibrant accent green for CTAs & highlights */
  --color-brand-green-hover: #61E002;       /* Hover state (slightly brighter) */
  --color-brand-green-border: #2B6C00;      /* Dark green for 3D buttons and text contrast */
  --color-brand-green-light: #E8F9DB;       /* Light tint green for active list/menu items */

  /* Secondary Brand (Sky Blue) */
  --color-brand-blue: #2FB8FF;              /* Accent blue for progress indicators & actions */
  --color-brand-blue-hover: #40C4FF;        /* Hover blue */
  --color-brand-blue-border: #006590;       /* Dark blue for 3D buttons and active state depth */
  --color-brand-blue-light: #E0F5FF;        /* Light blue tint background */

  /* Tertiary Brand (Gold) */
  --color-brand-gold: #FFC800;              /* Leaderboard Rank 1, streaks, milestone icons */
  --color-brand-gold-border: #755B00;       /* Gold text contrast and borders */
  --color-brand-gold-light: #FFF9E0;        /* Light gold background tint */

  /* Errors & Destructive Actions */
  --color-error: #BA1A1A;                   /* Badges, countdowns, delete buttons */
  --color-error-hover: #FF4D4D;             /* Error hover state */
  --color-error-border: #93000A;            /* 3D button border for delete/reset actions */
  --color-error-light: #FFDAD6;             /* Background tint for errors */
}
```

---

## 3. Spacing & Grid

A strict spacing system keeps alignment predictable and consistent, with generous padding values to match the spacious, approachable aesthetic.

*   **Base Grid Unit:** `4px`

| Token | Rem Value | Pixel Value | Typical Application |
| :--- | :--- | :--- | :--- |
| `xs` | `0.25rem` | `4px` | Text gap, minor element offsets |
| `sm` | `0.75rem` | `12px` | Label-to-input gap, icon spacing inside buttons |
| `md` | `1.5rem` | `24px` | Standard page padding, grid gutters, card padding |
| `lg` | `3.0rem` | `48px` | Outer screen margins, major component separation |
| `xl` | `5.0rem` | `80px` | Hero section top/bottom padding |

### Grid Layouts

*   **Desktop Layout (1025px+):**
    *   Centered container with max-width `1200px`.
    *   Left-fixed navigation rail: `256px` wide.
    *   Main content grid: 12 columns with `24px` gutters.
*   **Tablet Layout (481px - 1024px):**
    *   Gutter spacing: `16px`.
    *   Left navigation rail collapses to icon-only (`80px` wide).
    *   Main content grid: 8 columns.
*   **Mobile Layout (320px - 480px):**
    *   Gutter spacing: `12px`.
    *   Margins: `16px`.
    *   Left navigation rail moves to bottom navigation bar (`72px` height).
    *   Main content grid: 4 columns.

---

## 4. Reusable Interactive Components

### 4a. Tactile 3D Buttons

Buttons are styled with a physical "thickness" (a border-bottom acting as a depth shadow). When hover occurs, they elevate or brighten slightly. When clicked, they animate down (`translate-y`) and lose their bottom border thickness to create a satisfying, springy press effect.

```html
<!-- Green Primary Button -->
<button class="relative rounded-xl font-label-bold text-white px-6 py-3 bg-[#58CC02] border-b-4 border-[#2B6C00] transition-all hover:bg-[#61E002] active:border-b-0 active:translate-y-1">
  GET STARTED
</button>

<!-- Blue Secondary Button -->
<button class="relative rounded-xl font-label-bold text-white px-6 py-3 bg-[#2FB8FF] border-b-4 border-[#006590] transition-all hover:bg-[#40C4FF] active:border-b-0 active:translate-y-1">
  STUDY NOW
</button>

<!-- White Outline Button -->
<button class="relative rounded-xl font-label-bold text-[#5F6A59] px-6 py-3 bg-white border-2 border-[#E5E5E5] border-b-4 hover:border-[#CCCCCC] hover:text-[#1A1C1C] active:border-b-2 active:translate-y-[2px]">
  I HAVE AN ACCOUNT
</button>

<!-- Red Destructive Button -->
<button class="relative rounded-xl font-label-bold text-[#BA1A1A] px-6 py-3 bg-[#FFDAD6] border-2 border-[#BA1A1A] border-b-4 hover:bg-[#FFC6C2] active:border-b-2 active:translate-y-[2px]">
  DELETE ACCOUNT
</button>
```

### 4b. Form Controls & Inputs

Form elements are large, clean, and use bold gray borders that transition to green on active focus state.

*   **Input Fields:**
    *   `height`: `56px` (tall, easy-to-tap targets)
    *   `border`: `2px solid #E5E5E5`
    *   `border-radius`: `16px`
    *   `background`: `#FFFFFF`
    *   `focus`: `border-color: #58CC02` or `#2B6C00` (outline none)
    *   `placeholder`: `#A6A6A6` (muted gray)

```html
<!-- TextInput -->
<div class="relative w-full">
  <input 
    type="text" 
    placeholder="Email Address" 
    class="w-full h-14 px-4 rounded-2xl border-2 border-[#E5E5E5] text-[#1A1C1C] placeholder-[#A6A6A6] font-body-md transition-colors focus:border-[#58CC02] focus:outline-none"
  />
</div>
```

*   **Sliders (Reader Font Size Selector):**
    *   Track: `#EEEEED`
    *   Fill (left of handle): `#58CC02`
    *   Handle: White circle, `#FAF9F9`, with `#BECBB1` shadow, `24px` diameter.

*   **Toggle Checkboxes (opt-in Mascot / FX):**
    *   Rounded square checkbox, custom tick mark filled with `#58CC02` when active.

---

## 5. Cards & Row Items

Cards represent grouped information blocks. They feature rounded corners, thick light borders, and absolute flat depth (no complex elevation gradients).

*   **Standard Card:**
    *   `background`: `#FFFFFF`
    *   `border`: `2px solid #E5E5E5`
    *   `border-radius`: `24px`
    *   `padding`: `24px`

```html
<!-- Standard Card Info Block -->
<div class="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 relative">
  <h4 class="font-headline-md text-[#1A1C1C] mb-2">Memory Decay</h4>
  <p class="font-body-md text-[#5F6A59]">Without active recall, you lose up to 70% of new medical information within 24 hours.</p>
</div>
```

*   **Leaderboard Row Card:**
    *   Pill shape (`border-radius: 9999px`)
    *   `border`: `2px solid #E5E5E5`
    *   `background`: `#FFFFFF`
    *   `height`: `80px`
    *   *Active User Highlight ("You"):*
        *   `background`: `#E8F9DB`
        *   `border-color`: `#58CC02`
        *   `text-color`: `#2B6C00`

---

## 6. Navigation Patterns

### Left Sidebar Navigation (Desktop)
*   **Dimensions:** Fixed width `256px`, full height `100vh`.
*   **Background:** `#FFFFFF` with a right border `2px solid #E5E5E5`.
*   **Logo:** `MedStudy` / `RETREIVE` in bold primary green (`#58CC02`), `24px` size, located at top.
*   **Menu Items:**
    *   Vertical stack with `8px` gap.
    *   Item size: `56px` height, rounded `16px`.
    *   *Default state:* Gray icon, gray text, transparent background.
    *   *Active state:* Bright green background (`#E8F9DB`), green border (`2px solid #58CC02` or `#2B6C00` left indicator), green text (`#2B6C00`), bold font.

### Bottom Navigation Bar (Mobile)
*   **Dimensions:** Fixed height `72px`, bottom of viewport.
*   **Background:** `#FFFFFF` with a top border `2px solid #E5E5E5`.
*   **Layout:** Flex container distributing 5 items (Learn, Review, Leaderboard, Shop, Profile) evenly.

---

## 7. Progress Indicators

### Horizontal Progress Bar (Milestones & Session progress)
*   Track background: `#EEEEED` (light gray), height `16px`, rounded `9999px`.
*   Progress fill: `#58CC02` (green) with a subtle shiny highlights edge, height 100%, rounded `9999px`.
*   Animation: Width transitions smoothly using `cubic-bezier(0.4, 0, 0.2, 1)` over `400ms`.

### vertical Progress Cylinder (Karaoke Reader progress)
*   Container: White-bordered transparent capsule, width `24px`, height `320px`, rounded `9999px`.
*   Cylinder fill: Animates dynamically from top to bottom (draining) using green gradient `#58CC02` to `#A3FF6E`.
