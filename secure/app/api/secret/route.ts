export async function GET(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || auth !== `Bearer ${expected}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  return Response.json({ secret: 'PRIVILEGED_DATA_REDIRECT', timestamp: Date.now() });
}
