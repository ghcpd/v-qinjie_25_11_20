import createDOMPurify from 'isomorphic-dompurify';

const DOMPurify = createDOMPurify((typeof window === 'undefined' ? undefined : window));

const INPUT_ALLOWED_TAGS = ['strong', 'em', 'code', 'span'];

export function sanitizeInput(value) {
  return DOMPurify.sanitize(value ?? '', {
    ALLOWED_TAGS: INPUT_ALLOWED_TAGS,
    FORBID_ATTR: ['style', 'onerror', 'onclick']
  });
}

export function maskKey(key) {
  if (!key) return 'not-configured';
  const visible = key.slice(-4);
  return `${'*'.repeat(Math.max(0, key.length - 4))}${visible}`;
}
