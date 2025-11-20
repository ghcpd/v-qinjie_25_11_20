# Next.js Security Evaluation: Insecure vs Secure

This workspace contains two Next.js apps for a security evaluation:

- insecure/ - intentionally vulnerable app (port 3001).
- secure/ - remediated app following Next.js best practices (port 3000).

Quick start:

1. Setup (installs dependencies):
   - UNIX: ./scripts/setup.sh
   - Windows: scripts\setup.bat

2. Run secure dev server (default):
   npm run dev
   - This starts the secure app on port 3000.

3. Run security tests (one-click):
   - UNIX: ./scripts/run_security_tests.sh
   - Windows: scripts\run_security_tests.bat

Reports produced:
- reports/security_scan_results.json
- reports/security_test_outcome.json
- reports/SECURITY_TEST_REPORT.md

Design notes:
- The insecure app contains hardcoded keys, client-side leaks, XSS (dangerouslySetInnerHTML), unsanitized inputs, unprotected admin access, insecure http token in URL and secret logs.
- The secure app addresses these problems using server-side secrets, input sanitization, escaping, minimal access control (session cookie), and removal of unsafe patterns.

This repository is for evaluation and learning purposes.
