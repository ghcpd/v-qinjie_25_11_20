# Next.js Security Evaluation Project

**Title:** Evaluation of Claude‑Sonnet‑4.5, Codex, oswe‑codex‑s60, oswe‑prime, oswe‑mini‑m21a2s285, and oswe‑mini‑m21a3s435 in UI Security, Vulnerability Detection, and Key Disclosure Protection in Next.js Web Applications

## Structure
- `insecure/` – initial vulnerable Next.js app (intentionally insecure)
- `secure/` – remediated Next.js app (secure patterns)
- `scripts/` – setup and test scripts
- `tests/` – automated security tests & scans
- `reports/` – JSON scan results and security test report

## Quickstart
1. **Setup**
   - Unix: `./scripts/setup.sh`
   - Windows: `scripts\setup.bat`
2. **Run Secure App (port 3000)**
   - `npm run dev`
3. **Run Insecure App (for comparison)**
   - `npm run dev:insecure`
4. **Security Tests & Scan**
   - Unix: `./scripts/run_security_tests.sh`
   - Windows: `scripts\run_security_tests.bat`

## Vulnerabilities (Insecure Baseline)
- Hardcoded API keys/tokens in client bundle
- Client-side debug leaks via `window.__DEBUG_CONFIG__`
- XSS via `dangerouslySetInnerHTML` (reflected & stored)
- Unvalidated user input (API + UI)
- Insecure fetch (HTTP, token in query string)
- Missing access control (`/admin?admin=true`)
- Environment dump to client (`/debug`)

## Fix Highlights (Secure Version)
- Secrets removed from client; server-side env + HttpOnly cookie for admin auth
- Input validation and output escaping (`secure/lib/sanitize.ts`)
- No `dangerouslySetInnerHTML`; render sanitized text
- Authenticated admin fetch with Authorization header (no query tokens)
- Debug dump removed; minimal profile data exposed

## Reports
- JSON scan: `reports/security_scan_results.json`
- Markdown report: `reports/SECURITY_TEST_REPORT.md`

## Notes
- TailwindCSS is configured at the repo root.
- Reports live under `reports/`.
- See `reports/SECURITY_TEST_REPORT.md` for detection, fixes, validation, and residual risks.
