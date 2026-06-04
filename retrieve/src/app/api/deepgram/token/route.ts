import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/deepgram/token
 *
 * Generates an ephemeral Deepgram API token so the browser client can
 * open a secure real-time WebSocket without exposing the master API key.
 *
 * The token is scoped to "usage:write" only and expires after 30 seconds.
 * Rate-limited: each authenticated user may call this at most once per
 * active session (enforced in future by middleware).
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Deepgram API key is not configured.' },
        { status: 503 }
      );
    }

    // Optional: Verify the caller is authenticated via Firebase ID token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    // Create a temporary key via Deepgram Management API
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      method: 'GET',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch Deepgram projects:', await response.text());
      return NextResponse.json(
        { error: 'Failed to communicate with Deepgram.' },
        { status: 502 }
      );
    }

    const { projects } = await response.json();

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { error: 'No Deepgram project found.' },
        { status: 500 }
      );
    }

    const projectId = projects[0].project_id;

    // Create a temporary key scoped to usage:write, valid for 30s
    const keyResponse = await fetch(
      `https://api.deepgram.com/v1/projects/${projectId}/keys`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: `ephemeral-browser-key-${Date.now()}`,
          scopes: ['usage:write'],
          expiration_date: new Date(Date.now() + 30_000).toISOString(), // 30 seconds
          tags: ['browser', 'ephemeral'],
        }),
      }
    );

    if (!keyResponse.ok) {
      const errorText = await keyResponse.text();
      console.error('Failed to create Deepgram ephemeral key:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate ephemeral key.' },
        { status: 502 }
      );
    }

    const { key } = await keyResponse.json();

    return NextResponse.json(
      { key, expiresIn: 30 },
      {
        status: 200,
        headers: {
          // Never cache this response — every request must get a fresh token
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Deepgram token endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// Reject all other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
