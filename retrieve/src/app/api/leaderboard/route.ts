import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/leaderboard?type=weekly&limit=10
 *
 * Returns the leaderboard rankings from Firestore.
 * type: "weekly" (default) | "alltime"
 * limit: number of entries to return (default 10, max 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'weekly';
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const limit = Math.min(Math.max(limitParam, 1), 50); // clamp between 1-50

    const { getWeeklyLeaderboard } = await import('@/lib/db');

    // Calculate current week ID (ISO week format: YYYY-WXX)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
    );
    const weekId =
      type === 'weekly'
        ? `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`
        : 'alltime';

    const entries = await getWeeklyLeaderboard(weekId, limit);

    return NextResponse.json(
      {
        weekId,
        type,
        entries,
        fetchedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          // Cache leaderboard for 60 seconds to reduce Firestore reads
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
