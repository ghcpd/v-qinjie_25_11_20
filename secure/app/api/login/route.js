import { serialize } from 'cookie'

async function parseBody(request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await request.json();
  }
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    return Object.fromEntries(params.entries());
  }
  return {};
}

export async function POST(request) {
  const body = await parseBody(request);
  const username = body.username;
  const password = body.password;
  // In real app: validate against DB; here, use environment-stored credentials
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'adminpass';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // create simple token and set httpOnly cookie
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    const cookie = serialize('secure-auth', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 // 1 hour
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: false }), { status: 401, headers: { 'Content-Type': 'application/json' } });
}
