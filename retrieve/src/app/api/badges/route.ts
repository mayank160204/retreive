import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

/**
 * GET /api/badges — Returns all available badge definitions
 *
 * These are public/static records read from Firestore's `badges` collection.
 * Cached aggressively since badge definitions rarely change.
 */
export async function GET(_request: NextRequest) {
  try {
    const defaultBadges = [
      { id: 'first-session', name: 'First Session', description: 'Completed your first study session!', icon: '🎓', unlock_condition: 'Complete 1 session', rarity: 'common', unlocked_at: null },
      { id: 'streak-3', name: '3-Day Streak', description: 'Maintained a study streak for 3 days.', icon: '🔥', unlock_condition: '3 day streak', rarity: 'common', unlocked_at: null },
      { id: 'accuracy-90', name: 'Precision Scholar', description: 'Achieved 90% accuracy in a session.', icon: '🎯', unlock_condition: '90% accuracy', rarity: 'uncommon', unlocked_at: null },
    ];

    let badges = [];
    const firestore = db;
    if (firestore) {
      const badgesRef = collection(firestore, 'badges');
      const snapshot = await getDocs(badgesRef);
      if (snapshot.empty) {
        // Initialize/seed the collection in Firestore
        for (const badge of defaultBadges) {
          await setDoc(doc(badgesRef, badge.id), badge);
        }
        badges = defaultBadges;
      } else {
        badges = snapshot.docs.map(d => d.data());
      }
    } else {
      badges = defaultBadges;
    }

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
