import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/session
 * Verifies the ID token and sets a secure HttpOnly cookie.
 */
export async function POST(request: NextRequest) {
  console.log('POST /api/auth/session: Request received');
  try {
    let body: { idToken?: string };
    try {
      body = await request.json();
    } catch {
      console.warn('POST /api/auth/session: Invalid request body');
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { idToken } = body;
    if (!idToken) {
      console.warn('POST /api/auth/session: Missing idToken');
      return NextResponse.json({ error: 'idToken is required.' }, { status: 400 });
    }
    console.log('POST /api/auth/session: Token received, verifying with Google...');

    // Verify token validity by calling Google identity toolkit lookup endpoint
    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error('Google identity toolkit verification failed:', errorText);
      return NextResponse.json(
        { error: 'Invalid or expired authentication token.' },
        { status: 401 }
      );
    }

    console.log('POST /api/auth/session: Token verified successfully, setting session cookie...');
    const res = NextResponse.json({ success: true }, { status: 200 });
    
    // Set cookie with HttpOnly, Secure, SameSite=Strict server-side
    res.cookies.set('__session', idToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
    });

    console.log('POST /api/auth/session: Session cookie set, sending response.');
    return res;
  } catch (error) {
    console.error('Session endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Clears the secure HttpOnly cookie on logout.
 */
export async function DELETE() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set('__session', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res;
}
