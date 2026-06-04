import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/stripe/checkout  —  MOCK IMPLEMENTATION
 *
 * Simulates a Stripe Checkout Session for development/demo purposes.
 * Returns a mock session URL that redirects straight to the success page.
 *
 * To switch to real Stripe: replace this file with the production implementation
 * and set STRIPE_SECRET_KEY + STRIPE_PRICE_ID in environment variables.
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

    // Generate a mock session ID
    const mockSessionId = `mock_cs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Simulate the Stripe hosted checkout by going straight to success
    // In production this would be a real Stripe-hosted URL
    const mockCheckoutUrl = `${baseUrl}/payment/success?session_id=${mockSessionId}&mock=true&plan=${plan}`;

    console.log(`[MOCK STRIPE] Checkout session created for ${userEmail} (${plan} plan)`);
    console.log(`[MOCK STRIPE] Session ID: ${mockSessionId}`);

    return NextResponse.json(
      {
        url: mockCheckoutUrl,
        sessionId: mockSessionId,
        mock: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mock Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
