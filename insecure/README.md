# Insecure App

This is the insecure demo Next.js app for the vulnerability evaluation.

Vulnerabilities intentionally present:

1. Hardcoded API key present in client code (`HARD_CODED_API_KEY`) and leaked in UI.
2. API route returns received API key back in JSON (`received_key`) and logs it to console.
3. Dangerous client-side DOM insertion using `el.innerHTML` to render user content (reflected/stored XSS vector).
4. Client sends API key in URL query string, which leaks tokens in logs and referrer.
5. Sensitive admin secret displayed in UI without access control.

Run:

```
cd insecure
npm install
npm run dev
# open http://localhost:3000
```
