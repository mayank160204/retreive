# Database Schema (Firestore collections)

Note: Firestore is schemaless; below are the planned collection documents and recommended indexes and constraints.

1) `users` (document id = uid)
- id: string (uid)
- email: string
- name: string
- avatar_url: string
- created_at: timestamp
- tier: enum('free','unlimited')
- subscription_id: string | null
- total_xp: number
- level: number
- current_streak: number
- longest_streak: number

Indexes / constraints:
- Index on `email` (unique enforced at app level)

2) `sessions` (collection)
- id: string
- user_id: string (ref to users)
- pdf_id: string (ref to pdfUploads)
- passages: array of passage ids or embedded objects
- words_read: number
- accuracy_percentage: number
- time_duration_seconds: number
- xp_earned: number
- mcq_score: number
- completed_at: timestamp
- status: enum('in_progress','completed')

Indexes:
- Composite index: (`user_id`, `completed_at` desc)

3) `leaderboard` (documents per week or aggregated)
- id: string (week-YYYY-WW)
- entries: array of { user_id, points, rank }

4) `badges` (definitions)
- id: string
- key: string
- title: string
- description: string
- criteria: object
- rarity: enum('common','rare','epic')

5) `userBadges` (user achievements)
- id: string
- user_id: string
- badge_id: string
- awarded_at: timestamp

6) `passages`
- id: string
- pdf_id: string
- text: string
- start_offset: number
- end_offset: number
- word_count: number
- public: boolean

7) `mcqs`
- id
- passage_id
- question_text
- choices: array
- correct_choice_index: number

8) `pdfUploads`
- id
- user_id
- filename
- storage_path
- created_at
- page_count

9) `notifications`
- id
- user_id
- type
- payload
- read: boolean
- created_at

Security rules / constraints
- Users can read public collections except where owner-only enforced.
- `users/{uid}` write only by owner or admin.
