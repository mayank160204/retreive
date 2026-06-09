# STAGE 3: Asset Direction

**Project:** RETRIEVE MCAT Study App  
**Date:** May 31, 2026  
**Status:** In Progress  
**Dependencies:** ✅ Stages 0, 1, 2 Complete  
**Deliverable:** ASSET_PLAN.md

---

## Stage 3 Objective

Decide what visual assets (images, icons, videos, 3D, CSS) are needed for each section.

**Key Questions:**
- What assets will make the design memorable?
- What's the best source for each asset (generated, stock, custom, CSS)?
- What's the performance impact?
- What fallbacks exist if assets fail to load?

---

## Asset Inventory by Section

### LANDING PAGE ASSETS

#### Asset 1: Hero Illustration
**Purpose:** Landing page hero—visual centerpiece showing character reading aloud  
**Section:** Hero  
**Dimensions:** 1200×600px (desktop), 390×400px (mobile)  
**Type:** Animated illustration  
**Recommended Source:** Custom Figma illustration OR AI-generated (Midjourney/DALL-E)  
**File size target:** <100KB (WebP)  
**Animation:** Confetti burst on load (200ms)  
**Fallback:** Solid gradient background (#0F0F0F → #1A1A1A) with animated text  
**Priority:** MUST-HAVE (hero impact)  

**Spec:**
```
Show a student (diverse, relatable, age 18-25) reading from a 
document, with a microphone icon and speech wave visualization. 
Bright green highlight on key words. Confetti particles in 
background. Professional illustration style (not cartoon, not 
photorealistic—somewhere between).

Color palette: Dark background #0F0F0F, white clothing, green 
accents #00D97D, confetti multicolor (pink, blue, yellow, green).
```

---

#### Asset 2: How It Works Step Icons
**Purpose:** Illustrate upload, read, improve steps  
**Section:** How It Works (3-step)  
**Dimensions:** 200×200px each (3 icons)  
**Type:** SVG or simple PNG icons  
**Recommended Source:** Iconsax library OR custom SVG  
**File size target:** <20KB total (3 icons)  
**Animation:** Fade-in + slide on scroll  
**Fallback:** Text-based step numbers (1, 2, 3)  
**Priority:** SHOULD-HAVE (nice for visual hierarchy, not essential)  

**Spec:**
```
Icon 1: PDF with upload arrow (representing upload step)
Icon 2: Microphone with waveform (representing read step)
Icon 3: Checkmark with star (representing improve step)

Style: Minimalist line art, 4px stroke, green accent color.
Backgrounds: Circular, light gray #E8E8E8 or green highlight.
```

---

#### Asset 3: Feature 1 – Karaoke Reader Mockup
**Purpose:** Show the unique karaoke reader experience  
**Section:** Feature 1: Real-Time Karaoke Reader  
**Dimensions:** 800×600px (desktop)  
**Type:** Screenshot/mockup of reader interface  
**Recommended Source:** Custom screenshot from working app OR Figma mockup  
**File size target:** <80KB (WebP)  
**Animation:** None (static screenshot)  
**Fallback:** Placeholder with "Reader Preview" text  
**Priority:** MUST-HAVE (differentiator)  

**Spec:**
```
Show the reader interface:
- Minimal header: "[< Back] Passage 3/8"
- Large readable text: "The mitochondria is the powerhouse..."
- Words highlighted in real-time (bright green background)
- Progress bar at bottom (45% complete)
- Minimal controls: [🎤 Reading] [Pause]

Dark background #0F0F0F, white text, green highlights.
Frame as if taken directly from the app.
```

---

#### Asset 4: Feature 2 – Dashboard Mockup
**Purpose:** Show gamification: streak, level, leaderboard  
**Section:** Feature 2: Gamified Engagement  
**Dimensions:** 800×600px  
**Type:** Screenshot/mockup of dashboard  
**Recommended Source:** Figma mockup OR screenshot from app  
**File size target:** <80KB (WebP)  
**Animation:** Hover effects on cards (subtle background shift)  
**Fallback:** Placeholder with "Dashboard Preview" text  
**Priority:** MUST-HAVE (engagement proof)  

**Spec:**
```
Show dashboard with:
- Top section: Streak (🔥 12 days), Level (⭐ L8, XP bar), 
  Weekly words (📚 2,450)
- Middle: "Start New Session" green button, "Resume" card
- Bottom: Leaderboard preview (top 3 users, user highlighted)

Dark theme #0F0F0F, green accents, smooth shadows.
Cards should look clickable/interactive.
```

---

#### Asset 5: Feature 3 – Leaderboard Mockup
**Purpose:** Show competitive element  
**Section:** Feature 3: Social Leaderboards  
**Dimensions:** 800×400px  
**Type:** Screenshot/mockup of leaderboard  
**Recommended Source:** Figma mockup  
**File size target:** <60KB (WebP)  
**Animation:** None (static)  
**Fallback:** Text description of leaderboard concept  
**Priority:** SHOULD-HAVE (nice for context, not essential for conversion)  

**Spec:**
```
Show leaderboard table:
- Columns: Rank | Name | Points | Change
- 5 rows (rank 1–5)
- User "You" highlighted in green
- Up/down arrows for rank change
- Badges/medals for top 3 (🥇 🥈 🥉)

Dark background, green accents, clear typography.
```

---

#### Asset 6: Testimonial Avatars
**Purpose:** Add faces to social proof quotes  
**Section:** Social Proof (3 testimonials)  
**Dimensions:** 64×64px each (3 avatars)  
**Type:** Avatar images (circular)  
**Recommended Source:** Stock photos (Unsplash, Pexels) OR AI-generated avatars (Midjourney)  
**File size target:** <30KB total (3 avatars, optimized)  
**Animation:** None  
**Fallback:** Generic avatar placeholder (initials in circle)  
**Priority:** SHOULD-HAVE (trust signal, but not essential)  

**Spec:**
```
Avatar 1: Sarah, age ~22, diverse ethnicity, friendly smile
Avatar 2: Marcus, age ~23, diverse ethnicity, confident expression
Avatar 3: Jessica, age ~24, diverse ethnicity, approachable look

Circular crop (64×64px), clear, professional headshots.
No text overlay. Light border (#E8E8E8).
```

---

#### Asset 7: Pricing Page Illustration
**Purpose:** Illustrate pricing model (free vs. paid)  
**Section:** Pricing Card  
**Dimensions:** 400×300px  
**Type:** Simple comparison illustration  
**Recommended Source:** Custom SVG OR icon set  
**File size target:** <20KB  
**Animation:** None  
**Fallback:** Text-only pricing (no illustration)  
**Priority:** NICE-TO-HAVE (conversion still works without it)  

**Spec:**
```
Show two columns:
- Free: Single spark/light icon (limited)
- Paid: Multiple sparks/lightning bolts (unlimited)

Use green and gray colors. Simple, clean style.
Represents "more power" metaphor.
```

---

### APP SCREEN ASSETS

#### Asset 8: Badge Graphics (15 badges)
**Purpose:** Show achievements in badge gallery  
**Section:** App → Badge Gallery  
**Dimensions:** 100×100px each  
**Type:** PNG with alpha transparency (or SVG)  
**Recommended Source:** Custom design (Figma) OR AI-generated (Midjourney)  
**File size target:** <150KB total (15 optimized badges)  
**Animation:** Bounce on unlock (Framer Motion)  
**Fallback:** Text-based badge names (e.g., "First Session")  
**Priority:** MUST-HAVE (gamification core)  

**Badge list:**
```
1. First Session (bronze)
2. 7-Day Streak (fire emoji)
3. Level 5 (star)
4. 90% Accuracy (trophy)
5. 10K Points (crown)
6. Leaderboard Top 10 (medal)
7. Monthly Winner (gold)
8. 50 Sessions (milestone)
9. Perfect Session (checkmark)
10. Consistency (calendar)
11. Social Butterfly (friend group)
12. Quiz Master (brain)
13. Speedrun (lightning)
14. Weekend Warrior (rocket)
15. Milestone Master (star burst)
```

**Design guidelines:**
- Circular or shield shape (100×100px)
- Unique color per badge (use primary, secondary, tertiary colors from design system)
- Icon or symbol in center
- Subtle 3D effect (shadow/highlight)
- "Locked" version: grayscale, question mark

---

#### Asset 9: MCQ Interface Icons
**Purpose:** Provide visual feedback in quiz interface  
**Section:** App → MCQ (Correct/Incorrect)  
**Dimensions:** 48×48px (icons), 200×200px (celebration graphics)  
**Type:** SVG or PNG  
**Recommended Source:** Iconsax library OR custom SVG  
**File size target:** <30KB total  
**Animation:** 
  - Correct: Checkmark bounces in (200ms)
  - Incorrect: X shakes side-to-side (300ms)  
**Fallback:** Text emoji (✓ or ✗)  
**Priority:** MUST-HAVE (feedback is critical)  

**Spec:**
```
Checkmark icon (correct):
- Style: Filled circle with checkmark
- Color: Green #00D97D
- Size: 200×200px for celebration, 48×48px for button

X icon (incorrect):
- Style: Filled circle with X
- Color: Red #FF4444
- Size: 200×200px for feedback

Both should animate in with satisfying motion.
```

---

#### Asset 10: Confetti Effect
**Purpose:** Celebrate session completion, correct answers, level-ups  
**Section:** App → Multiple (reader finish, badge unlock, level-up)  
**Type:** Canvas animation OR Lottie JSON  
**Recommended Source:** Canvas (custom) OR Lottie library (Spline, LottieFiles)  
**File size target:** <50KB (Lottie file)  
**Animation:** 1–2 seconds (particles fall from top)  
**Fallback:** Static confetti image OR none (animation optional)  
**Priority:** SHOULD-HAVE (premium feel, not essential)  

**Spec:**
```
Burst of confetti particles (50–100 particles):
- Colors: Green #00D97D, Blue #4DA6FF, Yellow #FFB84D, Pink #FF6B6B
- Shape: Small circles, squares, ribbons
- Duration: 1.5–2 seconds
- Gravity: Particles fall from top
- Stagger: Burst effect (all at once, then cascading)

Performance: Use requestAnimationFrame for smooth 60fps.
Mobile fallback: Lighter version (30 particles) or disabled.
```

---

#### Asset 11: User Avatars (Profile)
**Purpose:** Display user profile picture in dashboard, leaderboard, comments  
**Section:** App → Dashboard, Profile, Leaderboard  
**Dimensions:** 48×48px (thumbnail), 200×200px (profile view)  
**Type:** JPEG/PNG from Google Auth OR uploaded by user  
**Recommended Source:** Firebase Auth (Google profile images)  
**File size target:** <100KB per user (optimized)  
**Animation:** Hover zoom (subtle)  
**Fallback:** Generic avatar (initials in colored circle)  
**Priority:** SHOULD-HAVE (personalizes experience)  

**Spec:**
```
Use Firebase authentication avatar URL (Google profile picture).
Circular crop.
Border color: User's assigned team/group color (if applicable).
Fallback: Generate avatar from user's initials + assigned color.
```

---

#### Asset 12: Streak Fire Emoji / Icon
**Purpose:** Visual representation of streak counter  
**Section:** App → Dashboard (ambient animation)  
**Type:** SVG or PNG  
**Dimensions:** 40×40px  
**Recommended Source:** Iconsax library (fire icon) OR custom SVG  
**File size target:** <5KB  
**Animation:** Pulse every 5 seconds (1s animation, ease-in-out)  
**Fallback:** Text "🔥"  
**Priority:** NICE-TO-HAVE (emoji is fine fallback)  

---

#### Asset 13: Level Icon / Star
**Purpose:** Visual representation of level/XP  
**Section:** App → Dashboard  
**Type:** SVG or PNG (fill animates with XP)  
**Dimensions:** 40×40px  
**Recommended Source:** Custom SVG OR Iconsax  
**File size target:** <5KB  
**Animation:** XP bar fills (smooth, 800ms when points earned)  
**Fallback:** Text "⭐"  
**Priority:** NICE-TO-HAVE  

---

### PERFORMANCE BUDGET

| Asset Type | Total Size | Limit | Buffer | Status |
|------------|-----------|-------|--------|--------|
| Hero illustration | 100KB | 100KB | ✅ On budget | ✅ |
| Step icons | 20KB | 20KB | ✅ | ✅ |
| Reader mockup | 80KB | 100KB | ✅ | ✅ |
| Dashboard mockup | 80KB | 100KB | ✅ | ✅ |
| Leaderboard mockup | 60KB | 80KB | ✅ | ✅ |
| Testimonial avatars | 30KB | 50KB | ✅ | ✅ |
| Pricing illustration | 20KB | 30KB | ✅ | ✅ |
| **Landing page total** | **~390KB** | **~500KB** | **✅ Safe** | ✅ |
| Badge graphics (15) | 150KB | 200KB | ✅ | ✅ |
| MCQ icons | 30KB | 50KB | ✅ | ✅ |
| Confetti (Lottie) | 50KB | 60KB | ✅ | ✅ |
| **App screens total** | **~230KB** | **~310KB** | **✅ Safe** | ✅ |
| **GRAND TOTAL** | **~620KB** | **~810KB** | **✅ Safe** | ✅ |

**Note:** All images optimized as WebP with JPEG fallback. No unoptimized assets shipped.

---

## Asset Loading Strategy

### Landing Page

**Hero illustration:**
```html
<picture>
  <source srcset="/assets/hero.webp" type="image/webp">
  <img src="/assets/hero.jpg" alt="Student reading with RETRIEVE">
</picture>
```
- Lazy-load if below fold
- Preload if above fold (critical resource)

**Other landing page images:**
- Native `loading="lazy"` on all mockups
- Compress to WebP before deployment
- Use responsive srcset for mobile/tablet

### App Screens

**Badge graphics:**
- Sprite sheet OR individual PNG files (TBD during implementation)
- Lazy-load on badge gallery mount
- Cache in browser localStorage

**User avatars:**
- Fetch from Firebase Auth (external CDN)
- Cache for session
- Show initials avatar while fetching

**Confetti effect:**
- Load Lottie JSON from CDN
- Preload on app mount (non-blocking)
- Cache in service worker

---

## Asset Sources

### Stock Images / Icons
- **Iconsax:** https://iconsax.io/ (free, MIT license)
- **Unsplash:** https://unsplash.com/ (free, Unsplash license)
- **Pexels:** https://www.pexels.com/ (free, CC0)

### Custom / AI-Generated
- **Figma:** For mockups, card designs, badge designs
- **Midjourney / DALL-E:** For hero illustration (if custom illustration too expensive)
- **Lottie:** https://lottiefiles.com/ (animation library)

### Design Tools
- **Figma:** Primary design tool
- **Adobe Firefly / Photoshop:** Image optimization
- **TinyPNG / Squoosh:** WebP compression

---

## Asset Sourcing Plan

### Phase 1: MVP (Weeks 1–3, in parallel with design)

**Priority 1 (Week 1):**
- [ ] Hero illustration (custom Figma + commission illustrator OR Midjourney)
- [ ] Reader mockup (Figma screenshot)
- [ ] Dashboard mockup (Figma screenshot)
- [ ] Badge designs (Figma, 15 badges)

**Priority 2 (Week 2):**
- [ ] Step icons (Iconsax library, download 3)
- [ ] MCQ icons (custom SVG or Iconsax)
- [ ] Testimonial avatars (Unsplash or Midjourney)

**Priority 3 (Week 3):**
- [ ] Confetti animation (Lottie library or custom Canvas)
- [ ] Leaderboard mockup (Figma screenshot)
- [ ] Pricing illustration (optional, can use text)

### Phase 2: Polish (Weeks 4–8, during build)

- [ ] Optimize all images (WebP, compress)
- [ ] Create responsive srcset
- [ ] Set up asset CDN
- [ ] Cache strategy (localStorage, service worker)

### Phase 3: Launch (Weeks 9–10)

- [ ] Final asset audit (all images load correctly)
- [ ] Performance test (Lighthouse, WebPageTest)
- [ ] Mobile validation (test on 3G network)

---

## Fallback Strategy

### If Hero Illustration Fails
- Fallback: Solid gradient background (#0F0F0F → #1A1A1A) with animated text
- Impact: Hero still works, slightly less visual impact
- Severity: MEDIUM

### If Mockup Images Fail
- Fallback: Text description ("Dashboard Preview") + placeholder boxes
- Impact: Feature sections still readable, less visual proof
- Severity: LOW

### If Badge Graphics Fail
- Fallback: Text-based badges ("First Session", "7-Day Streak", etc.)
- Impact: Badge gallery still functional, less engaging
- Severity: MEDIUM

### If Confetti Fails
- Fallback: No animation, static checkmark appears
- Impact: Celebration moment less memorable, but no blockers
- Severity: LOW

### If User Avatars Fail
- Fallback: Generic avatar with user initials + color
- Impact: Still personalized, less visually rich
- Severity: LOW

---

## Accessibility Considerations

**All images must have alt text:**
```html
<img src="/hero.webp" alt="Student reading aloud with RETRIEVE app">
```

**Icons must be semantically meaningful:**
```html
<span aria-label="Streak counter" role="img">🔥 12 days</span>
```

**Color-based feedback must have text backup:**
```
Correct: ✓ Green highlight + "Correct!" text
Incorrect: ✗ Red highlight + "Incorrect. Here's why..." text
```

**Animations respect reduced-motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Asset Sign-Off Checklist

**Deliverables:**
- [x] Asset inventory (13 major assets identified)
- [x] Performance budget (620KB total, 810KB limit)
- [x] Loading strategy (lazy-load, preload, cache)
- [x] Sources identified (Figma, Unsplash, Iconsax, Lottie)
- [x] Fallback strategy (all critical assets have fallbacks)
- [x] Accessibility plan (alt text, aria labels, color + text)
- [x] Timeline (Phase 1: Weeks 1–3)

**Quality gates:**
- [x] No unoptimized images
- [x] All assets <300KB individually
- [x] WebP + JPEG fallback for all photos
- [x] Responsive srcset for mockups
- [x] Lazy-load strategy defined
- [x] Accessibility compliant

---

## Next Stage: Stage 4 (Interaction System)

With assets identified, Stage 4 will map all animations:
- Button hover/active states
- Card entrance animations
- Word highlighting in reader
- Progress bar animations
- Confetti effect
- Streak pulse
- Leaderboard row updates
- Badge unlock celebration

**Ready for Stage 4?** [YES]

---

## Status

**Stage 3: Asset Direction — COMPLETE ✅**

All assets identified, sourced, and performance-budgeted.

**Next:** Stage 4: Interaction System (animations + behavior)

