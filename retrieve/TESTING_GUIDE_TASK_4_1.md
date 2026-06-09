# Testing Guide - Task 4.1: Project Setup

**Date:** June 1, 2026  
**Task:** WEEK 4 Task 4.1 - Project Setup (Next.js + Tailwind + TypeScript)  
**Status:** Ready for Testing  
**Owner:** QA / Developer  

---

## Pre-Test Checklist

### Files Created
- [x] `retrieve/package.json`
- [x] `retrieve/tsconfig.json`
- [x] `retrieve/tailwind.config.js`
- [x] `retrieve/postcss.config.js`
- [x] `retrieve/next.config.ts`
- [x] `retrieve/src/app/layout.tsx`
- [x] `retrieve/src/app/globals.css`
- [x] `retrieve/src/app/page.tsx`
- [x] `retrieve/src/types/index.ts`
- [x] `retrieve/src/lib/firebase.ts`
- [x] `retrieve/src/lib/auth-context.tsx`
- [x] `retrieve/.env.local.example`
- [x] `retrieve/.gitignore`
- [x] `retrieve/README.md`

---

## Step 1: Install Dependencies

### Command
```bash
cd /Users/apple/Desktop/mcat/retrieve
npm install
```

### Expected Results
- ✅ No errors in installation
- ✅ `node_modules/` directory created
- ✅ `package-lock.json` generated
- ✅ All dependencies listed in `package.json` installed:
  - react, react-dom
  - next, typescript
  - tailwindcss, postcss, autoprefixer
  - firebase, zustand, framer-motion
  - @stripe/*, axios, zod

### Actual Result
**Status:** [PENDING - Run command]

---

## Step 2: Start Development Server

### Command
```bash
npm run dev
```

### Expected Results
- ✅ No build errors
- ✅ Server starts on `http://localhost:3000`
- ✅ Console shows:
  ```
  > next dev
  ▲ Next.js 14.x.x
  - Local: http://localhost:3000
  - Environments: .env.local
  ```
- ✅ Browser can access `http://localhost:3000`

### Actual Result
**Status:** [PENDING - Run command]

---

## Step 3: Verify Landing Page Renders

### Test: Page Loads
- [ ] Navigate to `http://localhost:3000`
- [ ] Page loads without white screen
- [ ] No JavaScript errors in browser console
- [ ] Content visible within 2 seconds

### Test: Hero Section
- [ ] Title "Speak Your Way to MCAT Mastery" visible
- [ ] "MCAT Mastery" text is green (#00D97D)
- [ ] Hero paragraph text visible
- [ ] "Start Your Free Session" button visible and is green
- [ ] Button is clickable

### Test: Navigation Bar
- [ ] Logo "RETRIEVE" visible (green color)
- [ ] "Sign In" link visible
- [ ] "Get Started" button visible (green background)
- [ ] Nav is sticky on scroll

### Test: How It Works Section
- [ ] Title "How It Works" visible
- [ ] 3 steps visible (Upload PDF, Read Aloud, Get Feedback)
- [ ] Step numbers 1, 2, 3 in green circles
- [ ] Text content readable

### Test: Why RETRIEVE Works Section
- [ ] Title visible
- [ ] 4 features visible (Voice-Powered, Streak Motivation, Instant Feedback, Real Progress)
- [ ] Emoji icons visible
- [ ] Feature descriptions readable

### Test: Pricing Section
- [ ] "Simple Pricing" title visible
- [ ] Free plan card visible
- [ ] Unlimited plan card visible (with green border)
- [ ] "POPULAR" badge on Unlimited plan
- [ ] Pricing ($0 and $5/mo) visible

### Test: CTA Section
- [ ] "Ready to Dominate the MCAT?" heading visible
- [ ] "Start Now" button visible (green)
- [ ] Button clickable

### Test: Footer
- [ ] Copyright text visible
- [ ] Privacy, Terms, Contact links visible
- [ ] Footer has dark background

### Actual Result
**Status:** [PENDING - Manual testing]

---

## Step 4: Verify Tailwind CSS Works

### Test: Colors Applied
- [ ] Background is dark (#0F0F0F)
- [ ] Text is white (#FFFFFF)
- [ ] Accent elements are green (#00D97D)
- [ ] Hover states change to darker green (#00B85C)
- [ ] Error text would be red (if visible)

### Test: Responsive Design
- [ ] Desktop (1920px): Full layout with 3-column grid
- [ ] Tablet (768px): 2-column grids, responsive padding
- [ ] Mobile (375px): Single column, full-width buttons, readable text

### Test: Spacing & Typography
- [ ] Heading "Speak Your Way to MCAT Mastery" is 48px+ (sm:64px)
- [ ] Body text is 16-18px
- [ ] Padding/margins consistent
- [ ] No text overlaps

### Actual Result
**Status:** [PENDING - Manual testing]

---

## Step 5: Verify TypeScript Configuration

### Test: Type Checking
```bash
npm run build
```

### Expected Results
- ✅ Build completes without TypeScript errors
- ✅ No "Any type" warnings
- ✅ Strict mode enforced:
  - ✅ `strictNullChecks: true`
  - ✅ `noImplicitAny: true`
  - ✅ `strictFunctionTypes: true`

### Actual Result
**Status:** [PENDING - Run command]

---

## Step 6: Verify Environment Variables

### Test: .env.local Template
- [ ] `.env.local.example` exists in project root
- [ ] Contains all required variables:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  NEXT_PUBLIC_FIREBASE_PROJECT_ID
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  NEXT_PUBLIC_FIREBASE_APP_ID
  NEXT_PUBLIC_DEEPGRAM_API_KEY
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  NEXT_PUBLIC_API_URL
  NODE_ENV
  ```

### Test: Env Variables Not Leaked
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets in `.env.local.example` (only placeholders)

### Actual Result
**Status:** [PENDING - File verification]

---

## Step 7: Verify Project Structure

### Test: File Tree
```
retrieve/
├── public/                          [Expected if exists]
├── src/
│   ├── app/
│   │   ├── layout.tsx              [✓ Created]
│   │   ├── globals.css             [✓ Created]
│   │   ├── page.tsx                [✓ Created]
│   │   └── api/                    [Will be created in 4.2]
│   ├── components/                 [Will be created in future tasks]
│   ├── lib/
│   │   ├── firebase.ts             [✓ Created]
│   │   └── auth-context.tsx        [✓ Created]
│   ├── types/
│   │   └── index.ts                [✓ Created]
│   └── hooks/                      [Will be created in future tasks]
├── .env.local.example              [✓ Created]
├── .gitignore                      [✓ Created]
├── package.json                    [✓ Created]
├── tsconfig.json                   [✓ Created]
├── tailwind.config.js              [✓ Created]
├── postcss.config.js               [✓ Created]
├── next.config.ts                  [✓ Created]
└── README.md                       [✓ Created]
```

### Actual Result
**Status:** [PENDING - Directory verification]

---

## Step 8: Browser DevTools Verification

### Console Check
```bash
# Open browser DevTools (F12)
# Go to Console tab
```

- [ ] No JavaScript errors (red X symbols)
- [ ] No critical warnings related to React/Next.js
- [ ] No 404 errors for assets

### Network Tab Check
- [ ] Landing page loads (200 OK)
- [ ] CSS files load (main.css or similar)
- [ ] JavaScript bundles load (main.js, etc.)
- [ ] No failed requests
- [ ] Page load time < 2 seconds on 4G

### Application/Storage Tab Check
- [ ] Check that localStorage, sessionStorage not filled with errors

### Actual Result
**Status:** [PENDING - DevTools verification]

---

## Step 9: Smoke Test - Links & Navigation

### Test: Navigation Links
- [ ] Click "Sign In" → goes to `/auth/signin` (or shows 404, which is OK for now)
- [ ] Click "Get Started" → goes to `/auth/signup`
- [ ] Click "Start Your Free Session" → goes to `/auth/signup`
- [ ] Click "Start Now" → goes to `/auth/signup`

### Test: External Links (if any)
- [ ] No broken links
- [ ] External links open in new tab (if applicable)

### Actual Result
**Status:** [PENDING - Navigation testing]

---

## Step 10: ESLint Verification

### Command
```bash
npm run lint
```

### Expected Results
- ✅ No critical errors (errors level)
- ⚠️ Warnings are acceptable (will be fixed in next tasks)
- ✅ ESLint rules configured properly

### Actual Result
**Status:** [PENDING - Run command]

---

## Performance Baseline

### Metrics to Check
Run Lighthouse audit (DevTools → Lighthouse tab):

- [ ] **First Contentful Paint (FCP):** < 1.5s
- [ ] **Largest Contentful Paint (LCP):** < 2.5s
- [ ] **Cumulative Layout Shift (CLS):** < 0.1
- [ ] **Performance Score:** > 80/100

### Actual Results
**FCP:** [PENDING]  
**LCP:** [PENDING]  
**CLS:** [PENDING]  
**Performance Score:** [PENDING]  

---

## Accessibility Baseline

### Axe DevTools Check
Install Axe DevTools browser extension, then:

- [ ] No critical accessibility issues
- [ ] WCAG 2.1 AA compliance (at least)
- [ ] Heading hierarchy correct (h1 → h2 → h3)
- [ ] All interactive elements keyboard accessible

### Manual Checks
- [ ] Tab through page: all buttons reachable
- [ ] Focus visible on buttons/links
- [ ] Color contrast ratio ≥ 4.5:1 for text

### Actual Result
**Status:** [PENDING - Accessibility testing]

---

## Final Sign-Off

### Checklist
- [ ] Step 1: Dependencies installed ✅
- [ ] Step 2: Dev server starts ✅
- [ ] Step 3: Landing page renders ✅
- [ ] Step 4: Tailwind CSS works ✅
- [ ] Step 5: TypeScript builds ✅
- [ ] Step 6: Env template correct ✅
- [ ] Step 7: Project structure OK ✅
- [ ] Step 8: Browser DevTools clean ✅
- [ ] Step 9: Navigation working ✅
- [ ] Step 10: ESLint passes ✅
- [ ] Performance baseline met ✅
- [ ] Accessibility baseline met ✅

### Overall Status
**READY FOR NEXT TASK?** [ ] YES [ ] NO

**Issues Found:** [LIST BELOW]

```
1. ...
2. ...
```

**Sign-Off**
- **Tester:** _______________
- **Date:** _______________
- **Next Task:** WEEK 4 Task 4.2 - Firebase Setup

---

## Commands Reference

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Start production server
npm start

# Run tests
npm test
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Rebuild TypeScript
npx tsc --noEmit
```

### Tailwind not applying
```bash
# Verify tailwind.config.js has correct paths
# Verify @tailwind directives in globals.css
# Rebuild: npm run build
```
