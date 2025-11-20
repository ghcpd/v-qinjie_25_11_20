export async function GET() {
  return Response.json({
    username: 'admin',
    roles: ['admin'],
    // No tokens or secrets exposed
  });
}
