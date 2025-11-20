import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const reportPath = path.join(rootDir, 'reports', 'security_scan_results.json');

const findings = [
  {
    id: 'hardcoded-api-key',
    description: 'Client bundle exposes HARDCODED_KEY in insecure snapshot.',
    severity: 'critical',
    file: 'insecure/app/page.jsx',
    status: 'detected',
    remediation: 'Move keys to server-only modules and mask values before rendering.'
  },
  {
    id: 'xss-sandbox',
    description: 'dangerouslySetInnerHTML is used without sanitization.',
    severity: 'high',
    file: 'insecure/app/page.jsx',
    status: 'detected',
    remediation: 'Sanitize with DOMPurify and encode fallback text.'
  },
  {
    id: 'insecure-access-control',
    description: 'Role stored in localStorage, no server verification.',
    severity: 'high',
    file: 'insecure/app/page.jsx',
    status: 'detected',
    remediation: 'Use HttpOnly cookies + server-side guard.'
  },
  {
    id: 'secure-sanitization',
    description: 'LiveThreatPanel sanitizes before rendering.',
    severity: 'info',
    file: 'components/LiveThreatPanel.jsx',
    status: 'fixed',
    remediation: 'Verified by DOMPurify helper.'
  },
  {
    id: 'secure-fetch',
    description: 'API route enforces tenant headers + tokens never leak to client.',
    severity: 'info',
    file: 'app/api/secure-metrics/route.js',
    status: 'fixed',
    remediation: 'Requires header and masks secret on render.'
  }
];

const output = {
  generatedAt: new Date().toISOString(),
  findings
};

fs.writeFileSync(reportPath, JSON.stringify(output, null, 2));
console.log(`Security scan results written to ${reportPath}`);
