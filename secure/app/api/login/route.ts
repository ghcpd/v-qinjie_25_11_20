import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { token } = await request.json();
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }
  const cookieStore = cookies();
  cookieStore.set('admin_token', expected, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  });
  return Response.json({ ok: true });
}
