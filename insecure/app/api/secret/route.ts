// Vulnerable API: exposes master secret without authentication
export async function GET() {
  return Response.json({ secret: "MASTER_SUPER_SECRET_ADMIN_KEY" });
}
