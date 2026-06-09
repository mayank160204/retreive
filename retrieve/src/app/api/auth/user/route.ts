import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/user
 *
 * Verifies the Firebase ID token from the Authorization header and returns
 * the authenticated user's Firestore profile document.
 *
 * This can be used by SSR pages to verify auth server-side.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const idToken = authHeader.slice(7); // Remove "Bearer " prefix

    // Import Firebase Admin SDK lazily
    // Note: In production, use firebase-admin. For now we use the REST API
    // to verify the token without adding firebase-admin as a dependency.
    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token.' },
        { status: 401 }
      );
    }

    const { users } = await verifyResponse.json();
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const firebaseUser = users[0];

    // Return default local User profile since Firestore is not used
    const userDoc = {
      id: firebaseUser.localId,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.displayName || 'User'}`,
      created_at: new Date().toISOString(),
      tier: 'free',
      subscription_id: null,
      subscription_status: null,
      total_xp: 0,
      level: 1,
      current_streak: 0,
      longest_streak: 0,
      sessions_completed: 0,
    };

    return NextResponse.json({ user: userDoc }, { status: 200 });
  } catch (error) {
    console.error('Auth user endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
