import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15' as any,
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function updateUserTier(
  firebaseUserId: string,
  tier: 'free' | 'unlimited'
) {
  try {
    const { db } = await import('@/lib/firebase');
    if (!db) {
      console.warn('[STRIPE] Firestore not configured — skipping tier update');
      return;
    }
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    const userRef = doc(db, 'users', firebaseUserId);
    await updateDoc(userRef, {
      tier,
      subscription_status: tier === 'unlimited' ? 'active' : 'inactive',
      subscriptionStatus: tier === 'unlimited' ? 'active' : 'inactive',
      updatedAt: serverTimestamp(),
    });
    console.log(`[STRIPE] Updated user ${firebaseUserId} → tier: ${tier}`);
  } catch (error) {
    console.warn('[STRIPE] Could not update Firestore tier:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    let event: any;
    let userId: string | null = null;
    let eventType = '';

    if (stripe && webhookSecret) {
      const rawBody = await request.text();
      const signature = request.headers.get('stripe-signature');
      
      if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
      }

      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error(`[STRIPE WEBHOOK] Signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
      }

      eventType = event.type;
      
      // Extract userId from session metadata
      const session = event.data.object as any;
      userId = session.metadata?.userId || session.client_reference_id || null;
    } else {
      // Fallback to mock behavior in development
      if (process.env.NODE_ENV === 'production') {
        console.error('[STRIPE WEBHOOK] Webhook secrets are missing in production.');
        return NextResponse.json({ error: 'Webhook configuration error.' }, { status: 500 });
      }

      let body: { event?: string; userId?: string };
      try {
        body = await request.json();
      } catch {
        return NextResponse.json({ error: 'Invalid mock payload.' }, { status: 400 });
      }

      eventType = body.event || 'checkout.session.completed';
      userId = body.userId || null;
      
      console.log(`[MOCK STRIPE WEBHOOK] Simulating event: ${eventType} for user: ${userId}`);
    }

    if (!userId) {
      console.warn(`[STRIPE WEBHOOK] No userId found in event: ${eventType}`);
      return NextResponse.json({ received: true, processed: false, reason: 'No userId' });
    }

    switch (eventType) {
      case 'checkout.session.completed':
        await updateUserTier(userId, 'unlimited');
        break;

      case 'subscription.cancelled':
      case 'customer.subscription.deleted':
        await updateUserTier(userId, 'free');
        break;

      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event: ${eventType}`);
    }

    return NextResponse.json(
      { received: true, mock: !stripe, event: eventType, userId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
