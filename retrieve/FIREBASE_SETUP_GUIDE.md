# Firebase Setup Guide - Task 4.2

**Objective:** Set up Firebase backend with Firestore database, authentication, and security rules for RETRIEVE MCAT app.

**Estimated Time:** 2-3 hours (mostly manual Firebase Console steps)

**Status:** Ready for manual Firebase configuration

---

## Prerequisites

✅ Firebase project created (check: https://console.firebase.google.com/)  
✅ Node.js 18+ installed  
✅ Code files prepared: `src/lib/firebase.ts`, `src/lib/db.ts`, `firestore.rules`

---

## Part 1: Firebase Console Setup (Manual)

### Step 1.1: Enable Authentication

**In Firebase Console:**

1. Go to **Build** > **Authentication**
2. Click **Get Started**
3. **Enable Authentication Methods:**
   - Email/Password
     - Go to **Sign-in method** > **Email/Password**
     - Toggle ON
     - Enable "Email link (passwordless sign-in)" - OPTIONAL
   - Google OAuth
     - Go to **Sign-in method** > **Google**
     - Toggle ON
     - Select your project as the support email
     - Save

**Expected Result:** Green checkmarks next to both auth methods

---

### Step 1.2: Create Firestore Database

**In Firebase Console:**

1. Go to **Build** > **Firestore Database**
2. Click **Create Database**
3. **Start in Production Mode** (we'll add security rules)
4. **Select Region:** us-central1 (or closest to your location)
5. Click **Enable**

**Wait:** Takes 1-2 minutes to initialize

**Expected Result:** Firestore database ready at `[project-id].firebaseapp.com`

---

### Step 1.3: Deploy Security Rules

**In Firebase Console:**

1. Go to **Firestore Database** > **Rules** tab
2. Copy entire contents of `/Users/apple/Desktop/mcat/retrieve/firestore.rules`
3. Paste into the Rules editor
4. Click **Publish**

**Wait:** Deployment takes 30 seconds

**Expected Result:** "Rules deployed successfully"

```
Rules deployed at: timestamp
To rollback, use the console or Firebase CLI
```

---

### Step 1.4: Create Firestore Indexes (Optimize Queries)

**In Firestore Console:**

1. Go to **Firestore Database** > **Indexes** tab
2. Create the following composite indexes:

| Collection | Fields | Sort Order |
|-----------|--------|-----------|
| `sessions` | `user_id` + `completed_at` | Asc + Desc |
| `leaderboard/{weekId}/users` | `points` | Desc |
| `pdfUploads` | `user_id` + `created_at` | Asc + Desc |
| `notifications/{userId}/messages` | `read` + `created_at` | Asc + Desc |

**How to Add:**
1. Go to **Indexes** tab
2. Click **Create Index**
3. Select collection
4. Add fields in order shown above
5. Select sort order (Asc/Desc)
6. Click **Create Index**

**Wait:** Each index takes 2-5 minutes to build

---

### Step 1.5: Enable Cloud Storage

**In Firebase Console:**

1. Go to **Build** > **Storage**
2. Click **Get Started**
3. Start in **Production Mode**
4. Select Region: same as Firestore
5. Click **Done**

**Note:** Storage rules already included in firestore.rules (under Storage section)

---

### Step 1.6: Get Firebase Config

**In Firebase Console:**

1. Go to **Project Settings** (gear icon)
2. Copy the **config** object under "Web" section:

```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "yourproject.firebaseapp.com",
  projectId: "yourproject",
  storageBucket: "yourproject.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
}
```

3. Create `.env.local` file in `/Users/apple/Desktop/mcat/retrieve/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
```

**⚠️ CRITICAL:** Never commit `.env.local` to git (already in .gitignore)

---

## Part 2: Initialize Firestore Collections (Scripts)

Once Firebase Console setup is complete, run the initialization script to create collections structure.

### Step 2.1: Create Collection Initializer Script

Run in VS Code terminal from `/Users/apple/Desktop/mcat/retrieve/`:

```bash
# This script will populate Firestore with initial data
node scripts/initializeFirebase.js
```

---

## Part 3: Code Implementation (Already Done)

✅ `src/lib/firebase.ts` - Firebase initialization
✅ `src/lib/db.ts` - Database operations (600+ lines)
✅ `src/lib/auth-context.tsx` - Auth provider (updated to use db.ts)
✅ `firestore.rules` - Security rules (deployed in Step 1.3)

---

## Firestore Collection Structure

Once initialized, your database will have this structure:

```
firestore/
├── users/
│   └── {userId}/
│       ├── [User Document]
│       ├── stats/
│       │   └── overall
│       └── preferences/
│           └── [Settings]
│
├── sessions/
│   └── {sessionId}/
│       ├── [Session Document]
│       └── passages/
│           └── {passageId}
│
├── leaderboard/
│   └── {weekId}/
│       └── users/
│           └── {userId}
│
├── badges/
│   ├── {badgeId}/
│   │   ├── [Badge Definition]
│   │   └── progress/
│   │       └── {userId}
│   
├── userBadges/
│   └── {userId}/
│       ├── badges: {badgeId: timestamp, ...}
│
├── passages/
│   └── {passageId}/
│       ├── [Passage Document]
│       └── mcqs/
│           └── {mcqId}
│
├── mcqs/
│   └── {mcqId}/
│       └── [MCQ Document]
│
├── pdfUploads/
│   └── {uploadId}/
│       └── [Upload Metadata]
│
├── notifications/
│   └── {userId}/
│       └── messages/
│           └── {messageId}
│
└── subscriptions/
    └── {userId}/
        └── [Subscription Data]
```

---

## Data Models

### User Document
```typescript
{
  id: string;                    // Firebase UID
  email: string;
  name: string;
  avatar_url: string;
  created_at: Date;
  tier: 'free' | 'unlimited';
  subscription_id: string | null;
  subscription_status: 'active' | 'inactive' | 'canceled';
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  sessions_completed: number;
}
```

### Session Document
```typescript
{
  id: string;
  user_id: string;
  pdf_id: string;
  passages: Passage[];
  words_read: number;
  accuracy_percentage: number;
  time_duration_seconds: number;
  xp_earned: number;
  mcq_score: number;
  completed_at: Date | null;
  status: 'in_progress' | 'completed' | 'abandoned';
}
```

### Badge Document
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;                  // Emoji or URL
  unlock_condition: string;      // "Complete 10 sessions", etc.
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}
```

### MCQ Document
```typescript
{
  id: string;
  passage_id: string;
  question: string;
  options: string[];             // [A, B, C, D]
  correct_answer: 0 | 1 | 2 | 3; // Index
  explanation: string;
}
```

---

## Security Rules Summary

✅ **Users:** Read/write own data, admin bypass  
✅ **Sessions:** User owns session, can't modify others  
✅ **Leaderboard:** Public read, admin write only  
✅ **Badges:** Public read, admin write  
✅ **Passages/MCQs:** Public read, admin write  
✅ **Notifications:** User-specific, secure  
✅ **Stripe Data:** Admin only (sensitive)  

All rules deployed in `firestore.rules`

---

## Testing Firebase Connection

### Test 1: Verify Firebase Initialization

```bash
cd /Users/apple/Desktop/mcat/retrieve
npm run build
```

Expected: Build succeeds with no Firebase errors

### Test 2: Manual Auth Test

Create test file `tests/firebase.test.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

describe('Firebase Setup', () => {
  it('should initialize firebase', () => {
    const app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    });

    const auth = getAuth(app);
    const db = getFirestore(app);

    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should create user on signup', async () => {
    // Run after Task 4.3 (Auth Pages)
  });
});
```

Run test:
```bash
npm test -- tests/firebase.test.ts
```

---

## Database Operation Examples

All database operations are in `src/lib/db.ts`:

### Create User
```typescript
import { createUserDocument } from '@/lib/db';

await createUserDocument(userId, email, name);
// Creates user doc + stats doc + preferences
```

### Create Session
```typescript
import { createSession, completeSession } from '@/lib/db';

const sessionId = await createSession(userId, pdfId, passages);
// Later, when session ends:
await completeSession(sessionId, {
  words_read: 2500,
  accuracy_percentage: 85,
  time_duration_seconds: 1200,
  mcq_score: 8,
});
```

### Award Badge
```typescript
import { awardBadgeToUser, getUserBadges } from '@/lib/db';

await awardBadgeToUser(userId, 'first-session');
const badges = await getUserBadges(userId);
```

### Get Leaderboard
```typescript
import { getWeeklyLeaderboard } from '@/lib/db';

const leaderboard = await getWeeklyLeaderboard('week-24');
```

---

## Common Issues & Fixes

### Issue: "Permission denied" errors
**Cause:** Security rules not deployed  
**Fix:** 
1. Go to Firestore > Rules tab
2. Verify rules are deployed (green checkmark)
3. Restart dev server: `npm run dev`

### Issue: "User does not have access to document"
**Cause:** User trying to access other user's data  
**Fix:** Check `isOwner()` function in rules is working correctly

### Issue: Authentication methods not available
**Cause:** Not enabled in Firebase Console  
**Fix:**
1. Go to Authentication > Sign-in method
2. Toggle ON for Email/Password and Google
3. Save changes
4. Restart dev server

### Issue: Indexes pending
**Cause:** Firestore still building indexes  
**Fix:** Wait 2-5 minutes, index will auto-build

---

## Next Steps

After Firebase setup is complete:

1. ✅ **Done:** Firestore collections created
2. ✅ **Done:** Security rules deployed
3. ✅ **Done:** Auth methods enabled
4. ⏳ **Next:** Task 4.3 - Build Auth Pages (signin, signup, forgot-password)
5. ⏳ **Then:** Task 4.5 - Protected routes middleware
6. ⏳ **Then:** Task 4.6 - E2E tests

---

## Checklist

- [ ] Firebase project created (console.firebase.google.com)
- [ ] Step 1.1 - Authentication enabled (Email + Google)
- [ ] Step 1.2 - Firestore Database created
- [ ] Step 1.3 - Security rules deployed
- [ ] Step 1.4 - Composite indexes created (4 indexes)
- [ ] Step 1.5 - Cloud Storage enabled
- [ ] Step 1.6 - `.env.local` file created with credentials
- [ ] `npm run build` succeeds without Firebase errors
- [ ] Test signup/signin works with real Firebase (after Task 4.3)

---

## Files Modified/Created

**Created:**
- ✅ `src/lib/db.ts` - 600+ lines of database operations
- ✅ `firestore.rules` - Security rules for all collections
- ✅ `FIREBASE_SETUP_GUIDE.md` - This file

**Modified:**
- Will update `src/lib/auth-context.tsx` to call `createUserDocument()` on signup

**Next Task:**
- Task 4.3 will create auth pages that use all these functions

---

**Status:** Ready for Firebase Console setup  
**Est. Total Task Time:** 2-3 hours (mostly waiting for Firebase operations)  
**Next Review:** After `.env.local` is configured with real credentials
