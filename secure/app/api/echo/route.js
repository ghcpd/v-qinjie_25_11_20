import sanitize from 'sanitize-html'

export async function POST(request) {
  try {
    const body = await request.json();
    // Validate and sanitize user input on server
    const message = sanitize(String(body.message), { allowedTags: [], allowedAttributes: {} });

    // Use server-side secret (no client leak)
    const secret = process.env.SECURE_API_KEY || 'no-secret-set';

    // DO NOT log secrets; only log benign events
    console.log('[SECURE_API] message received');

    return new Response(JSON.stringify({ reply: `Echo (secure): ${message}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
