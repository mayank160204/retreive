# API Contracts

Note: Firebase handles Auth; below are server endpoints for app-level operations (any serverless functions or Next.js API routes).

POST /api/sessions
Input:
{
  "userId": "string",
  "pdfId": "string",
  "passages": [ { "id": "string" } ]
}
Output:
{
  "success": true,
  "sessionId": "string"
}

GET /api/leaderboard?week=YYYY-WW
Output:
{
  "success": true,
  "week": "YYYY-WW",
  "entries": [ { "userId": "string", "points": number, "rank": number } ]
}

POST /api/uploads
Input: multipart/form-data file upload
Output:
{
  "success": true,
  "pdfId": "string",
  "storagePath": "string"
}

POST /api/award-badge
Input:
{
  "userId": "string",
  "badgeKey": "string"
}
Output:
{
  "success": true,
  "awarded": true
}

POST /api/stripe/webhook
Input: Stripe webhook payload (signed)
Output: HTTP 200 OK

Notes:
- All endpoints expect a valid Firebase auth token on Authorization header (Bearer).
- Input validation must run server-side; avoid trusting client-provided fields like `userId`.
