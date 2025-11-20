export const metricLibrary = [
  {
    name: 'Credential Stuffing',
    change: '-37%',
    detail: 'Blocked by adaptive MFA policies'
  },
  {
    name: 'XSS Payloads',
    change: '-64%',
    detail: 'Neutralized via DOMPurify sanitization'
  },
  {
    name: 'Leaked Secrets',
    change: '-91%',
    detail: 'Secrets moved to server-only modules'
  }
];

export const secureLogs = [
  {
    message: 'Server action denied role escalation from guest to root.',
    time: '18s ago'
  },
  {
    message: 'Input sandbox stripped disallowed script tags.',
    time: '3m ago'
  },
  {
    message: 'Analyst dashboard accessed with valid session-bound cookie.',
    time: '18m ago'
  }
];

export const insightTimeline = [
  {
    title: 'Policies Refreshed',
    description: 'Refined content security policy for UI bundle.',
    date: 'Today, 09:12'
  },
  {
    title: 'Threat Model',
    description: 'Codified stored XSS remediation playbook.',
    date: 'Yesterday, 17:04'
  },
  {
    title: 'Key Vault Integration',
    description: 'Hardcoded credentials replaced with runtime secrets.',
    date: 'Mon, 11:22'
  }
];
