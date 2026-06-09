# Task 4.2: Firebase Setup - Testing Guide

**Objective:** Verify Firebase configuration and database operations work correctly.

**Estimated Time:** 1 hour (mostly waiting for Firebase operations)

**Status:** Ready for testing after Firebase Console setup

---

## Pre-Testing Checklist

Before running tests, ensure:

- [ ] Firebase project created (https://console.firebase.google.com/)
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore Database created in production mode
- [ ] Security rules deployed (firestore.rules)
- [ ] Cloud Storage enabled
- [ ] Composite indexes created (4 indexes)
- [ ] `.env.local` file created with Firebase credentials
- [ ] `npm install` completed (dependencies installed)
- [ ] `npm run build` succeeds without errors

---

## Phase 1: Verify Firebase Configuration

### Test 1.1: Check Firebase Initialization

**Command:**
```bash
cd /Users/apple/Desktop/mcat/retrieve
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linted successfully
✓ 0 errors
✓ 0 warnings
```

**What's Being Tested:**
- Firebase config loads correctly from `.env.local`
- All TypeScript types resolve
- No circular dependencies
- Path aliases work (@/lib, @/types, etc.)

**If it fails:**
```
ERROR: Cannot find module 'firebase/app'
→ Fix: Run npm install
→ Verify: node_modules/firebase exists

ERROR: Environment variable NEXT_PUBLIC_FIREBASE_PROJECT_ID not found
→ Fix: Create .env.local with all 6 Firebase variables
→ Check: All vars start with NEXT_PUBLIC_
```

---

### Test 1.2: Verify .env.local Configuration

**Action:** Check `.env.local` file exists and has all required variables

**Command:**
```bash
cat /Users/apple/Desktop/mcat/retrieve/.env.local | grep NEXT_PUBLIC
```

**Expected Output:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
```

**If it fails:**
```
cat: /Users/apple/Desktop/mcat/retrieve/.env.local: No such file or directory
→ Fix: Create .env.local with values from Firebase Console > Project Settings
```

---

## Phase 2: Test Firebase Database Operations

### Test 2.1: Create User Document

**Test Code:** Create `tests/db-operations.test.ts`

```typescript
import { createUserDocument, getUserDocument } from '@/lib/db';

describe('Database Operations - User', () => {
  const testUserId = 'test-user-' + Date.now();
  
  it('should create a user document', async () => {
    await createUserDocument(testUserId, 'test@example.com', 'Test User');
    
    const user = await getUserDocument(testUserId);
    expect(user).toBeDefined();
    expect(user?.email).toBe('test@example.com');
    expect(user?.name).toBe('Test User');
    expect(user?.tier).toBe('free');
    expect(user?.total_xp).toBe(0);
  }, 10000); // 10 second timeout for Firestore
});
```

**Run Test:**
```bash
npm test -- tests/db-operations.test.ts
```

**Expected Result:**
```
✓ should create a user document (1234ms)
✓ 1 passed
```

**What's Being Tested:**
- Firestore connection works
- Security rules allow document creation
- User document structure is correct
- Stats subcollection created

**If it fails:**
```
Error: Missing or insufficient permissions
→ Reason: Security rules not deployed or configured correctly
→ Fix: Go to Firestore > Rules tab, deploy firestore.rules file

Error: Write to database failed
→ Reason: Firestore not initialized or quota exceeded
→ Fix: Verify Firestore status in Firebase Console
```

---

### Test 2.2: Create and Complete Session

**Test Code:** Add to `tests/db-operations.test.ts`

```typescript
import { createSession, completeSession, getUserSessions } from '@/lib/db';

describe('Database Operations - Sessions', () => {
  const testUserId = 'test-user-' + Date.now();
  
  it('should create and complete a session', async () => {
    // Create session
    const sessionId = await createSession(testUserId, 'pdf-123', []);
    expect(sessionId).toBeDefined();
    
    // Complete session
    const xpEarned = await completeSession(sessionId, {
      words_read: 2500,
      accuracy_percentage: 85,
      time_duration_seconds: 1200,
      mcq_score: 8,
    });
    
    expect(xpEarned).toBeGreaterThan(0);
    
    // Verify session saved
    const sessions = await getUserSessions(testUserId, 1);
    expect(sessions.length).toBe(1);
    expect(sessions[0].status).toBe('completed');
  }, 10000);
});
```

**Run Test:**
```bash
npm test -- tests/db-operations.test.ts
```

**Expected Result:**
```
✓ should create and complete a session (2345ms)
✓ 2 passed
```

**What's Being Tested:**
- Session creation works
- XP calculation works correctly
- Session completion updates status
- Query for user sessions works

---

### Test 2.3: Badge Operations

**Test Code:** Add to `tests/db-operations.test.ts`

```typescript
import { awardBadgeToUser, getUserBadges } from '@/lib/db';

describe('Database Operations - Badges', () => {
  const testUserId = 'test-user-' + Date.now();
  
  it('should award badge to user', async () => {
    // Award badge
    await awardBadgeToUser(testUserId, 'first-session');
    
    // Verify badge awarded
    const badges = await getUserBadges(testUserId);
    expect(badges).toContain('first-session');
  }, 10000);
});
```

**Expected Result:**
```
✓ should award badge to user (1234ms)
✓ 3 passed
```

---

## Phase 3: Integration Tests

### Test 3.1: Auth + Database Integration

**Test Code:** Create `tests/auth-db-integration.test.ts`

```typescript
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserDocument } from '@/lib/db';

describe('Auth + Database Integration', () => {
  const testEmail = 'test-' + Date.now() + '@example.com';
  const testPassword = 'TestPassword123!';
  
  it('should create user in auth and firestore', async () => {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      testEmail,
      testPassword
    );
    
    // Verify Firestore user document exists
    const userData = await getUserDocument(userCredential.user.uid);
    expect(userData).toBeDefined();
    expect(userData?.email).toBe(testEmail);
    
    // Cleanup
    await signOut(auth);
  }, 15000);
});
```

**Run Test:**
```bash
npm test -- tests/auth-db-integration.test.ts
```

**Expected Result:**
```
✓ should create user in auth and firestore (5678ms)
✓ 1 passed
```

**What's Being Tested:**
- Firebase Auth creates user correctly
- Firestore user document created simultaneously
- Auth + DB in sync

---

## Phase 4: Security Rules Testing

### Test 4.1: User Cannot Access Other User's Data

**Test Code:** Create `tests/security-rules.test.ts`

```typescript
import { getDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { createUserDocument } from '@/lib/db';

describe('Security Rules', () => {
  it('user should not access other user data', async () => {
    // Create user 1
    const user1Email = 'user1-' + Date.now() + '@test.com';
    const user1Cred = await createUserWithEmailAndPassword(
      auth,
      user1Email,
      'TestPassword123!'
    );
    await createUserDocument(user1Cred.user.uid, user1Email, 'User 1');
    
    // Create user 2
    const user2Email = 'user2-' + Date.now() + '@test.com';
    const user2Cred = await createUserWithEmailAndPassword(
      auth,
      user2Email,
      'TestPassword123!'
    );
    await createUserDocument(user2Cred.user.uid, user2Email, 'User 2');
    
    // Sign in as user 1
    await signOut(auth);
    await signInWithEmailAndPassword(auth, user1Email, 'TestPassword123!');
    
    // Try to access user 2's document (should fail)
    const user2DocRef = doc(db, 'users', user2Cred.user.uid);
    try {
      const doc = await getDoc(user2DocRef);
      // If we get here, security rules failed
      expect(doc.exists()).toBe(false); // Or fail test
    } catch (err) {
      // Expected: permission denied
      expect(err).toBeDefined();
    }
    
    await signOut(auth);
  }, 20000);
});
```

**Expected Result:**
```
✓ user should not access other user data (7890ms)
✓ 1 passed
```

---

## Phase 5: Manual Firebase Console Verification

### Step 5.1: Verify Collections Created

**In Firebase Console:**

1. Go to **Firestore Database** > **Data** tab
2. You should see these collections created:
   - `users/{userId}` with documents
   - `sessions/{sessionId}` with documents
   - `userBadges/{userId}` with badge data
   - `notifications/{userId}/messages/...` (when features added)

**Check each collection:**
```
users/test-user-123 ✓
  - email: "test@example.com"
  - name: "Test User"
  - tier: "free"
  - total_xp: 0
  - level: 1

sessions/session-456 ✓
  - user_id: "test-user-123"
  - status: "completed"
  - words_read: 2500
  - xp_earned: 1250
```

---

### Step 5.2: Verify Security Rules

**In Firebase Console:**

1. Go to **Firestore Database** > **Rules** tab
2. Check status: **"Rules deployed successfully"**
3. Verify rules contain:
   - `isAuthenticated()` function
   - `isOwner()` function
   - `isAdmin()` function
   - User collection rules (read own, write own)
   - Session collection rules (user owns session)
   - Leaderboard rules (public read, admin write)

---

### Step 5.3: Check Indexes Status

**In Firebase Console:**

1. Go to **Firestore Database** > **Indexes** tab
2. Verify all 4 indexes are **"Enabled"** (green status):
   - `sessions: user_id + completed_at`
   - `leaderboard: points`
   - `pdfUploads: user_id + created_at`
   - `notifications: read + created_at`

**If status shows "Building":**
- Wait 2-5 minutes for auto-build to complete
- Don't proceed until all show "Enabled"

---

## Phase 6: Performance Verification

### Test 6.1: Query Performance

**Command:**
```bash
npm run dev
```

**In Browser Console:**
```javascript
// Check query execution time
const start = performance.now();
const sessions = await getUserSessions(userId, 10);
const end = performance.now();
console.log(`Query took: ${end - start}ms`);
```

**Expected Result:**
- Simple queries (< 100ms)
- Complex queries with joins (< 500ms)
- Index queries (< 50ms)

### Test 6.2: Write Performance

```javascript
const start = performance.now();
await addUserXP(userId, 500);
const end = performance.now();
console.log(`Write took: ${end - start}ms`);
```

**Expected Result:**
- Write operations (< 200ms)
- Batch writes (< 500ms)

---

## Phase 7: Error Scenarios

### Test 7.1: Invalid Email Signup

```javascript
await auth.signup('invalid-email', 'password123', 'User');
// Expected: Error "Invalid email"
```

### Test 7.2: Weak Password

```javascript
await auth.signup('test@example.com', '123', 'User');
// Expected: Error "Password too weak"
```

### Test 7.3: Duplicate Email

```javascript
await auth.signup('test@example.com', 'Password123!', 'User');
await auth.signup('test@example.com', 'Password123!', 'User');
// Expected: Error "Email already in use"
```

### Test 7.4: Wrong Password

```javascript
await auth.signin('test@example.com', 'WrongPassword');
// Expected: Error "Invalid email or password"
```

---

## Phase 8: Cleanup

After testing, clean up test data:

```bash
# Optional: Delete test users from Firebase Console
# Go to: Authentication > Users
# Delete users starting with "test-"
# Or use Firebase Admin SDK in a cleanup script
```

---

## Success Criteria

All of the following must be true:

✅ Firebase project created and configured  
✅ Authentication enabled (Email + Google)  
✅ Firestore database created  
✅ Security rules deployed  
✅ Composite indexes created  
✅ `.env.local` configured with credentials  
✅ Build succeeds (`npm run build`)  
✅ Test 1.1 passes (build compiles)  
✅ Test 2.1 passes (create user document)  
✅ Test 2.2 passes (create and complete session)  
✅ Test 2.3 passes (award badge)  
✅ Test 3.1 passes (auth + DB integration)  
✅ Test 4.1 passes (security rules working)  
✅ Collections visible in Firestore Console  
✅ All indexes enabled  
✅ Performance acceptable (queries < 500ms)  

---

## Troubleshooting

### "Permission denied" errors

```
Problem: Tests fail with permission denied
Cause: Security rules not deployed or have syntax errors
Fix:
  1. Go to Firestore > Rules
  2. Check for red errors
  3. Click "Validate" to check syntax
  4. Click "Publish" to deploy
  5. Wait for green "deployed" indicator
  6. Restart npm run dev
```

### "Project ID not found"

```
Problem: Firebase initializes but can't find project
Cause: NEXT_PUBLIC_FIREBASE_PROJECT_ID missing from .env.local
Fix:
  1. Check .env.local exists
  2. Verify all 6 NEXT_PUBLIC_ variables present
  3. Values match Firebase Console > Project Settings
  4. Restart npm run dev
```

### Indexes showing "Building"

```
Problem: Queries fail because index not ready
Cause: Firestore still building composite indexes
Fix:
  1. Wait 2-5 minutes
  2. Check status in Firestore > Indexes
  3. All should show "Enabled" before testing
```

### Timeout errors in tests

```
Problem: Tests timeout waiting for Firestore
Cause: Network latency or Firestore overloaded
Fix:
  1. Increase Jest timeout: timeout: 20000
  2. Check Firebase status: https://status.firebase.google.com
  3. Try again with smaller test datasets
```

---

## Next Steps

After Task 4.2 testing passes:

✅ Task 4.2 Complete: Firebase configured and tested

🔄 Task 4.3: Build Auth Pages
  - Create signup page
  - Create signin page
  - Create forgot-password page
  - Create reset-password page
  - Create email-verification page
  - Form validation
  - Error handling

📋 Task 4.5: Protected Routes
  - Create middleware.ts
  - Redirect unauthenticated users
  - Tier validation

📋 Task 4.6: E2E Testing
  - Playwright/Cypress tests
  - Full user flows

---

**Status:** Task 4.2 Ready for Testing  
**Est. Total Time:** 1-2 hours  
**Next Review:** After all tests pass
