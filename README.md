# UI Security Evaluation Lab

This lab demonstrates the lifecycle of finding and fixing insecure UI patterns in a Next.js application. The repository includes both the intentionally vulnerable source snapshot (`insecure/`) and the hardened version that powers the runnable app (`app/`, also mirrored in `secure/`). Automated scripts document the remediation process and capture test results.

## Project Layout
- `insecure/`: Original flawed components highlighting hardcoded secrets, XSS, insecure fetches, and missing access control.
- `secure/`: Reference copy of the remediated components that match the runnable app.
- `app/`, `components/`, `lib/`: Source for the secure Next.js application.
- `scripts/`: Helper scripts for setup and automated tests.
- `tests/`: Node-based security assertions + scan generator.
- `reports/`: JSON scan output and markdown report template.

## Prerequisites
- Node.js 18+
- npm 9+

## Setup
```bash
./scripts/setup.sh
# or on Windows
scripts\\setup.bat
```

## Run the Secure UI
```bash
npm run dev
# visit http://localhost:3000
```

## Security Tests & Scan
```bash
./scripts/run_security_tests.sh
# or on Windows
scripts\\run_security_tests.bat
```
Outputs:
- `npm run test` ensures insecure fingerprints remain detectable and secure fixes stay enforced.
- `npm run scan` regenerates `reports/security_scan_results.json` summarizing vulnerability status.

## Reports
- `reports/security_scan_results.json`: Machine-readable findings, severity, and remediation guidance.
- `reports/SECURITY_TEST_REPORT.md`: Template to capture reproduction steps, fixes, and residual risks.

## Next.js Features
- Tailwind CSS gradients, glassmorphism, animations.
- Secure fetch demo hitting `/api/secure-metrics` with tenant headers and masked secrets.
- Client/server separation with server actions (`app/actions.js`) and protected route (`/analyst`).
- DOMPurify-powered preview preventing the `dangerouslySetInnerHTML` issue found in `insecure/`.

## Notes
- Set `SECURE_METRIC_KEY` before deploying to override the placeholder token mask.
- Compare `insecure/` vs `secure/` to study each fix and map tests to vulnerabilities.
