# Architecture Rules

- Always use TypeScript strict mode.
- Never store Stripe secrets in client code or Firestore; use server-side webhooks.
- Never use local state for authentication status across the app. Use a single `AuthProvider` and a central source-of-truth.
- Prefer server-side validation for any `userId` or security-sensitive fields.
- Avoid repeated API calls: centralize caching (React Query or SWR recommended).
- Firestore rules are the source of truth for data access; design rules and test them before deployment.
