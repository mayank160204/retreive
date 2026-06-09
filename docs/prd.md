# Product Requirements Document (PRD)

## Overview
RETRIEVE is a voice-powered study app that helps MCAT students retain reading passages by reading aloud, receiving real-time word-level feedback, answering MCQs, and tracking progress over time.

## Features

- Feature: Profile & Account
  - Create and manage user profile (name, avatar, tier)
- Feature: PDF Upload & Passage Extraction
  - Upload PDFs; extract passages for reading and practice
- Feature: Karaoke Reader (Voice-powered)
  - Highlight words in real time while the user reads aloud
- Feature: Session Recording & Feedback
  - Compute accuracy, words read, speed, and award XP
- Feature: MCQ Practice
  - Present MCQs tied to passages and score per session
- Feature: Engagement (Streaks, Badges, Leaderboard)
  - Track streaks and award badges; weekly leaderboard
- Feature: Payments
  - Stripe subscription for unlimited access

## User Stories & Acceptance Criteria

- Feature: Profile Creation
  - User Story:
    As a student,
    I want to create a profile,
    So I can track progress and personalize my experience.
  - Acceptance Criteria:
    - Name required
    - Email required (validated)
    - Profile image optional
    - On success, `users` document is created in Firestore
  - Edge cases:
    - Duplicate email → show friendly error
    - Weak network → show retry

- Feature: Sign Up / Sign In
  - User Story:
    As a student,
    I want to sign up and sign in,
    So I can access protected study features.
  - Acceptance Criteria:
    - Email/password sign-up works via Firebase Auth
    - Sign-in redirects to `/dashboard`
    - Password reset email sends successfully
  - Edge cases:
    - Email already registered
    - Incorrect password

- Feature: Karaoke Reader
  - User Story:
    As a student,
    I want to read a passage aloud and see real-time highlighting,
    So I can focus on cadence and accuracy.
  - Acceptance Criteria:
    - Transcription latency ≤ 300ms for streaming segments
    - Word alignment maps to displayed text
    - Session score computed and stored on completion
  - Edge cases:
    - Background noise → indicate low confidence
    - Long pauses → session timeout or pause

- Feature: PDF Upload
  - User Story:
    As a student,
    I want to upload PDFs,
    So I can practice with my own materials.
  - Acceptance Criteria:
    - File upload accepted to Storage and metadata in `pdfUploads`
    - Extracted passages saved to `passages` collection or storage
  - Edge cases:
    - Unsupported file type
    - Large file → show progress and chunking

## Edge Cases (global)

- Offline usage: prevent critical flows, show clear messaging
- Rate limits: throttle uploads and session creation to prevent abuse
- Privacy: users must be able to delete all account data
