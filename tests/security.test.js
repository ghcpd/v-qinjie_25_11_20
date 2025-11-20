import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), 'utf8');
}

const insecurePage = read('insecure/app/page.jsx');
const insecureFetcher = read('insecure/lib/fetcher.js');
const insecureLeak = read('insecure/components/LeakPanel.jsx');
const liveThreatPanel = read('components/LiveThreatPanel.jsx');
const secureApiRoute = read('app/api/secure-metrics/route.js');
const secureAnalystPage = read("app/(protected)/analyst/page.jsx");

const insecureFindings = [
  {
    id: 'hardcoded-key',
    pattern: /sk_live_/,
    description: 'Hardcoded production-style key exposed to the client.'
  },
  {
    id: 'dangerous-html',
    pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html:\s*payload/,
    description: 'Unsanitized payload rendered directly.'
  },
  {
    id: 'insecure-fetch',
    pattern: /http:\/\/insecure-api\.local/,
    description: 'Fetch request performed over plaintext HTTP.'
  },
  {
    id: 'client-role',
    pattern: /localStorage\.setItem\('role'/,
    description: 'Client-side role escalation stored in localStorage.'
  },
  {
    id: 'leak-panel',
    pattern: /Token sent to browser/,
    description: 'UI component intentionally leaks raw tokens.'
  }
];

insecureFindings.forEach((finding) => {
  test(`Insecure snapshot exposes ${finding.id}`, () => {
    const haystack = finding.id === 'leak-panel' ? insecureLeak : finding.id === 'insecure-fetch' ? insecureFetcher : insecurePage;
    assert.match(haystack, finding.pattern, finding.description);
  });
});

test('Secure payload sandbox sanitizes before rendering', () => {
  assert.match(liveThreatPanel, /sanitizeInput/, 'Payload form must sanitize input');
  assert.match(liveThreatPanel, /dangerouslySetInnerHTML/, 'Preview still uses innerHTML but after cleansing');
});

test('Secure metrics API enforces tenant header', () => {
  assert.match(secureApiRoute, /tenant = request\.headers\.get/);
  assert.match(secureApiRoute, /if \(!tenant\)/);
});

test('Protected analyst route verifies role server-side', () => {
  assert.match(secureAnalystPage, /isAnalyst/);
  assert.match(secureAnalystPage, /return \(/);
});
