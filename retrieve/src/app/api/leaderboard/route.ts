import { NextRequest, NextResponse } from 'next/server';
import { db, ensureFirebaseFirestoreAvailable } from '@/lib/firebase';
import { collection, getDocs, limit as firestoreLimit, orderBy, query } from 'firebase/firestore';

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

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
    );
    const weekId =
      type === 'weekly'
        ? `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`
        : 'alltime';

    let entries: any[] = [];
    const firestore = db;
    if (firestore) {
      const q = query(
        collection(firestore, 'leaderboard'),
        orderBy('weeklyXP', 'desc'),
        firestoreLimit(limit)
      );
      const snapshot = await getDocs(q);
      entries = snapshot.docs.map((doc, idx) => {
        const data = doc.data();
        const username = data.displayName || data.username || 'Anonymous';
        const points = data.weeklyXP || data.points || 0;
        return {
          id: doc.id,
          user_id: doc.id,
          rank: idx + 1,
          points,
          weeklyXP: points,
          username,
          displayName: username,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
          session_count: data.totalSessions || 0,
          accuracy_avg: data.avgAccuracy || 0,
          current_streak: data.currentStreak || 0,
          ...data
        };
      });
    }

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
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
