# Quick Start Guide

## Setup (One-Time)

### Windows
```powershell
.\scripts\setup.bat
```

### macOS/Linux
```bash
chmod +x scripts/*.sh
./scripts/setup.sh
```

## Running Applications

### Option 1: Insecure Application (with vulnerabilities)
```bash
cd insecure
npm run dev
```
Open: http://localhost:3000

### Option 2: Secure Application (fixed)
```bash
cd secure
npm run dev
```
Open: http://localhost:3000

**Note:** Stop one app before starting the other (both use port 3000)

## Testing Vulnerabilities

### Run Security Scan
```bash
# Windows
.\scripts\run_security_tests.bat

# macOS/Linux
./scripts/run_security_tests.sh
```

### Manual Testing (Insecure App)

1. **Test XSS:**
   - Search: `<img src=x onerror=alert('XSS')>`
   - Comment: `<script>alert('XSS')</script>`

2. **View Exposed Keys:**
   - Check red alert box on homepage
   - Open DevTools Console (F12)

3. **Test Missing Auth:**
   - Visit: http://localhost:3000/admin
   - Should load without login!

4. **Test Insecure API:**
   - Visit: http://localhost:3000/api/data
   - See all sensitive data exposed

### Expected Results (Secure App)

1. **XSS Blocked:**
   - HTML tags escaped or sanitized
   - No scripts execute

2. **No Exposed Keys:**
   - Green success message instead
   - No secrets in console

3. **Auth Required:**
   - `/admin` redirects to `/login`
   - API returns 401 Unauthorized

## View Reports

```bash
# JSON report
cat reports/security_scan_results.json

# Markdown report
cat reports/SECURITY_TEST_REPORT.md
```

## Common Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run security tests
npm run test:security

# Run Playwright tests
npm run test:e2e

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Port 3000 in use
```bash
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

### Dependencies issue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# These are expected in insecure app (demonstration purposes)
# They show unsafe patterns
```

## Project Structure

```
├── insecure/          # Vulnerable app (17+ issues)
├── secure/            # Fixed app (0 issues)
├── tests/             # Automated tests
├── scripts/           # Setup & test scripts
└── reports/           # Security reports
```

## Key Files

- `README.md` - Full documentation
- `reports/SECURITY_TEST_REPORT.md` - Detailed vulnerability analysis
- `reports/security_scan_results.json` - Structured scan data
- `.env.example` - Environment variables template

## Learning Path

1. Run insecure app → See vulnerabilities in action
2. Check DevTools console → See exposed secrets
3. Try XSS payloads → See scripts execute
4. Run security scan → See automated detection
5. Run secure app → See fixes in action
6. Compare code → Learn secure patterns
7. Read reports → Understand remediation

## Next Steps

- Study the vulnerability list in README.md
- Compare insecure vs secure code
- Read SECURITY_TEST_REPORT.md
- Implement similar fixes in your projects
