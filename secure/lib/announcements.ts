import { sanitizeInput } from './sanitize';

let announcements: string[] = [
  'Welcome to the secure dashboard!',
  'Security tip: Never trust user input. Always sanitize.',
];

export async function getAnnouncements(): Promise<string[]> {
  return announcements;
}

export async function addAnnouncement(raw: string) {
  const sanitized = sanitizeInput(raw);
  announcements.push(sanitized);
  return sanitized;
}
