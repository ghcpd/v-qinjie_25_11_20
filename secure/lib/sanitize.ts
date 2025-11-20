const map: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

export function sanitizeInput(input: string): string {
  return input.replace(/[&<>"'/]/g, (c) => map[c]);
}
