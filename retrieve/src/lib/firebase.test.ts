import {
  buildFirebaseConfig,
  ensureFirebaseAuthAvailable,
  ensureFirebaseFirestoreAvailable,
  isFirebaseConfigured,
} from './firebase';

describe('firebase configuration helpers', () => {
  it('treats missing Firebase environment variables as unconfigured', () => {
    const config = buildFirebaseConfig({});

    expect(isFirebaseConfigured(config)).toBe(false);
  });

  it('treats a complete Firebase environment as configured', () => {
    const config = buildFirebaseConfig({
      NEXT_PUBLIC_FIREBASE_API_KEY: 'api-key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'example-project',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'example.appspot.com',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      NEXT_PUBLIC_FIREBASE_APP_ID: '1:123456789:web:abc123',
    });

    expect(isFirebaseConfigured(config)).toBe(true);
  });

  it('throws a clear error when Firebase Auth is unavailable', () => {
    expect(() => ensureFirebaseAuthAvailable(null)).toThrow(
      'Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables to enable authentication.'
    );
  });

  it('throws a clear error when Firestore is unavailable', () => {
    expect(() => ensureFirebaseFirestoreAvailable(null)).toThrow(
      'Firestore is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables to enable database access.'
    );
  });
});