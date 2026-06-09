import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15' as any,
    })
  : null;

const STRIPE_PRICE_ID_MONTHLY = process.env.STRIPE_PRICE_ID_MONTHLY || 'price_monthly_placeholder';
const STRIPE_PRICE_ID_YEARLY = process.env.STRIPE_PRICE_ID_YEARLY || 'price_yearly_placeholder';

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for subscriptions, with a development fallback.
 */
export async function POST(request: NextRequest) {
  try {
    let body: { userId?: string; userEmail?: string; plan?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { userId, userEmail, plan = 'monthly' } = body;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'userId and userEmail are required.' },
        { status: 400 }
      );
    }

    const requestOrigin = request.nextUrl.origin;
    const baseUrl = requestOrigin || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (!stripe) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[STRIPE] Missing STRIPE_SECRET_KEY in production environment.');
        return NextResponse.json(
          { error: 'Payment processor is not configured.' },
          { status: 500 }
        );
      }

      // Generate a mock session ID for local testing
      const mockSessionId = `mock_cs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const mockCheckoutUrl = `${baseUrl}/payment/success?session_id=${mockSessionId}&mock=true&plan=${plan}`;

      console.log(`[MOCK STRIPE] Checkout session created for ${userEmail} (${plan} plan)`);
      return NextResponse.json(
        {
          url: mockCheckoutUrl,
          sessionId: mockSessionId,
          mock: true,
        },
        { status: 200 }
      );
    }

    const priceId = plan === 'yearly' ? STRIPE_PRICE_ID_YEARLY : STRIPE_PRICE_ID_MONTHLY;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${baseUrl}/profile`,
      customer_email: userEmail,
      metadata: {
        userId,
      },
    });

    console.log(`[STRIPE] Checkout session created for ${userEmail}. ID: ${session.id}`);
    return NextResponse.json(
      {
        url: session.url,
        sessionId: session.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
