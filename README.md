# Next.js Security Evaluation

This repository contains an insecure and a secure Next.js application to demonstrate vulnerabilities and remediations for UI security, XSS, and secret handling.

Folder structure:
- `insecure/` – intentionally vulnerable app demonstrating client-side key leaks, DOM injection, unprotected admin pages, insecure API patterns.
- `secure/` – fixed version applying server-side secrets, sanitization, protected admin routes, and no secret leaks.
- `scripts/` – helper scripts that run scans and tests.
- `tests/` – (future) e2e tests and Playwright/Jest scripts.
- `reports/` – contains a JSON scan result and the security report.

Basic commands:

- Setup: `npm run setup` or run `scripts/setup.sh` / `scripts/setup.bat`.
- Start secure app: `npm run dev:secure` (runs on port 3000)
- Start insecure app: `npm run dev:insecure` (runs on port 3000 but you should run only one at a time)
- Run static scanner: `npm run scan` (writes to `reports/security_scan_results.json`)
- Run security tests: `npm run test` (calls the scan + basic tests)

Notes:
- The `secure/` app uses environment variables to store secrets. Please create a `.env.local` file in the secure app with `SECURE_API_KEY`, `ADMIN_USER`, and `ADMIN_PASS` only when testing.
- The `insecure/` app intentionally contains vulnerabilities for educational purposes—do not use it as a template.

Security-focused artifacts:
- `reports/security_scan_results.json` – machine-readable scan results.
- `reports/SECURITY_TEST_REPORT.md` – human readable report with findings and recommendations.

