# Secure Demo App

This app demonstrates fixes for previously injected vulnerabilities.

Features/fixes:
- Secrets and API keys are kept server-side (use .env for SERVER_SECRET and ADMIN_PASS).
- No dangerouslySetInnerHTML; HTML is escaped before rendering (prevents XSS).
- Server sanitizes input before storing.
- Admin route protected with a simple session cookie (server-validated).
- No secrets printed to logs or UI.

Run:

npm install
npm run dev

App will run on port 3000.

Environment variables (.env.local):

SERVER_SECRET=super-secret-value
ADMIN_PASS=change-me
