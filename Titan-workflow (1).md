# Titan Workflow

High-impact workflow for creating visually striking, highly interactive landing pages and websites with the right skill used at the right stage.

Goal:
- Build memorable, premium, interactive websites that feel custom, not template-generated.
- Keep visual ambition high without losing performance, responsiveness, accessibility, or implementation discipline.
- Give each project a clear navigation path from idea to polished build.

Primary rule:
- Start with a strong visual thesis, then make every section, asset, motion, and component serve that thesis.

Titan success standard:
- The first viewport is immediately distinctive.
- The brand, product, or category is obvious without relying on tiny nav text.
- The page has one dominant visual idea, not many competing tricks.
- Interactions feel intentional and polished, not random.
- Desktop and mobile are both visually validated before completion.

---

## 1. Skill Stack Overview

Use the smallest strong combo that fits the project. Do not activate every skill for every project.

### Core Titan Combo

Use this for most premium interactive landing pages:

```text
build-web-apps:frontend-app-builder
+ frontend-design
+ scroll-experience
+ design-spells
+ animejs-animation
+ react-best-practices
+ ui-visual-validator
```

Purpose:
- `build-web-apps:frontend-app-builder`: primary visual website build discipline.
- `frontend-design`: art direction, aesthetic stance, visual memorability.
- `scroll-experience`: narrative scroll, sticky moments, parallax, reveal pacing.
- `design-spells`: memorable micro-interactions and premium detail.
- `animejs-animation`: advanced choreography, staggered motion, SVG/DOM timelines.
- `react-best-practices`: keep React/Next implementation performant.
- `ui-visual-validator`: final visual proof across desktop/mobile.

### Holy Hell Hero Combo

Use when the site needs a serious visual centerpiece:

```text
build-web-apps:frontend-app-builder
+ frontend-design
+ 3d-web-experience
+ threejs-skills
+ scroll-experience
+ animejs-animation
+ design-spells
+ react-best-practices
+ ui-visual-validator
```

Use this only when 3D/WebGL strengthens the product story. Do not use 3D just because it looks expensive.

### SaaS/Product Landing Combo

Use when the page must convert users clearly:

```text
build-web-apps:frontend-app-builder
+ product-design
+ page-cro
+ copywriting
+ landing-page-generator
+ scroll-experience
+ design-spells
+ react-best-practices
+ ui-visual-validator
```

### Portfolio/Agency Combo

Use when the site is a first impression or creative proof:

```text
interactive-portfolio
+ frontend-design
+ scroll-experience
+ animejs-animation
+ design-spells
+ threejs-skills
+ ui-visual-validator
```

### Design-System Heavy Combo

Use when building a dashboard, app shell, or component-rich marketing/product hybrid:

```text
ui-ux-pro-max
+ tailwind-design-system
+ shadcn-ui
+ radix-ui-design-system
+ frontend-dev-guidelines
+ react-best-practices
+ ui-visual-validator
```

---

## 2. Titan Stage Map

| Stage | Objective | Primary Skills | Output |
|---|---|---|---|
| 0. Project Intake | Define goal, audience, offer, constraints | `frontend-design`, optional `product-design` | `brief.md` |
| 1. Visual Thesis | Pick the aesthetic stance and signature idea | `frontend-design`, `build-web-apps:frontend-app-builder` | `visual-thesis.md` |
| 2. Content Spine | Define page structure and conversion flow | `build-web-apps:frontend-app-builder`, optional `copywriting`, `page-cro`, `landing-page-generator` | `content-plan.md` |
| 3. Asset Direction | Decide imagery, 3D, video, icons, textures | `imagegen`, `unsplash-integration`, `3d-web-experience`, `iconsax-library` | `asset-plan.md` |
| 4. Interaction System | Define scroll, hover, click, ambient behavior | `scroll-experience`, `design-spells`, `animejs-animation` | `interaction-inventory.md` |
| 5. Tech Spec | Choose architecture, libraries, performance limits | `react-best-practices`, `frontend-dev-guidelines` | `tech-spec.md` |
| 6. Build Pass | Implement the actual site | `build-web-apps:frontend-app-builder`, `react-best-practices` | Working website |
| 7. Motion Polish | Add high-craft animation and micro-interactions | `scroll-experience`, `design-spells`, `animejs-animation` | Polished interactions |
| 8. Performance/A11y | Reduce weight, fix focus, contrast, motion settings | `react-best-practices`, `web-performance-optimization`, `fixing-accessibility` | Green checklist |
| 9. Visual Validation | Validate screenshots, responsiveness, layout, states | `ui-visual-validator`, `screenshots` | QA report and fixes |
| 10. Final Handoff | Summarize files, commands, remaining risks | `verification-before-completion` | Completion report |

---

## 3. Stage 0: Project Intake

Objective:
- Lock the project goal before choosing effects.
- Prevent visually impressive but strategically confused pages.

Use skills:
- `frontend-design`
- Optional: `product-design`, `page-cro`, `copywriting`

Create `brief.md` with:

1. Product or brand name
2. Category
3. Target user
4. Primary action
5. Emotional goal
6. Business goal
7. Offer or core promise
8. Required sections
9. Out-of-scope items
10. Constraints: framework, deadline, assets, brand rules

Prompt:

```text
Use frontend-design.

Create a compact website build brief for [PRODUCT/BRAND].

Include:
1. Product/category
2. Target user
3. Primary conversion action
4. Emotional goal
5. Visual tone
6. Product promise
7. In-scope sections
8. Out-of-scope items
9. Non-negotiables for accessibility, responsiveness, and performance

Keep it direct and implementation-ready.
Output as brief.md.
```

Acceptance gate:
- The primary action is clear.
- The audience is specific.
- The emotional goal does not contradict the product category.

---

## 4. Stage 1: Visual Thesis

Objective:
- Define a memorable design direction before coding.
- Avoid generic SaaS templates, random gradients, and component-first design.

Use skills:
- `frontend-design`
- `build-web-apps:frontend-app-builder`
- Optional: `theme-factory`

Required decisions:

1. Visual thesis: one sentence describing mood, material, and energy.
2. Aesthetic stance: choose one dominant direction.
3. Differentiation anchor: what remains recognizable if the logo is removed.
4. Hero concept: the first viewport's dominant visual idea.
5. Motion thesis: 2-3 motion ideas that support the page.

Prompt:

```text
Use frontend-design and build-web-apps:frontend-app-builder.

Based on brief.md, create visual-thesis.md.

Include:
1. Visual thesis in one sentence
2. Aesthetic stance
3. Differentiation anchor
4. Hero concept
5. Section-by-section visual role
6. Typography direction
7. Color direction
8. Motion thesis with 2-3 intentional motion ideas
9. DFII score:
   - Aesthetic Impact 1-5
   - Context Fit 1-5
   - Implementation Feasibility 1-5
   - Performance Safety 1-5
   - Consistency Risk 1-5

If DFII is below 8, revise the direction before proceeding.
```

Acceptance gate:
- The page has one strong visual idea.
- The hero would still be identifiable in a screenshot.
- DFII is 8 or higher.

---

## 5. Stage 2: Content Spine

Objective:
- Build the narrative and conversion flow before visual implementation.
- Keep copy short, scannable, and useful.

Use skills:
- `build-web-apps:frontend-app-builder`
- Optional: `copywriting`, `page-cro`, `product-design`, `landing-page-generator`

Default landing sequence:

1. Hero: brand/product, promise, CTA, one dominant visual.
2. Support: one concrete proof, feature, or offer.
3. Detail: workflow, product depth, story, or outcome.
4. Conversion: final CTA with strong context.

Prompt:

```text
Use build-web-apps:frontend-app-builder.
Optionally use copywriting and page-cro if this is a conversion-focused page.
Use landing-page-generator when this is a fast-lane marketing page and speed matters more than bespoke section invention.

Create content-plan.md from brief.md and visual-thesis.md.

For each section include:
1. Section job
2. Primary takeaway
3. Headline
4. Supporting copy
5. Primary action, if any
6. Visual role
7. Interaction role

Rules:
- No filler copy.
- No repeated benefit statements.
- No design commentary inside the UI.
- Each section must explain, prove, deepen, or convert.
```

Acceptance gate:
- A visitor can understand the page by scanning only section headlines.
- Every section has one job.
- No section exists only because landing pages usually have it.

---

## 6. Stage 3: Asset Direction

Objective:
- Decide whether the project needs photography, generated imagery, 3D, icons, video, canvas, or pure typography.

Use skills:
- `imagegen`
- `unsplash-integration`
- `iconsax-library`
- Optional: `3d-web-experience`, `threejs-skills`, `spline-3d-integration`, `magic-animator`

Asset decision rules:

| Need | Use |
|---|---|
| Real-world product, venue, lifestyle, editorial feel | `unsplash-integration` or supplied real assets |
| Custom surreal/brand visual | `imagegen` |
| Product object, spatial scene, interactive centerpiece | `3d-web-experience` + `threejs-skills` |
| UI icons, action symbols, product nav | `iconsax-library` |
| Branded motion asset, logo reveal, lightweight Lottie-style motion graphic | `magic-animator` |
| Social/SEO preview assets | `seo-image-gen` or `imagegen` |

3D gate:
- Use 3D only if it communicates the product/category better than a static image.
- Keep the scene full-bleed or directly integrated, not trapped inside a decorative card.
- Set a performance budget before implementation.

Prompt:

```text
Use imagegen, unsplash-integration, iconsax-library, magic-animator, and 3d-web-experience only if needed.

Create asset-plan.md.

For each section define:
1. Asset type
2. Purpose
3. Source: generated / searched / existing / 3D / CSS / canvas
4. Required dimensions or aspect ratio
5. Fallback if the asset fails
6. Performance risk

If recommending 3D, explain why 3D is necessary and what the non-3D fallback is.
```

Acceptance gate:
- The first viewport has a real visual anchor.
- Assets serve the product story.
- There is a fallback for heavy or external assets.

---

## 7. Stage 4: Interaction System

Objective:
- Define behavior before writing animation code.
- Make motion feel intentional, expensive, and readable.

Use skills:
- `scroll-experience`
- `design-spells`
- `animejs-animation`
- Optional: `threejs-interaction` for 3D scenes

Interaction categories:

1. Entrance sequence
2. Scroll-linked movement
3. Sticky narrative section
4. Hover/focus states
5. CTA interactions
6. Menu/nav behavior
7. Ambient background motion
8. Reduced-motion fallback

Prompt:

```text
Use scroll-experience, design-spells, and animejs-animation.

Create interaction-inventory.md from content-plan.md and visual-thesis.md.

For each interactive element or section include:
1. Element/section name
2. Default state
3. Hover/focus behavior
4. Click/tap behavior
5. Scroll entry behavior
6. Ambient behavior
7. Animation tool: CSS / Anime.js / Framer Motion / GSAP / Three.js
8. Duration and easing
9. Reduced-motion fallback
10. Priority: Must-have / Should-have / Nice-to-have

Rules:
- At least one hero entrance sequence.
- At least one scroll/depth effect for visually led pages.
- At least one tactile micro-interaction.
- No animation that causes layout shift.
```

Acceptance gate:
- Every CTA has hover, focus, and active behavior.
- Every major motion has a reason.
- Reduced-motion behavior is defined.

---

## 8. Stage 5: Tech Spec

Objective:
- Convert the design and interaction plan into a buildable architecture.

Use skills:
- `react-best-practices`
- `frontend-dev-guidelines`
- Optional: `tailwind-design-system`, `shadcn-ui`, `radix-ui-design-system`

Tech spec must include:

1. Framework and package manager
2. Component map
3. CSS/token strategy
4. Animation library choices
5. Asset loading strategy
6. Responsive breakpoints
7. Performance budget
8. Accessibility requirements
9. Validation commands

Prompt:

```text
Use react-best-practices and frontend-dev-guidelines.

Create tech-spec.md from:
- brief.md
- visual-thesis.md
- content-plan.md
- asset-plan.md
- interaction-inventory.md

Include:
1. Stack
2. File map
3. Component architecture
4. CSS variable/token architecture
5. Animation architecture
6. Asset loading and lazy-loading plan
7. Bundle/performance guardrails
8. Accessibility guardrails
9. Verification commands

Rules:
- Import directly; avoid unnecessary barrel imports.
- Dynamically import heavy 3D or animation modules when possible.
- Keep static JSX outside components when useful.
- Use transform/opacity for animation.
- Avoid layout-thrashing animation patterns.
```

Acceptance gate:
- Every must-have interaction has an implementation method.
- Heavy dependencies have a loading strategy.
- Mobile and reduced-motion behavior are specified.

---

## 9. Stage 6: Build Pass

Objective:
- Build the actual page/site with the visual system and content spine intact.

Use skills:
- `build-web-apps:frontend-app-builder`
- `react-best-practices`
- Optional: framework-specific skills such as `nextjs-best-practices`, `shadcn-ui`, `tailwind-patterns`, `landing-page-generator`

Build rules:

- Build the actual usable experience as the first screen.
- Do not create a generic marketing page if the request is for a tool, app, game, or product surface.
- Keep cards rare. Use full-width bands, composition, media, typography, and spatial layout first.
- Do not use decorative gradient blobs or random background orbs.
- Do not scale font size with viewport width.
- Make all fixed-format UI elements stable with explicit dimensions or aspect ratios.
- Text must not overlap or overflow on desktop or mobile.

Implementation prompt:

```text
Use build-web-apps:frontend-app-builder and react-best-practices.
Use landing-page-generator only if this is a speed-first landing page and the default section patterns fit the offer.

Implement the website from:
- brief.md
- visual-thesis.md
- content-plan.md
- asset-plan.md
- interaction-inventory.md
- tech-spec.md

Build requirements:
1. Create the actual usable page/site.
2. Make the first viewport visually distinctive and product/category clear.
3. Use the defined visual thesis, tokens, assets, and motion system.
4. Implement responsive desktop, tablet, and mobile layouts.
5. Add semantic HTML, accessible controls, visible focus states, and reduced-motion behavior.
6. Keep changes scoped to the project.

Hard constraints:
- No generic SaaS card-grid hero.
- No hero card unless the product itself requires a framed tool.
- No decorative gradient orb background.
- No in-app text explaining the UI or keyboard shortcuts unless the product needs it.
- No layout shift from hover, animation, or dynamic labels.

Output:
- Changed files
- Implementation coverage by section
- Known tradeoffs
- Verification command list
```

Acceptance gate:
- The site runs locally.
- The first viewport passes the visual thesis.
- All required sections exist and are responsive.

---

## 10. Stage 7: Motion Polish Pass

Objective:
- Add the layer that makes the site feel premium after the base layout works.

Use skills:
- `scroll-experience`
- `design-spells`
- `animejs-animation`
- Optional: `threejs-animation`, `threejs-interaction`, `magic-animator`

Use this pass after the base build is complete, not before.

Motion checklist:

- Hero entrance sequence is visible but not slow.
- Scroll movement supports narrative hierarchy.
- Hover states communicate affordance.
- CTA feels tactile.
- Any ambient motion is subtle and pausable through reduced-motion settings.
- Mobile motion is simpler than desktop motion.
- Animations use transform/opacity where possible.

Prompt:

```text
Use scroll-experience, design-spells, animejs-animation, and magic-animator only when motion assets or branded loop animations are needed.

Perform a Motion Polish Pass.

Inputs:
- Working site
- interaction-inventory.md
- visual-thesis.md

Tasks:
1. Implement must-have motion first.
2. Add one memorable micro-interaction where it increases perceived craft.
3. Add scroll/depth behavior only where it improves comprehension.
4. Add reduced-motion fallbacks.
5. Verify animations do not cause layout shift or text overlap.

Output:
- Motion changes by file
- Timing/easing summary
- Reduced-motion behavior
- Performance risks
```

Acceptance gate:
- Motion is noticeable in a quick screen recording.
- Motion does not block reading or conversion.
- Reduced-motion mode remains coherent.

---

## 11. Stage 8: Performance and Accessibility Gate

Objective:
- Keep the impressive version fast, readable, and usable.

Use skills:
- `react-best-practices`
- `web-performance-optimization`
- `fixing-accessibility`
- `fixing-motion-performance`

Checklist:

- Images are sized, compressed, and lazy-loaded where appropriate.
- 3D/canvas scenes are dynamically loaded or isolated when heavy.
- No unnecessary animation libraries are loaded globally.
- Focus states are visible.
- Keyboard navigation works.
- Contrast is acceptable.
- Reduced-motion behavior is implemented.
- Mobile text fits and tap targets are usable.
- No CLS from images, cards, counters, labels, hover states, or animations.

Prompt:

```text
Use react-best-practices, web-performance-optimization, fixing-accessibility, and fixing-motion-performance.

Run a performance and accessibility gate.

Evaluate:
1. Bundle and dependency risks
2. Image and asset loading
3. Animation performance
4. Layout stability
5. Keyboard navigation
6. Focus states
7. Color contrast
8. Reduced-motion behavior
9. Mobile usability

Apply fixes for Critical and High issues.
Report remaining Medium/Low issues separately.
```

Acceptance gate:
- No Critical or High accessibility issue remains.
- No obvious layout shift remains.
- Heavy assets are justified and optimized.

---

## 12. Stage 9: Visual Validation

Objective:
- Prove the page works visually instead of assuming it does.

Use skills:
- `ui-visual-validator`
- `screenshots`
- Optional: `playwright`, `webapp-testing`, `build-web-apps:frontend-testing-debugging`

Validation viewports:

1. Desktop: 1440 x 900
2. Laptop: 1280 x 800
3. Tablet: 768 x 1024
4. Mobile: 390 x 844
5. Small mobile: 360 x 740

Validation states:

- Initial load
- Hover/focus where possible
- Open nav/menu
- Mid-scroll sections
- Final CTA
- Reduced-motion mode if implemented

Prompt:

```text
Use ui-visual-validator and screenshots.
Use build-web-apps:frontend-testing-debugging when you need rendered-browser QA, responsive debugging, or interaction-proof before signoff.

Perform a visual validation audit.

Validate these viewports:
- 1440x900
- 1280x800
- 768x1024
- 390x844
- 360x740

Check:
1. First viewport clarity
2. Text fit and hierarchy
3. No overlap or clipping
4. Responsive layout quality
5. CTA visibility
6. Asset rendering
7. Animation side effects
8. Accessibility visual cues
9. Cross-section consistency

Apply Critical and High visual fixes.
Re-run screenshots after fixes.
```

Acceptance gate:
- No Critical or High visual issue remains.
- Mobile first viewport is not broken or overcrowded.
- The site still matches the visual thesis after fixes.

---

## 13. Stage 10: Final Handoff

Objective:
- End with a clear record of what was built, what was verified, and what remains.

Use skills:
- `verification-before-completion`
- Optional: `fixing-metadata`, `seo-technical`

Final response should include:

1. What was built
2. Key files changed
3. Validation commands run
4. Visual QA status
5. Known limitations or follow-ups
6. Local dev URL if server is running

Prompt:

```text
Use verification-before-completion.

Prepare final handoff.

Include:
1. Summary of implementation
2. Files changed
3. Validation performed
4. Screenshots/viewports checked
5. Remaining risks
6. How to run locally
```

Acceptance gate:
- No completion claim without verification.
- Any skipped verification is explicitly stated.

---

## 14. Optional Fidelity Mode

Use this only when you already have source HTML, screenshots, Figma/Stitch exports, or a previous mockup that must be matched.

Skill focus:
- Use the current `Workflow.md` parity process.
- Add Titan skills only after parity is green.

Order:

1. Fidelity Contract
2. HTML-to-React parity plan
3. Strict parity implementation
4. Per-screen drift audit
5. Titan motion polish
6. Visual validation

Rule:
- Do not redesign during Fidelity Mode.
- Use Titan polish only after source parity is approved.

---

## 15. Copy-Paste Project Starter Prompt

Use this when starting a new project from scratch:

```text
Use the Titan Workflow.

Use these skills in order:
1. frontend-design
2. build-web-apps:frontend-app-builder
3. scroll-experience
4. design-spells
5. animejs-animation
6. react-best-practices
7. ui-visual-validator

Project:
- Name: [PRODUCT/BRAND]
- Category: [CATEGORY]
- Audience: [TARGET USER]
- Goal: [PRIMARY CONVERSION OR ACTION]
- Tone: [PREMIUM / PLAYFUL / BRUTALIST / EDITORIAL / FUTURISTIC / ETC.]
- Must include: [SECTIONS OR FEATURES]
- Tech stack: [REACT/VITE/NEXT/HTML]
- Assets available: [YES/NO/LINKS]

Start with Stage 0 through Stage 5 before implementation:
1. brief.md
2. visual-thesis.md
3. content-plan.md
4. asset-plan.md
5. interaction-inventory.md
6. tech-spec.md

Then implement the site, run visual validation, and report verification.
```

---

## 16. Copy-Paste Holy Hell Hero Prompt

Use only when the project deserves an immersive hero:

```text
Use the Titan Holy Hell Hero workflow.

Use these skills:
- build-web-apps:frontend-app-builder
- frontend-design
- 3d-web-experience
- threejs-skills
- scroll-experience
- animejs-animation
- design-spells
- react-best-practices
- ui-visual-validator

Create a visually intense, highly interactive landing page for [PRODUCT/BRAND].

Requirements:
1. First viewport must be unmistakably about the product/category.
2. Hero must have one dominant full-bleed visual idea.
3. Use 3D/WebGL only if it strengthens the product story.
4. Add scroll-reactive storytelling, not random motion.
5. Add tactile micro-interactions on CTAs and key controls.
6. Keep mobile simpler, readable, and fast.
7. Implement reduced-motion behavior.
8. Validate desktop and mobile screenshots before final handoff.

Avoid:
- Generic SaaS card-grid hero
- Hero text inside a card
- Decorative gradient blobs or orbs
- One-note purple/blue gradient theme
- Text overlap or font scaling based on viewport width
- Heavy 3D without fallback
```

---

## 17. Navigation Cheat Sheet

Use this to decide what skill to call next:

| If you are doing this            | Use                                                   |
|----------------------------------|-------------------------------------------------------|
| Defining visual direction        | `frontend-design`                                     |
| Building a premium website/page  | `build-web-apps:frontend-app-builder`                 |
| Shipping a fast marketing page   | `landing-page-generator`, `page-cro`, `copywriting`  |
| Planning scroll narrative        | `scroll-experience`                                   |
| Adding memorable UI details      | `design-spells`                                       |
| Sequencing advanced animation    | `animejs-animation`                                   |
| Creating motion assets/Lottie    | `magic-animator`                                      |
| Adding full 3D/WebGL             | `3d-web-experience`, `threejs-skills`                 |
| Building React/Next components   | `react-best-practices`, `react-patterns`              |
| Building with shadcn/Radix       | `shadcn-ui`, `radix-ui-design-system`                 |
| Creating design tokens           | `tailwind-design-system`, `theme-factory`             |
| Improving conversion             | `page-cro`, `copywriting`, `signup-flow-cro`          |
| Checking accessibility           | `fixing-accessibility`, `wcag-audit-patterns`         |
| Checking final visuals           | `ui-visual-validator`, `screenshots`                  |
| Debugging rendered frontend QA   | `build-web-apps:frontend-testing-debugging`           |
| Improving performance            | `web-performance-optimization`,`react-best-practices` |

---

## 18. Non-Negotiable Titan Rules

- Start with visual thesis before implementation.
- First viewport must have one dominant visual idea.
- Brand/product/category must be obvious immediately.
- Do not build generic SaaS cards unless the product requires cards.
- Do not use hero cards by default.
- Do not use decorative gradient blobs, orbs, or random bokeh.
- Do not let effects compete with clarity.
- Use motion to create hierarchy, not noise.
- Use 3D only when it makes the story clearer or more memorable.
- Use visual assets for websites and landing pages.
- Keep text short and scannable.
- Make all text fit on mobile and desktop.
- Preserve readable contrast over imagery.
- Implement reduced-motion support.
- Validate with real screenshots before calling the work complete.

---

## 19. Fast Execution Sequence

For a new premium interactive website:

1. Stage 0: Create `brief.md`
2. Stage 1: Create `visual-thesis.md`
3. Stage 2: Create `content-plan.md`
4. Stage 3: Create `asset-plan.md`
5. Stage 4: Create `interaction-inventory.md`
6. Stage 5: Create `tech-spec.md`
7. Stage 6: Build the site
8. Stage 7: Motion polish
9. Stage 8: Performance/accessibility gate
10. Stage 9: Visual validation
11. Stage 10: Final handoff

For a design-to-code project with existing mockups:

1. Use the existing `Workflow.md` parity process first
2. Get visual parity green
3. Add Titan motion polish
4. Run Titan visual validation

---

## 20. Quality Bar

A Titan site is not finished when it compiles.

It is finished when:
- It runs.
- It is responsive.
- It has a clear first impression.
- It has a memorable visual anchor.
- It has polished interactions.
- It has reduced-motion support.
- It has no obvious mobile breakage.
- It has been visually checked in screenshots.
- Remaining risks are documented.
