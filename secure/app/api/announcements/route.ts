import { addAnnouncement, getAnnouncements } from '../../../lib/announcements';

export async function GET() {
  const announcements = await getAnnouncements();
  return Response.json({ announcements });
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return new Response('Invalid message', { status: 400 });
    }
    const sanitized = await addAnnouncement(message);
    return Response.json({ ok: true, sanitized });
  } catch (e) {
    return new Response('Bad Request', { status: 400 });
  }
}
