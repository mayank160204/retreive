# Discovery Screen (Discovery / Feed)

Purpose

Expose passages and practice opportunities tailored to the user's level and recent activity. Encourage short, focused practice sessions.

Components

- Header (search, filters)
- Passage card (title, excerpt, length, difficulty)
- CTA: "Start Reading" on each card
- Sort/Filter controls (level, length, subject)
- Empty state component

States

- Empty state: show onboarding CTA and example passages
- Loading state: skeleton cards
- Error state: network error with retry
- Success: list of passage cards

Empty State

- Illustration + short copy: "No passages yet — upload a PDF or try sample passages"
- Primary CTA: Upload PDF

Loading State

- 3 skeleton cards, pulsing animation

Error State

- Message: "Could not load passages. Try again." + Retry button

Success State

- Paginated list of passages with infinite scroll or page controls
