# SECURITY TEST REPORT

**Project:** Evaluation of Claude‑Sonnet‑4.5, Codex, oswe‑codex‑s60, oswe‑prime, oswe‑mini‑m21a2s285, and oswe‑mini‑m21a3s435 in UI Security, Vulnerability Detection, and Key Disclosure Protection in Next.js Web Applications

**Date:** {{DATE}}

---

## Overview
- **Insecure baseline:** `insecure/` (intentional vulnerabilities)
- **Secure target:** `secure/` (remediated)
- **Scanner:** `tests/runSecurityScan.js`
- **Tests:** `npm test` (runs scan + Jest assertions)

---

## Detected Vulnerabilities (Baseline)
| Rule ID | Description | Severity | Location |
|---------|-------------|----------|----------|
| HARDCODED_KEY | Hardcoded API key/token in client | High | `insecure/app/page.tsx` |
| CLIENT_DEBUG_LEAK | Secrets leaked to `window`/console | High | `insecure/app/page.tsx` |
| DANGEROUS_HTML | `dangerouslySetInnerHTML` with untrusted input | High | `insecure/app/page.tsx` |
| INSECURE_FETCH | Token in query string over HTTP | Medium | `insecure/app/page.tsx` |
| UNAUTH_ADMIN | Admin access via query param | High | `insecure/app/admin/page.tsx` |
| ENV_LEAK | Server env leak to client/UI | High | `insecure/app/debug/page.tsx` |

> See `reports/security_scan_results.json` for the full machine-readable output.

---

## Reproduction Steps
1. `npm run dev:insecure`
2. Visit `http://localhost:3000/?msg=<img src=x onerror=alert('xss')>` → Reflected XSS triggers.
3. Visit `http://localhost:3000/admin?admin=true` → Admin console accessible without auth.
4. Open DevTools console on home page → `__DEBUG_CONFIG__` reveals API keys.
5. Visit `http://localhost:3000/debug` → `process.env` dumped to client.
6. Inspect network tab → Insecure fetch to `http://localhost:4000/api/data?token=...` leaks token.

---

## Fixes Applied (Secure Version)
| Vulnerability | Fix Summary | Code Reference |
|---------------|-------------|----------------|
| Hardcoded client secrets | Removed from client; use server env (`ADMIN_TOKEN`, `ANNOUNCEMENT_API_SECRET`) | `secure/app/admin/page.tsx`, `secure/app/api/secret/route.ts` |
| XSS (`dangerouslySetInnerHTML`) | Escaped user input; render as text; sanitize on server | `secure/lib/sanitize.ts`, `secure/lib/announcements.ts`, `secure/app/components/AnnouncementList.tsx` |
| Unvalidated input | Server-side validation in API; no localStorage persistence | `secure/app/api/announcements/route.ts` |
| Insecure fetch | Internal fetch with Authorization header (no query tokens, HTTPS-ready) | `secure/app/admin/page.tsx` |
| Missing access control | HttpOnly cookie + token check on server | `secure/app/api/login/route.ts`, `secure/app/admin/page.tsx` |
| Env leaks | No debug dump; server-only env access | (debug page removed) |

---

## Validation Evidence
- **Command:** `npm test`
- **Expected:** Insecure findings > 0; Secure findings = 0
- **Artifacts:** `reports/security_scan_results.json`

Attach screenshots/logs here if needed.

---

## Residual Risks
- In-memory announcement store resets on restart (for demo only).
- Admin token is static and stored in env; rotate regularly and consider OAuth/SSO.
- CSP is global; review and tighten for production environments.

---

## Recommendations
- Integrate automated scans into CI/CD.
- Add Playwright e2e tests for XSS and auth flows.
- Use a secrets manager; never commit `.env.local` with real secrets.
- Implement rate limiting and audit logging for admin actions.

---

**Prepared by:** {{AUTHOR}}
