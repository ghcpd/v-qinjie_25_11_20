# SECURITY_TEST_REPORT

This document summarizes the security scan & test results for the insecure and secure apps.

Summary:
- Insecure app: multiple high/medium severity issues discovered.
- Secure app: vulnerabilities mitigated, no matching findings in automated scan.

Reproduction steps (insecure):
1. Run the insecure app (cd insecure; npm run dev) on port 3001.
2. Visit http://localhost:3001 and interact with the comment box and admin panel.
3. You can see hardcoded API keys, console leaks, and XSS via input with HTML tags.

Fixes applied (secure):
- Removed client-side hardcoded keys.
- Removed dangerouslySetInnerHTML and implemented escaping
- Sanitized user input server-side before storing
- Added basic access control for /admin via session cookie set by /api/login
- Replaced insecure http calls and removed token-in-URL patterns

Validation evidence:
- The test runner writes JSON at reports/security_scan_results.json and reports/security_test_outcome.json.

Residual risks and recommendations:
- In-memory stores are ephemeral and not durable; production apps should use a secure DB.
- Use proven sanitization libraries like DOMPurify for robust XSS protection.
- Consider stronger auth (JWT/session store), HTTPS-only cookies, and CSRF protections.
- Implement CSP headers and deploy secrets using a secrets manager.

Files:
- reports/security_scan_results.json - automated scan findings
- reports/security_test_outcome.json - pass/fail summary


