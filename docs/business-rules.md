# Business Rules

1. Free tier: new users receive one free reading session. Additional sessions require upgrade.
2. Paid tier: subscription grants unlimited sessions and leaderboard/streak tracking.
3. Refunds: 7-day refund window for new subscribers; handled via Stripe administrative UI.
4. Data retention: user content (uploaded PDFs) retained unless user requests deletion; account deletion removes all PII and user-generated content within 30 days.
5. Badges: awarded once per user per badge definition; duplicate awards are ignored.
6. Leaderboard: weekly leaderboard resets every Monday 00:00 UTC; points accumulate from sessions in that week.
7. Content ownership: users retain rights to uploaded PDFs; platform may store derived text for indexing and practice only.
8. Moderation: public passages (if enabled) must be opt-in; admin can remove flagged passages.
9. Security: all payment data stored only in Stripe; only non-sensitive metadata stored in Firestore.
10. Rate limits: uploads limited to 5 files/hour per user; session creation limited to 20/hour per user.
