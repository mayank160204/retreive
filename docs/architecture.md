# Architecture — System Design (overview)

Frontend:
- Next.js 14 (App Router) — server components for public pages, client components for interactive flows
- TypeScript, Tailwind CSS, Framer Motion for animations

Backend:
- Serverless functions (Next.js API routes) for non-Firebase operations (optional glue)
- Firebase (Auth + Firestore + Storage) as primary backend
- Deepgram (or equivalent) for streaming speech-to-text
- Stripe for payments

Auth:
- Firebase Authentication (Email/Password, Google OAuth)
- Token-based sessions (Firebase SDK) for client auth, consider session cookies for server-protected routes if required

Database:
- Firestore (NoSQL collections): users, sessions, passages, mcqs, badges, leaderboard, pdfUploads, notifications

Storage:
- Firebase Storage for uploaded PDFs and derived assets

Analytics & Observability:
- PostHog / Vercel Analytics for product events
- Sentry for error tracking

Streaming:
- Deepgram (or alternative) for low-latency transcription and word-level timing

CI/CD & Hosting:
- Vercel for frontend hosting and serverless routes, or Firebase Hosting + Cloud Functions

Notes:
- Use Firestore rules to enforce owner-only writes for sensitive collections.
- Design API contracts (see `docs/api-contracts.md`) before building server endpoints.
