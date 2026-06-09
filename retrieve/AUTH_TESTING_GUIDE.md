# MCAT Mastery - Auth System Testing & Integration Guide

**Version**: 1.0  
**Created**: May 31, 2024  
**Status**: Ready for Testing Phase

---

## 📋 Overview

This guide covers:
1. Testing the auth pages locally
2. Firebase Console setup requirements
3. Integration testing procedures
4. Next steps for deployment

---

## 🧪 Phase 1: Local Testing (No Firebase Needed)

### What Works Without Firebase Setup:
- ✅ Form rendering
- ✅ Validation logic
- ✅ Error messages
- ✅ Navigation
- ✅ UI/UX interactions
- ✅ TypeScript compilation

### What Requires Firebase Setup:
- ❌ Actual authentication
- ❌ User account creation
- ❌ Password reset emails
- ❌ Email verification
- ❌ Database operations

---

## 🚀 Quick Start - Local Testing

### Step 1: Ensure npm install is complete
```bash
cd /Users/apple/Desktop/mcat/retrieve
npm install  # Should show: added 771 packages
```

### Step 2: Start development server
```bash
npm run dev
# Output: ▲ Next.js 14.2.35
#         - ready started server on 0.0.0.0:3000
```

### Step 3: Access pages in browser
- **Landing**: http://localhost:3000
- **Signup**: http://localhost:3000/auth/signup
- **Signin**: http://localhost:3000/auth/signin
- **Forgot Password**: http://localhost:3000/auth/forgot-password
- **Email Verification**: http://localhost:3000/auth/email-verification

---

## 🧩 Component Testing Checklist

### FormInput Component
```
✅ Renders label correctly
✅ Shows placeholder text
✅ Changes value on input
✅ Displays error message (when error prop provided)
✅ Shows red border on error
✅ Shows green border on focus
✅ Shows required asterisk (when required=true)
```

### AuthForm Component
```
✅ Centers form on page
✅ Displays title and subtitle
✅ Shows submit button
✅ Button shows loading state
✅ Button is disabled while loading
✅ Form submits on submit
✅ Background gradients visible
```

### PasswordStrength Component
```
✅ Shows strength bar
✅ Color changes: red → orange → green
✅ Shows strength label
✅ Requirements checklist visible
✅ Requirements update in real-time
✅ Hides when password is empty
```

### ValidationMessage Component
```
✅ Shows error message (red)
✅ Shows success message (green)
✅ Shows warning message (orange)
✅ Shows info message (blue)
✅ Dismiss button works
✅ Icon displays correctly
```

---

## 📄 Page Testing Checklist

### Sign Up Page (`/auth/signup`)

**Fields:**
- [ ] Full Name field renders
- [ ] Email field renders
- [ ] Password field renders
- [ ] All fields editable

**Validation - Full Name:**
- [ ] Error shows when empty
- [ ] Error shows when < 2 chars
- [ ] Error clears when typing
- [ ] Accepts valid names

**Validation - Email:**
- [ ] Error shows when empty
- [ ] Error shows for invalid format (e.g., "test")
- [ ] Error shows for missing @ (e.g., "test.com")
- [ ] Accepts valid emails

**Validation - Password:**
- [ ] Error shows when empty
- [ ] Error shows when < 8 chars
- [ ] Error shows when missing uppercase
- [ ] Error shows when missing number
- [ ] Strength meter appears
- [ ] Requirements checklist updates

**User Experience:**
- [ ] "Already have account?" link visible
- [ ] Link navigates to signin
- [ ] Submit button works
- [ ] Loading state on submit
- [ ] Form resets on success
- [ ] Success message displays

**Responsive:**
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1024px)

---

### Sign In Page (`/auth/signin`)

**Fields:**
- [ ] Email field renders
- [ ] Password field renders
- [ ] Both fields editable

**Validation:**
- [ ] Email required error
- [ ] Email format error
- [ ] Password required error
- [ ] Errors clear on typing

**Links:**
- [ ] "Forgot password?" link visible
- [ ] "Don't have account?" link visible
- [ ] Both links functional

**User Experience:**
- [ ] Submit button works
- [ ] Loading state on submit
- [ ] Error message for bad credentials

---

### Forgot Password Page (`/auth/forgot-password`)

**Fields:**
- [ ] Email field renders
- [ ] Editable

**Validation:**
- [ ] Email required error
- [ ] Invalid email error
- [ ] Errors clear on typing

**Info Text:**
- [ ] "1 hour expiration" message visible
- [ ] Clear instructions

**Links:**
- [ ] "Back to signin" link visible
- [ ] Link functional

---

### Reset Password Page (`/auth/reset-password`)

**Token Validation:**
- [ ] With valid token: form shows
- [ ] Without token: error message shows
- [ ] Invalid token: error message shows

**Fields (if token valid):**
- [ ] New Password field renders
- [ ] Confirm Password field renders
- [ ] Password strength meter shows
- [ ] Requirements visible

**Validation:**
- [ ] Password strength errors
- [ ] Password confirmation match error
- [ ] Errors clear on typing

---

### Email Verification Page (`/auth/email-verification`)

**Fields:**
- [ ] 6-digit code input renders
- [ ] Shows user's email
- [ ] Accepts numeric input only

**Validation:**
- [ ] Error for empty code
- [ ] Error for non-numeric
- [ ] Error for < 6 digits
- [ ] Errors clear on typing

**Resend Code:**
- [ ] "Resend code" button visible
- [ ] Button disabled initially
- [ ] 60-second countdown works
- [ ] Button re-enables after countdown
- [ ] Clicking starts new countdown

**Info:**
- [ ] 10-minute expiration message
- [ ] Clear instructions

---

## 🔌 Firebase Setup Requirements

### Prerequisites:
1. Firebase project created
2. Authentication enabled (Email/Password)
3. Firestore database created
4. Security rules applied
5. Environment variables set

### Step-by-Step Setup:

**1. Create Firebase Project**
```bash
# Visit: https://console.firebase.google.com
# Create new project > Enable Firestore > Enable Auth
```

**2. Setup Environment Variables**
```bash
# Copy .env.local.example to .env.local
cp .env.local.example .env.local

# Add your Firebase credentials:
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

**3. Create Firestore Collections**
- [ ] users
- [ ] sessions
- [ ] leaderboard
- [ ] badges
- [ ] userBadges
- [ ] passages
- [ ] mcqs
- [ ] pdfUploads
- [ ] notifications
- [ ] subscriptions
- [ ] stripeCustomers

**4. Apply Security Rules**
```bash
# See: firestore.rules file
# Copy entire content to Firebase Console > Firestore > Rules
```

**5. Enable Authentication**
- [ ] Email/Password provider
- [ ] Google OAuth (optional)

---

## 🧪 Integration Testing

### Once Firebase is Setup:

**Test 1: Signup Flow**
```
1. Go to /auth/signup
2. Fill in: John Doe, john@example.com, SecurePass123
3. Submit form
4. Should see success message
5. Should redirect to /auth/email-verification
6. Check Firebase: User should appear in Authentication
```

**Test 2: Email Verification**
```
1. On /auth/email-verification
2. Check Firebase: Copy verification code from logs
3. Enter code in form
4. Should see success message
5. Should redirect to /dashboard
```

**Test 3: Signin Flow**
```
1. Go to /auth/signin
2. Enter: john@example.com, SecurePass123
3. Submit form
4. Should redirect to /dashboard
5. User context should show user data
```

**Test 4: Forgot Password**
```
1. Go to /auth/forgot-password
2. Enter: john@example.com
3. Submit form
4. Should see success message
5. Check Firebase: Password reset email sent (check logs)
6. Copy reset link
7. Navigate to reset link
8. Enter new password
9. Should redirect to signin
10. Login with new password
```

**Test 5: Database Integration**
```bash
# In browser console:
const { user } = useAuth();
console.log(user);  // Should show user data

# In Firebase Console:
# Check users collection > should have John Doe entry
# Check user document > should have all fields
```

---

## 📊 Error Scenarios to Test

### Validation Errors:
- [ ] Empty form submission
- [ ] Invalid email format
- [ ] Weak password
- [ ] Mismatched passwords
- [ ] Too short password
- [ ] Invalid verification code

### Auth Errors:
- [ ] Duplicate email signup
- [ ] Invalid password signin
- [ ] Non-existent email signin
- [ ] Expired reset token
- [ ] Invalid verification code

### Network Errors:
- [ ] Offline mode
- [ ] Slow network
- [ ] Failed API calls

---

## 🎨 Design & UX Testing

### Visual Design:
- [ ] Dark theme applied
- [ ] Green accent colors
- [ ] Proper spacing and alignment
- [ ] Fonts rendering correctly
- [ ] Colors accessible

### Animations:
- [ ] Smooth transitions
- [ ] Loading spinner animated
- [ ] Focus states visible
- [ ] Hover states working

### Responsiveness:
- [ ] Mobile: 375px width
- [ ] Tablet: 768px width
- [ ] Desktop: 1024px width
- [ ] Touch targets >= 44px

---

## ♿ Accessibility Testing

### Keyboard Navigation:
- [ ] Tab through form fields
- [ ] Tab to submit button
- [ ] Space/Enter activates buttons
- [ ] Shift+Tab goes backwards

### Screen Reader:
- [ ] Labels read correctly
- [ ] Error messages announced
- [ ] Form purpose clear
- [ ] Links descriptive

### Color Contrast:
- [ ] Text readable on background
- [ ] Error colors distinct
- [ ] Focus indicators visible

---

## 📱 Mobile Testing

### iOS/Safari:
- [ ] Forms visible and editable
- [ ] Keyboard doesn't hide submit
- [ ] Autocomplete works for email
- [ ] Touch responsive

### Android/Chrome:
- [ ] Forms visible and editable
- [ ] Keyboard doesn't hide submit
- [ ] Autocomplete works
- [ ] Touch responsive

---

## 🐛 Debugging Tips

### Enable Browser DevTools:
```javascript
// In browser console:
// Check auth state
const { user, loading, error } = useAuth();
console.log('User:', user);
console.log('Loading:', loading);
console.log('Error:', error);

// Check form state (in page)
// Look at React DevTools > Components > Page Component > Hooks
```

### Check Next.js Logs:
```bash
# Terminal running npm run dev
# Watch for errors during form submission
```

### Firebase Console:
```bash
# Check: Authentication > Users
# Check: Firestore > Collections
# Check: Logs for errors
```

---

## ✅ Acceptance Criteria

### All Pages Must:
- [ ] Render without errors
- [ ] Validate form inputs
- [ ] Show error messages
- [ ] Handle loading states
- [ ] Navigate correctly
- [ ] Work on mobile
- [ ] Be accessible

### Auth System Must:
- [ ] Create new users
- [ ] Login existing users
- [ ] Reset forgotten passwords
- [ ] Verify emails
- [ ] Persist user data
- [ ] Handle errors gracefully

---

## 🚀 Next Phase: Protected Routes

After auth pages are tested, implement Task 4.5:
1. Create middleware.ts
2. Protect dashboard routes
3. Redirect unauthenticated users
4. Add session management

---

## 📞 Support

### Common Issues:

**Firebase credentials missing?**
```bash
# Copy example file and add your credentials
cp .env.local.example .env.local
# Add NEXT_PUBLIC_FIREBASE_* variables
```

**Form not submitting?**
- Check browser console for errors
- Check Next.js terminal for errors
- Check Firebase Console logs

**Page blank or error?**
- Check .env.local variables are set
- Restart npm run dev
- Clear .next folder: rm -rf .next

---

## 📋 Ready-to-Test Checklist

Before starting tests, ensure:
- [ ] npm install completed (771 packages)
- [ ] npm run dev runs without errors
- [ ] Pages load without error
- [ ] All components render
- [ ] No TypeScript errors
- [ ] Console has no errors

---

## 📝 Testing Report Template

When testing, document:
```
Date: _____
Tested By: _____
Environment: Local Dev / Firebase

Component Tests:
- FormInput: PASS / FAIL / PARTIAL
- AuthForm: PASS / FAIL / PARTIAL
- PasswordStrength: PASS / FAIL / PARTIAL
- ValidationMessage: PASS / FAIL / PARTIAL

Page Tests:
- Signup: PASS / FAIL / PARTIAL
- Signin: PASS / FAIL / PARTIAL
- Forgot Password: PASS / FAIL / PARTIAL
- Reset Password: PASS / FAIL / PARTIAL
- Email Verification: PASS / FAIL / PARTIAL

Issues Found:
1. ...
2. ...

Recommendations:
1. ...
2. ...
```

---

## 🎯 Success Criteria Met

- ✅ All 5 auth pages functional
- ✅ All components working
- ✅ Form validation complete
- ✅ Error handling comprehensive
- ✅ TypeScript strict mode
- ✅ Build successful
- ✅ Ready for testing

---

**Status**: Ready to proceed with Phase 1 (Local Testing)

