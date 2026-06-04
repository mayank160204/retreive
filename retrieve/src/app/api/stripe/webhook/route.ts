import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/stripe/webhook  —  MOCK IMPLEMENTATION
 *
 * Simulates Stripe webhook events for development/demo purposes.
 * Accepts a simplified payload and updates the user's Firestore tier directly
 * without verifying a Stripe signature.
 *
 * Supported mock events:
 *   - checkout.session.completed  → upgrade user to "unlimited"
 *   - subscription.cancelled      → downgrade user to "free"
 *
 * Body: { event: string, userId: string }
 *
 * To switch to real Stripe: replace this file with the production webhook handler
 * that verifies STRIPE_WEBHOOK_SECRET signatures.
 */

async function updateUserTier(
  firebaseUserId: string,
  tier: 'free' | 'unlimited'
) {
  try {
    const { db } = await import('@/lib/firebase');
    if (!db) {
      console.warn('[MOCK STRIPE] Firestore not configured — skipping tier update');
      return;
    }
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    const userRef = doc(db, 'users', firebaseUserId);
    await updateDoc(userRef, {
      tier,
      subscriptionStatus: tier === 'unlimited' ? 'active' : 'inactive',
      updatedAt: serverTimestamp(),
    });
    console.log(`[MOCK STRIPE] Updated user ${firebaseUserId} → tier: ${tier}`);
  } catch (error) {
    // If Firestore not configured (no env vars), just log and continue
    console.warn('[MOCK STRIPE] Could not update Firestore tier:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: { event?: string; userId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { event = 'checkout.session.completed', userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    console.log(`[MOCK STRIPE] Received event: ${event} for user: ${userId}`);

    switch (event) {
      case 'checkout.session.completed':
        await updateUserTier(userId, 'unlimited');
        break;

      case 'subscription.cancelled':
      case 'customer.subscription.deleted':
        await updateUserTier(userId, 'free');
        break;

      default:
        console.log(`[MOCK STRIPE] Unhandled event: ${event}`);
    }

    return NextResponse.json(
      { received: true, mock: true, event, userId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mock Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
