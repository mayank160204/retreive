// Firebase configuration and initialization

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function buildFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };
}

export function isFirebaseConfigured(config: FirebaseConfig = buildFirebaseConfig()): boolean {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.storageBucket &&
      config.messagingSenderId &&
      config.appId
  );
}

const firebaseConfig = buildFirebaseConfig();
const firebaseEnabled = isFirebaseConfigured(firebaseConfig);

export const app: FirebaseApp | null = firebaseEnabled ? initializeApp(firebaseConfig) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;

export function ensureFirebaseAuthAvailable(authInstance: Auth | null = auth): Auth {
  if (!authInstance) {
    throw new Error('Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables to enable authentication.');
  }
  return authInstance;
}

export function ensureFirebaseFirestoreAvailable(dbInstance: Firestore | null = db): Firestore {
  if (!dbInstance) {
    throw new Error('Firestore is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables to enable database access.');
  }
  return dbInstance;
}

if (auth) {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('Failed to set persistence:', error);
  });
}

export default app;
