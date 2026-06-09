# Current State (2026-06-02)

Completed:
- Project scaffold (Next.js app, Tailwind, TypeScript)
- Landing page
- `src/lib/db.ts` (database helpers, functions)
- Auth context (`src/lib/auth-context.tsx`) wired to DB helpers

In progress / blocked:
- Firebase Console setup (manual): rules, indexes, auth providers
- Auth pages wiring to live Firebase (some client code simulates flows)

Next up:
- Complete Firebase setup and `.env.local`
- Protect routes and implement dashboard flows
