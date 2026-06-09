import { NextRequest } from 'next/server';

export interface DecodedToken {
  uid: string;
  email: string;
  name?: string;
}

/**
 * Verifies the session cookie or authorization header token and returns the decoded user.
 */
export async function verifyTokenAndGetUser(request: NextRequest): Promise<DecodedToken | null> {
  try {
    const sessionCookie = request.cookies.get('__session')?.value;
    const authHeader = request.headers.get('Authorization');
    
    let token = sessionCookie;
    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
    
    if (!token) return null;

    // Verify token using Google Identity Toolkit REST API
    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });

    if (!verifyResponse.ok) {
      return null;
    }

    const { users } = await verifyResponse.json();
    if (!users || users.length === 0) {
      return null;
    }

    const user = users[0];
    return {
      uid: user.localId,
      email: user.email || '',
      name: user.displayName,
    };
  } catch (error) {
    console.error('verifyTokenAndGetUser error:', error);
    return null;
  }
}
