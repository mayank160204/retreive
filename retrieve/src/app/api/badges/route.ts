import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/badges — Returns all available badge definitions
 *
 * These are public/static records read from Firestore's `badges` collection.
 * Cached aggressively since badge definitions rarely change.
 */
export async function GET(_request: NextRequest) {
  try {
    const { getAllBadges } = await import('@/lib/db');
    const badges = await getAllBadges();

    return NextResponse.json(
      { badges },
      {
        status: 200,
        headers: {
          // Badges are static; cache for 5 minutes
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Badges fetch error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
