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
  type ConfirmationResult,
} from 'firebase/auth';
import { auth, ensureFirebaseAuthAvailable, isFirebaseConfigured } from './firebase';
import { getUserDocument, createUserDocument } from './db';
import { User } from '@/types';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      setError('Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env variables to enable authentication.');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user document from Firestore
          const userData = await getUserDocument(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            // Write session cookie for middleware route protection
            const token = await firebaseUser.getIdToken();
            document.cookie = `__session=${token}; path=/; max-age=86400`;
          } else {
            // Create user document if it doesn't exist
            const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
            await createUserDocument(firebaseUser.uid, firebaseUser.email || '', name);
            const newUserData = await getUserDocument(firebaseUser.uid);
            if (newUserData) {
              setUser(newUserData);
              const token = await firebaseUser.getIdToken();
              document.cookie = `__session=${token}; path=/; max-age=86400`;
            }
          }
        } else {
          // Check if there is a mock session cookie
          const cookies = typeof document !== 'undefined' ? document.cookie : '';
          const hasMockSession = cookies.includes('__session=mock-token-');
          if (hasMockSession) {
            // Restore demo user to prevent redirect loops
            setUser({
              id: 'demo-user',
              email: 'demo@retreive.com',
              name: 'Demo User',
              tier: 'free',
              total_xp: 840,
              current_streak: 12,
            } as User);
          } else {
            setUser(null);
            document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          }
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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

      // Create user document in Firestore
      await createUserDocument(userCredential.user.uid, email, name);

      // Fetch and set user state
      const userData = await getUserDocument(userCredential.user.uid);
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      
      // DEMO MODE FALLBACK
      if (message.includes('api-key-not-valid') || message.includes('invalid-api-key') || message.includes('not configured')) {
        console.warn('[MOCK AUTH] Falling back to demo session due to Firebase config error.');
        document.cookie = `__session=mock-token-${Date.now()}; path=/; max-age=86400`;
        setUser({
          id: 'demo-user',
          email,
          name: name || email.split('@')[0],
          tier: 'free',
          total_xp: 0,
          current_streak: 0,
        } as User);
        return;
      }

      setError(message);
      throw err;
    }
  };

  // Email/Password Sign In
  const signin = async (email: string, password: string) => {
    try {
      const firebaseAuth = ensureFirebaseAuthAvailable(auth);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

      // Fetch and set user state
      const userData = await getUserDocument(userCredential.user.uid);
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // DEMO MODE FALLBACK
      if (message.includes('api-key-not-valid') || message.includes('invalid-api-key') || message.includes('not configured')) {
        console.warn('[MOCK AUTH] Falling back to demo session due to Firebase config error.');
        document.cookie = `__session=mock-token-${Date.now()}; path=/; max-age=86400`;
        setUser({
          id: 'demo-user',
          email,
          name: email.split('@')[0],
          tier: 'free',
          total_xp: 840,
          current_streak: 12,
        } as User);
        return;
      }

      setError(message);
      throw err;
    }
  };

  // Google Sign In
  const signinWithGoogle = async () => {
    try {
      const firebaseAuth = ensureFirebaseAuthAvailable(auth);
      setError(null);
      const googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('profile');
      googleProvider.addScope('email');

      const userCredential = await signInWithPopup(firebaseAuth, googleProvider);
      const googleUser = userCredential.user;

      // Check if user exists, if not create document
      let userData = await getUserDocument(googleUser.uid);
      if (!userData) {
        await createUserDocument(
          googleUser.uid,
          googleUser.email || '',
          googleUser.displayName || googleUser.email?.split('@')[0] || 'User'
        );
        userData = await getUserDocument(googleUser.uid);
      }

      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      if (!message.includes('popup-blocked') && !message.includes('cancelled')) {
        setError(message);
      }
      throw err;
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
      const phoneUser = userCredential.user;

      // Create user document if it doesn't exist
      let userData = await getUserDocument(phoneUser.uid);
      if (!userData) {
        await createUserDocument(
          phoneUser.uid,
          phoneUser.email || phoneUser.phoneNumber || '',
          phoneUser.displayName || 'User'
        );
        userData = await getUserDocument(phoneUser.uid);
      }

      if (userData) {
        setUser(userData);
      }
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
      // Clear mock cookie if it exists
      document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      if (auth && isFirebaseConfigured()) {
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

