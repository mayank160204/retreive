import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware — Route Protection for RETREIVE
 *
 * What's protected (requires authentication):
 * - /dashboard  — the real React dashboard (future)
 *
 * What's PUBLIC (no auth needed):
 * - /screens    — the app simulator/demo (always accessible)
 * - /           — marketing landing page
 * - /auth/*     — signin, signup, forgot-password pages
 * - /api/badges, /api/leaderboard, /api/stripe/webhook, /api/stripe/checkout
 *
 * Auth strategy: checks for __session or auth_token cookie.
 * API routes do full token verification themselves.
 */

// Only real production pages behind auth (not the simulator)
const PROTECTED_PATHS = [
  '/dashboard',
  '/upload',
  '/reader',
  '/quiz',
  '/summary'
];

// Auth-related pages — redirect already-authed users away
const AUTH_ONLY_PATHS = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
];

// Public API routes (no auth header needed)
const PUBLIC_API_PATHS = [
  '/api/badges',
  '/api/leaderboard',
  '/api/stripe/webhook',
  '/api/stripe/checkout', // Mock checkout is public
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isPublicApiPath(pathname: string): boolean {
  return PUBLIC_API_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isProtectedApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/') && !isPublicApiPath(pathname);
}

function hasSessionCookie(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('__session')?.value;
  const authToken = request.cookies.get('auth_token')?.value;
  const authHeader = request.headers.get('Authorization');
  return Boolean(sessionCookie || authToken || authHeader?.startsWith('Bearer '));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = hasSessionCookie(request);

  // Protect non-public API routes
  if (isProtectedApiPath(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect real page routes (just /dashboard for now)
  if (isProtectedPath(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Redirect already-authenticated users away from auth pages
  if (isAuthOnlyPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)',],
};
