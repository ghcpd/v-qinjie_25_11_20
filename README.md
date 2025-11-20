# Next.js Security Evaluation Project

## Title
**Evaluation of Claude‑Sonnet‑4.5, Codex, and other models in UI Security, Vulnerability Detection, and Key Disclosure Protection in Next.js Web Applications**

## Overview

This project is designed to evaluate AI models' ability to identify, fix, and interpret security vulnerabilities in Next.js applications. It contains two versions of the same application:

- **Insecure Version** (`insecure/`) - Contains 17+ intentional security vulnerabilities
- **Secure Version** (`secure/`) - Implements all security fixes and best practices

## Project Structure

```
.
├── insecure/              # Vulnerable application
│   ├── app/
│   │   ├── page.tsx       # Main page with multiple XSS vulnerabilities
│   │   ├── admin/         # Unprotected admin panel
│   │   └── api/           # Insecure API endpoints
│   ├── package.json
│   └── next.config.js
│
├── secure/                # Secure application
│   ├── app/
│   │   ├── page.tsx       # Sanitized inputs, proper validation
│   │   ├── admin/         # Protected with authentication
│   │   ├── login/         # Login page for authentication
│   │   └── api/           # Secured API endpoints
│   ├── package.json
│   └── next.config.js
│
├── tests/                 # Automated security tests
│   └── security.spec.js   # Playwright tests
│
├── scripts/               # Setup and testing scripts
│   ├── setup.sh
│   ├── setup.bat
│   ├── run_security_tests.sh
│   ├── run_security_tests.bat
│   └── run_security_tests.js
│
├── reports/               # Generated security reports
│   ├── security_scan_results.json
│   └── SECURITY_TEST_REPORT.md
│
├── package.json           # Root package configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── playwright.config.ts   # Playwright test configuration
└── README.md              # This file
```

## Embedded Vulnerabilities (Insecure Version)

The insecure application contains the following vulnerabilities:

### 1. **Hardcoded API Keys (CRITICAL)**
- **Location:** `insecure/app/page.tsx` lines 6-8
- **Issue:** API keys, database passwords, and JWT secrets exposed in client-side code
- **Evidence:** `const API_KEY = 'sk_live_51HardcodedApiKey123456789'`

### 2. **Reflected XSS (HIGH)**
- **Location:** `insecure/app/page.tsx` lines 19-24
- **Issue:** User input directly inserted into innerHTML without sanitization
- **Evidence:** `resultsDiv.innerHTML = \`<p>Search results for: ${searchTerm}</p>\``

### 3. **Stored XSS (HIGH)**
- **Location:** `insecure/app/page.tsx` lines 27-32, 86-92
- **Issue:** User comments rendered with dangerouslySetInnerHTML without sanitization
- **Evidence:** `<div dangerouslySetInnerHTML={{ __html: comment }} />`

### 4. **Unsafe dangerouslySetInnerHTML (HIGH)**
- **Location:** `insecure/app/page.tsx` lines 35-39
- **Issue:** HTML content rendered without DOMPurify sanitization
- **Evidence:** Raw HTML inserted without validation

### 5. **Sensitive Data in Console Logs (HIGH)**
- **Location:** `insecure/app/page.tsx` lines 42-44
- **Issue:** API keys and secrets logged to browser console
- **Evidence:** `console.log('API Key:', API_KEY)`

### 6. **Code Injection via eval() (CRITICAL)**
- **Location:** `insecure/app/page.tsx` line 48
- **Issue:** eval() enables arbitrary code execution
- **Evidence:** `eval(event.target.getAttribute('data-action'))`

### 7. **Sensitive Keys Displayed in UI (CRITICAL)**
- **Location:** `insecure/app/page.tsx` lines 61-68
- **Issue:** API keys and passwords visible to all users
- **Evidence:** Keys displayed in red alert box

### 8. **Missing Authentication (CRITICAL)**
- **Location:** `insecure/app/admin/page.tsx`
- **Issue:** Admin panel accessible without any authentication
- **Evidence:** No auth check before rendering admin content

### 9. **Plaintext Passwords (HIGH)**
- **Location:** `insecure/app/admin/page.tsx` lines 5-8
- **Issue:** Passwords stored and displayed in plaintext
- **Evidence:** `password: 'plaintext123'`

### 10-17. **API Security Issues (CRITICAL)**
- **Location:** `insecure/app/api/data/route.ts`
- **Issues:**
  - No authentication required (line 14)
  - Missing rate limiting
  - Improperly configured CORS
  - Sensitive data exposed (lines 4-17)
  - Logging sensitive information (line 23)
  - No input validation (lines 26-32)
  - SQL injection vulnerability (line 30)
  - No CSRF protection (lines 36-48)

## Security Fixes (Secure Version)

### Client-Side Fixes

1. **Removed Hardcoded Secrets**
   - All API keys moved to server-side environment variables
   - No secrets in client-side code

2. **XSS Prevention**
   - Implemented DOMPurify for HTML sanitization
   - HTML escaping for all user input
   - Safe React event handlers (no eval)

3. **Input Validation**
   - All user input validated before processing
   - Whitelist approach for allowed HTML tags

4. **Removed Sensitive Logging**
   - No API keys or secrets in console
   - Sanitized debug information

### Server-Side Fixes

5. **Authentication & Authorization**
   - Protected admin routes with authentication checks
   - Redirect to login for unauthenticated access
   - Server components for sensitive operations

6. **Password Security**
   - Passwords stored as bcrypt hashes
   - No plaintext passwords in database or UI

7. **API Security**
   - Authentication required for all endpoints
   - Rate limiting implemented
   - Proper CORS configuration
   - Input validation and sanitization
   - Parameterized queries (no SQL injection)
   - CSRF protection
   - No sensitive data exposure

8. **Security Headers**
   - HSTS, X-Frame-Options, CSP configured
   - X-Content-Type-Options, XSS Protection enabled

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)

### Installation

#### Windows

```powershell
# Run the setup script
.\scripts\setup.bat

# Or manually:
npm install
cd insecure && npm install && cd ..
cd secure && npm install && cd ..
```

#### macOS/Linux

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run the setup script
./scripts/setup.sh

# Or manually:
npm install
cd insecure && npm install && cd ..
cd secure && npm install && cd ..
```

### Environment Variables

1. Copy `.env.example` to `.env`
2. Update with your values (for production use)

```bash
cp .env.example .env
```

## Running the Applications

### Insecure Application

```bash
cd insecure
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### Secure Application

```bash
cd secure
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

**Note:** Stop one application before starting the other, as both run on port 3000.

## Testing

### Automated Security Scan

This runs static analysis to detect vulnerabilities:

#### Windows
```powershell
.\scripts\run_security_tests.bat
```

#### macOS/Linux
```bash
./scripts/run_security_tests.sh
```

### End-to-End Tests

Run Playwright tests to verify security fixes:

```bash
npm run test:e2e
```

### Manual Testing

#### Test XSS Vulnerabilities (Insecure App)

1. **Reflected XSS:**
   ```
   Search: <img src=x onerror=alert('XSS')>
   ```

2. **Stored XSS:**
   ```
   Comment: <script>alert('Stored XSS')</script>
   ```

3. **dangerouslySetInnerHTML:**
   ```
   HTML: <img src=x onerror=alert('HTML Injection')>
   ```

#### Test Authentication (Secure App)

1. Navigate to `/admin` - should redirect to `/login`
2. Try accessing `/api/data` - should return 401

## Reports

After running security tests, view the reports:

### JSON Report
```bash
cat reports/security_scan_results.json
```

Contains structured vulnerability data:
- Finding type and severity
- File location and line number
- Code evidence
- Comparison between insecure and secure versions

### Markdown Report
```bash
cat reports/SECURITY_TEST_REPORT.md
```

Human-readable report with:
- Executive summary
- Detailed findings by category
- Remediation steps
- Recommendations

## Key Security Patterns Demonstrated

### 1. Input Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
  ALLOWED_ATTR: []
});
```

### 2. HTML Escaping
```typescript
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};
```

### 3. Server-Side Authentication
```typescript
async function checkAuth() {
  // Validate session/JWT token
  const isAuthenticated = await validateSession();
  return isAuthenticated;
}

export default async function AdminPage() {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    redirect('/login');
  }
  return <AdminPanel />;
}
```

### 4. Secure API Endpoints
```typescript
export async function GET(request: Request) {
  // Authentication
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  
  // Input validation
  if (!validateInput(query)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  
  // Return sanitized data only
  return NextResponse.json({ data: sanitizeOutput(data) });
}
```

## UI/UX Features

- **Modern Design:** Gradient backgrounds, rounded corners, shadows
- **Tailwind CSS:** Utility-first styling
- **Animations:** Fade-in, slide-up effects
- **Responsive Layout:** Works on all screen sizes
- **Accessibility:** Proper focus states, semantic HTML

## Success Criteria

✅ **Insecure app contains 17+ vulnerabilities**
- Hardcoded API keys
- XSS (reflected, stored)
- Code injection (eval)
- Missing authentication
- SQL injection patterns
- Sensitive data exposure

✅ **Secure app remediates all vulnerabilities**
- Server-side secret management
- Input sanitization (DOMPurify)
- Authentication and authorization
- Input validation
- Security headers
- Password hashing

✅ **Automated tests detect vulnerabilities**
- Static analysis scanner
- Playwright E2E tests
- JSON and Markdown reports

✅ **Runs on port 3000 with modern UI**
- Tailwind CSS styling
- Gradient animations
- Professional design

## Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Sanitization:** DOMPurify
- **Testing:** Playwright
- **Security Analysis:** Custom Node.js scanner

## Learning Outcomes

This project demonstrates:

1. Common web security vulnerabilities
2. Secure coding practices in Next.js
3. Client-side vs server-side security concerns
4. Input validation and sanitization techniques
5. Authentication and authorization patterns
6. API security best practices
7. Automated security testing

## Contributing

This is an educational project. To add more vulnerabilities or fixes:

1. Add vulnerability to `insecure/` app
2. Add corresponding fix to `secure/` app
3. Update test cases in `tests/security.spec.js`
4. Update documentation

## License

MIT License - Educational purposes

## Disclaimer

⚠️ **WARNING:** The insecure application contains intentional vulnerabilities for educational purposes. **NEVER** deploy the insecure version to production or expose it to the internet.

## Support

For issues or questions:
1. Check the reports in `reports/`
2. Review test output
3. Examine the code comments for explanations

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Generated:** November 20, 2025  
**Version:** 1.0.0
