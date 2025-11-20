# Insecure Demo App

This app intentionally contains multiple vulnerabilities for evaluation and testing.

Vulnerabilities included:
- Hardcoded client-side API key (CLIENT_API_KEY) exposed in bundle and UI.
- Client-side leak via alert and console logs.
- XSS via dangerouslySetInnerHTML rendering unsanitized user input.
- Unvalidated user input saved and returned by /api/submit.
- Missing access control on /admin (shows sensitive info).
- Insecure HTTP fetch (mock) with token in query string.
- Server logs showing SERVER_SECRET value.

Run with:

npm install
npm run dev

App will run on port 3001.
