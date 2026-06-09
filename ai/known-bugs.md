# Known Bugs

Bug #1 — `npm install` exited with code 254
- Issue: dev terminal reported `npm install` failure (exit code 254). Investigate package versions, Node/npm mismatch, or network.
- Workaround: run `npm install --verbose` from `/retrieve` and inspect logs.

Bug #2 — Some verification/reset flows are simulated
- Issue: `email-verification` and reset flows include comments like "simulate verification" and need wiring to Firebase.

Bug #3 — Lint/accessibility warnings
- See `get_errors` output; small issues in `globals.css`, link hrefs, and inline styles.
