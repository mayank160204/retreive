# RETRIEVE Project Setup

This is the Next.js project for RETRIEVE MCAT Study App.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase and Stripe credentials:

```bash
cp .env.local.example .env.local
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
retrieve/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard/  # Dashboard pages
│   │   └── api/        # API routes
│   ├── components/     # React components
│   ├── lib/            # Utility functions
│   │   ├── firebase.ts # Firebase config
│   │   └── auth-context.tsx # Auth provider
│   ├── types/          # TypeScript types
│   └── hooks/          # Custom React hooks
├── .env.local          # Environment variables (not committed)
├── tailwind.config.js  # Tailwind CSS config
└── next.config.ts      # Next.js config
```

## Technologies

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Firebase + Firestore
- **Auth:** Firebase Authentication
- **Speech Recognition:** Deepgram API
- **Payments:** Stripe
- **Animations:** Framer Motion
- **State:** Zustand + React Context

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Implementation Stages

### Stage 0-5: ✅ COMPLETE (Planning & Design)
- Product brief, visual thesis, content, tech spec

### Stage 6: 🔄 IN PROGRESS (Build Implementation)
- Week 4: Foundation & Auth
  - [x] Project setup
  - [x] Firebase config
  - [ ] Auth pages
  - [ ] Design tokens
  - [ ] Protected routes
  - [ ] Auth testing

- Week 5: Dashboard
- Week 6: Karaoke Reader
- Week 7: MCQ & Gamification
- Week 8: Leaderboard & Payments

## Next Steps

1. Install dependencies: `npm install`
2. Set up Firebase project and get credentials
3. Create `.env.local` with Firebase keys
4. Implement auth pages (Task 4.3)
5. Test auth flow end-to-end

## Documentation

All planning and architecture docs are in `/Users/apple/Desktop/mcat/`:
- `PRODUCT_BRIEF.md` - Product vision
- `VISUAL_THESIS_V2.md` - Design system
- `DETAILED_ARCHITECTURE_COMPLETE.md` - Complete feature spec
- `TECH_SPEC_FINAL.md` - Technical architecture
- `BUILD_PASS_STAGE_6.md` - Implementation guide
