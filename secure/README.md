# Secure App

This is the secure demo Next.js app. It fixes the vulnerabilities from the insecure app.

Security features:

- No API keys or secrets hard-coded in client-side code.
- Server-side API endpoints access secrets using environment variables (see .env.example).
- Input is sanitized server-side using `sanitize-html` to prevent XSS.
- Admin area requires a server-set HttpOnly cookie for access; secrets are never exposed to the client.
- Debug logs do not include secrets.

Run:

```
cd secure
npm install
npm run dev
# open http://localhost:3000
```

ENV:
- Set environment variables in a `.env.local` file that is not committed: `SECURE_API_KEY`, `ADMIN_USER`, `ADMIN_PASS`.
