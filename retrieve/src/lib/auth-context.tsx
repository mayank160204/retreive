// Enhanced Authentication context with Google OAuth and Phone OTP

'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth, ensureFirebaseAuthAvailable, firebaseEnabled } from './firebase';
import { User } from '@/types';

const mapFirebaseUserToUser = (firebaseUser: any): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.displayName || 'User'}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.displayName || 'User'}`,
    created_at: new Date(),
    createdAt: new Date(),
    tier: 'free',
    subscription_id: null,
    subscriptionId: null,
    subscription_status: null,
    subscriptionStatus: null,
    total_xp: 0,
    totalXP: 0,
    level: 1,
    current_streak: 0,
    currentStreak: 0,
    longest_streak: 0,
    longestStreak: 0,
    sessions_completed: 0,
    sessionsCompleted: 0,
    total_sessions: 0,
    totalSessions: 0,
    average_accuracy: 0,
    averageAccuracy: 0,
    avgAccuracy: 0,
    weeklyXP: 0,
    weeklyXPResetDate: '',
  };
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  // Email/Password methods
  signup: (email: string, password: string, name: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // Google OAuth
  signinWithGoogle: () => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  // Phone OTP
  sendPhoneOTP: (phoneNumber: string) => Promise<ConfirmationResult | null>;
  verifyPhoneOTP: (otp: string, confirmationResult: ConfirmationResult) => Promise<void>;
  // General
  signout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const setSessionCookie = async (token: string) => {
  try {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });
    if (!res.ok) {
      console.error('Failed to set session cookie. Status:', res.status);
      const errText = await res.text();
      console.error('Session API response:', errText);
    }
  } catch (err) {
    console.error('Failed to set session cookie:', err);
  }
};

const clearSessionCookie = async () => {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch (err) {
    console.error('Failed to clear session cookie:', err);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setLoading(false);
      setError('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env variables to enable authentication.');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const isDev = process.env.NODE_ENV === 'development';
          const isVerifiedOrSocial = firebaseUser.emailVerified || isDev || 
            firebaseUser.providerData?.some((p: any) => 
              p.providerId === 'google.com' || p.providerId === 'phone'
            );

          if (!isVerifiedOrSocial) {
            const firebaseAuth = ensureFirebaseAuthAvailable(auth);
            await signOut(firebaseAuth);
            setUser(null);
            await clearSessionCookie();
          } else {
            const mappedUser = mapFirebaseUserToUser(firebaseUser);
            setUser(mappedUser);
            
            // Fetch Firestore profile asynchronously so a hanging Firestore connection
            // does NOT block the auth loading state and leave the UI hung on the spinner.
            import('@/lib/db')
              .then(({ getUserDocument }) => {
                getUserDocument(firebaseUser.uid)
                  .then((dbUser) => {
                    if (dbUser) {
                      setUser((prev) => (prev ? { ...prev, ...dbUser } : dbUser));
                    }
                  })
                  .catch((err) => {
                    console.error('Failed to load user document from Firestore:', err);
                  });
              })
              .catch((err) => {
                console.error('Failed to import db module:', err);
              });
            
            const token = await firebaseUser.getIdToken();
            await setSessionCookie(token);
          }
        } else {
          setUser(null);
          await clearSessionCookie();
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        const message = err instanceof Error ? err.message : String(err);
        setError(`Database connection error: ${message}`);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (!auth?.currentUser) return;
    try {
      const { getUserDocument } = await import('@/lib/db');
      const dbUser = await getUserDocument(auth.currentUser.uid);
      if (dbUser) {
        setUser(prev => prev ? { ...prev, ...dbUser } : dbUser);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  // Initialize reCAPTCHA verifier for phone auth (browser only)
  useEffect(() => {
    if (typeof window !== 'undefined' && auth) {
      try {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response: any) => {
            console.log('reCAPTCHA verified', response);
          },
          'error-callback': (error: any) => {
            console.error('reCAPTCHA error:', error);
            setError('reCAPTCHA verification failed. Please try again.');
          },
        });
        setRecaptchaVerifier(verifier);
      } catch (err) {
        console.warn('Could not initialize reCAPTCHA:', err);
      }
    }
  }, []);

  // Email/Password Sign Up
  const signup = async (email: string, password: string, name: string) => {
    try {
      const firebaseAuth = ensureFirebaseAuthAvailable(auth);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, { displayName: name });

      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        const mappedUser = mapFirebaseUserToUser(userCredential.user);
        let dbUser = null;
        try {
          const { getUserDocument, createUserDocument } = await import('@/lib/db');
          dbUser = await getUserDocument(userCredential.user.uid);
          if (!dbUser) {
            await createUserDocument(userCredential.user.uid, mappedUser.email, name);
            dbUser = await getUserDocument(userCredential.user.uid);
          }
        } catch (dbErr) {
          console.warn('Failed to load/create Firestore document during signup:', dbErr);
        }
        const finalUser = dbUser ? { ...mappedUser, ...dbUser } : mappedUser;
        setUser(finalUser);
        const token = await userCredential.user.getIdToken();
        await setSessionCookie(token);
      } else {
        // Send verification email
        const { sendEmailVerification } = await import('firebase/auth');
        await sendEmailVerification(userCredential.user);

        // DO NOT sign them in automatically - sign them out immediately
        await signOut(firebaseAuth);
        setUser(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    }
  };

  // Email/Password Sign In
  const signin = async (email: string, password: string) => {
    try {
      const firebaseAuth = ensureFirebaseAuthAvailable(auth);
      setError(null);
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

      // Block unverified email users in production, but bypass in development
      const isDev = process.env.NODE_ENV === 'development';
      if (!userCredential.user.emailVerified && !isDev) {
        await signOut(firebaseAuth);
        setUser(null);
        throw new Error('email-not-verified');
      }

      const mappedUser = mapFirebaseUserToUser(userCredential.user);
      
      // Load user profile from DB synchronously before finishing signin
      let dbUser = null;
      try {
        const { getUserDocument, createUserDocument } = await import('@/lib/db');
        dbUser = await getUserDocument(userCredential.user.uid);
        if (!dbUser) {
          await createUserDocument(
            userCredential.user.uid,
            mappedUser.email,
            mappedUser.name
          );
          dbUser = await getUserDocument(userCredential.user.uid);
        }
      } catch (dbErr) {
        console.warn('Failed to load/create Firestore document during signin:', dbErr);
      }
      const finalUser = dbUser ? { ...mappedUser, ...dbUser } : mappedUser;
      setUser(finalUser);

      const token = await userCredential.user.getIdToken();
      await setSessionCookie(token);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const signinWithGoogle = async () => {
    try {
      const firebaseAuth = ensureFirebaseAuthAvailable(auth);
      setError(null);
      setLoading(true);
      const googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('profile');
      googleProvider.addScope('email');

      let userCredential;
      try {
        userCredential = await signInWithPopup(firebaseAuth, googleProvider);
      } catch (popupErr: any) {
        if (popupErr.code === 'auth/popup-blocked' || popupErr.message?.includes('popup-blocked')) {
          console.warn('Popup blocked, falling back to signInWithRedirect');
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(firebaseAuth, googleProvider);
          return;
        }
        throw popupErr;
      }
      const mappedUser = mapFirebaseUserToUser(userCredential.user);

      // Load user profile from DB synchronously before finishing signin
      let dbUser = null;
      try {
        const { getUserDocument, createUserDocument } = await import('@/lib/db');
        dbUser = await getUserDocument(userCredential.user.uid);
        if (!dbUser) {
          // If they are signing up via Google, create the document first
          await createUserDocument(userCredential.user.uid, mappedUser.email, mappedUser.name);
          dbUser = await getUserDocument(userCredential.user.uid);
        }
      } catch (dbErr) {
        console.warn('Failed to load/create Firestore document during Google signin:', dbErr);
      }

      const finalUser = dbUser ? { ...mappedUser, ...dbUser } : mappedUser;
      setUser(finalUser);

      const token = await userCredential.user.getIdToken();
      await setSessionCookie(token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      if (!message.includes('popup-blocked') && !message.includes('cancelled')) {
        setError(message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up (same as sign in)
  const signupWithGoogle = async () => {
    return signinWithGoogle();
  };

  // Send Phone OTP
  const sendPhoneOTP = async (phoneNumber: string): Promise<ConfirmationResult | null> => {
    try {
      const firebaseAuth = ensureFirebaseAuthAvailable(auth);
      setError(null);

      if (!recaptchaVerifier) {
        setError('reCAPTCHA not initialized. Please refresh and try again.');
        return null;
      }

      const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
      throw err;
    }
  };

  // Verify Phone OTP
  const verifyPhoneOTP = async (otp: string, confirmationResult: ConfirmationResult) => {
    try {
      setError(null);
      const userCredential = await confirmationResult.confirm(otp);
      const mappedUser = mapFirebaseUserToUser(userCredential.user);
      setUser(mappedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid OTP';
      setError(message);
      throw err;
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      const firebaseAuth = ensureFirebaseAuthAvailable(auth);
      setError(null);
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    }
  };

  // Sign Out
  const signout = async () => {
    try {
      await clearSessionCookie();
      
      if (auth && firebaseEnabled) {
        await signOut(auth);
      }
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signout failed';
      setError(message);
      throw err;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signup,
      signin,
      resetPassword,
      signinWithGoogle,
      signupWithGoogle,
      sendPhoneOTP,
      verifyPhoneOTP,
      signout,
      clearError,
      refreshUser,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

