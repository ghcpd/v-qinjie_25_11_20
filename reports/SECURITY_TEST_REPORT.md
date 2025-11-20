# Security Test Report

This report summarizes the security evaluation of the insecure and secure applications.

## Summary

- Insecure app: 5 high/medium findings (hardcoded API keys, DOM injection (innerHTML), console secrets, API key in URL, admin secret visible).
- Secure app: Input sanitization, server-side secrets, cookie-based admin auth; reduced exposure.

## Findings & Reproduction Steps

1) Hardcoded API key in client
- Location: `insecure/app/page.js` (HARD_CODED_API_KEY)
- Reproduction: Load the page and inspect the UI; the key is shown in the UI and in client JS.
- Impact: Client-stored secrets can be stolen.
- Fix: Move secret to server-only environment variables and do not expose to browser. See `secure/app/api/echo/route.js`.

2) DOM Injection / XSS
- Location: `insecure/app/page.js` (innerHTML assignment in `selfXSS`)
- Reproduction: Enter `<img src=x onerror=alert(1)>` in the message field and click "Render as HTML". The script executes or browser attempts it.
- Impact: XSS can lead to account hijacking and data exfiltration.
- Fix: Sanitize input server-side (using `sanitize-html`) and avoid `innerHTML`. See `secure/app/api/echo/route.js` and secure UI.

3) Console secret leak & API echo
- Location: `insecure/app/api/echo/route.js` (console.log prints sensitive key) and response returns key.
- Reproduction: Send a message with apikey query and see server logs and response JSON including received_key.
- Impact: Leaks secret to logs and client.
- Fix: Do not log secrets and avoid returning secrets to the client. See `secure/app/api/echo/route.js`.

4) Token in URL
- Location: `insecure/app/page.js` (fetch with `?apikey=` in query)
- Reproduction: Inspect network requests; the token appears in URL and can be recorded in referer headers.
- Impact: Tokens in URLs are often logged by third-party services and referrer headers.
- Fix: Send secrets server-side or as Authorization header over HTTPS.

5) Admin secret visible without auth
- Location: `insecure/app/page.js` (admin secret shown openly)
- Reproduction: Open page; the admin secret appears.
- Impact: Sensitive data exposure.
- Fix: Protect admin route with auth, set HttpOnly cookies, and do not reveal server secrets.

## Fixes Applied

- Replaced client-side hardcoded keys with server-side env variable (`SECURE_API_KEY`) in `secure/app`.
- Sanitized user input using `sanitize-html` on the server.
- Removed `innerHTML` usage; UI renders plain text only.
- Changed API to accept POST with body and removed key from URL.
- Admin area now requires HttpOnly cookie and hides secrets.

## Validation Evidence

- Security scan JSON output available at `reports/security_scan_results.json`.
- Tests: The `scripts/scan.js` detects insecure patterns in the insecure app and reports reduced issues in the secure app.

## Residual Risks

- Authentication implemented for demo only; production should use robust auth (JWT/OAuth, sessions with proper rotation and revocation, CSRF protection).
- No HTTPS enforcement in local dev but production must enforce TLS.
- More thorough static analysis (SAST) or dynamic scanning is recommended.

## Recommendations

- Store secrets in environment variables and never expose them to the browser.
- Use proper server-side storage for secrets and remove them from logs.
- Use robust input validation & output encoding; consider templating frameworks that prevent XSS by default.
- Adopt automated security scanning as part of CI/CD.

