// Vulnerable API: stores and returns untrusted HTML without sanitization
let announcements: string[] = [
  "<strong>Welcome!</strong>",
  "<img src=x onerror=alert('xss-from-api') />"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Reflect input without validation
  const spoof = searchParams.get("spoof");
  if (spoof) {
    announcements.push(spoof);
  }
  return Response.json({ announcements });
}

export async function POST(request: Request) {
  const body = await request.json();
  announcements.push(body.message); // No validation
  return Response.json({ ok: true });
}
