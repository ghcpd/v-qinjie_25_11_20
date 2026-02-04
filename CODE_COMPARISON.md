# Side-by-Side Code Comparison

This document provides side-by-side comparisons of vulnerable code vs. secure implementations.

---

## Comparison 1: API Key Management

### ❌ Insecure (Client-Side Exposure)
```typescript
// insecure/app/page.tsx
'use client'

// VULNERABILITY: Secrets in client code
const API_KEY = 'sk_live_51HardcodedApiKey123456789';
const DATABASE_PASSWORD = 'MySecretPassword123!';
const JWT_SECRET = 'super_secret_jwt_token_12345';

export default function Home() {
  // These secrets are in the JavaScript bundle sent to browsers
  console.log('API Key:', API_KEY);
  
  return (
    <div>
      <p>API Key: {API_KEY}</p>
    </div>
  );
}
```

### ✅ Secure (Server-Side Only)
```typescript
// secure/app/page.tsx
'use client'

// FIX: No secrets in client code
export default function Home() {
  // Secrets are only in server-side environment variables
  
  return (
    <div>
      <p>✅ All API keys stored securely server-side</p>
    </div>
  );
}

// secure/app/api/some-action/route.ts (Server Component)
export async function POST() {
  // Secrets accessed only on server
  const apiKey = process.env.API_SECRET_KEY;
  // Use apiKey for server-side operations
}
```

**Key Differences:**
- Insecure: Secrets in client bundle (visible to anyone)
- Secure: Secrets in environment variables (server-only)

---

## Comparison 2: XSS Prevention

### ❌ Insecure (Reflected XSS)
```typescript
// insecure/app/page.tsx
const handleSearch = () => {
  const resultsDiv = document.getElementById('search-results');
  if (resultsDiv) {
    // VULNERABILITY: Direct innerHTML assignment
    resultsDiv.innerHTML = `<p>Search results for: ${searchTerm}</p>`;
  }
};

// Attack: searchTerm = "<img src=x onerror=alert('XSS')>"
```

### ✅ Secure (HTML Escaping)
```typescript
// secure/app/page.tsx
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

const handleSearch = () => {
  // FIX: Escape HTML before displaying
  const sanitized = escapeHtml(searchTerm);
  setSearchResult(`Search results for: ${sanitized}`);
};

// Result: "<img src=x onerror=alert('XSS')>" displays as text, not HTML
```

**Key Differences:**
- Insecure: Raw user input inserted into DOM
- Secure: HTML entities escaped before display

---

## Comparison 3: Stored XSS Prevention

### ❌ Insecure (No Sanitization)
```typescript
// insecure/app/page.tsx
const handleAddComment = () => {
  if (userInput.trim()) {
    // VULNERABILITY: Store unsanitized input
    setComments([...comments, userInput]);
    setUserInput('');
  }
};

// Render unsafely
{comments.map((comment, index) => (
  <div
    key={index}
    dangerouslySetInnerHTML={{ __html: comment }}
  />
))}

// Attack: userInput = "<script>alert('XSS')</script>"
```

### ✅ Secure (DOMPurify Sanitization)
```typescript
// secure/app/page.tsx
import DOMPurify from 'isomorphic-dompurify';

const handleAddComment = () => {
  if (userInput.trim()) {
    // FIX: Sanitize with DOMPurify
    const sanitized = DOMPurify.sanitize(userInput, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
      ALLOWED_ATTR: []
    });
    setComments([...comments, sanitized]);
    setUserInput('');
  }
};

// Render safely (already sanitized)
{comments.map((comment, index) => (
  <div
    key={index}
    dangerouslySetInnerHTML={{ __html: comment }}
  />
))}

// Result: "<script>alert('XSS')</script>" is removed
```

**Key Differences:**
- Insecure: Raw HTML stored and rendered
- Secure: HTML sanitized with whitelist approach

---

## Comparison 4: Authentication

### ❌ Insecure (No Auth Check)
```typescript
// insecure/app/admin/page.tsx
'use client'

export default function AdminPage() {
  // VULNERABILITY: No authentication
  const users = [
    { id: 1, name: 'John', password: 'plaintext123' }
  ];
  
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>⚠️ No authentication required!</p>
      {/* Display sensitive data to anyone */}
    </div>
  );
}

// Anyone can access: http://localhost:3000/admin
```

### ✅ Secure (Server Component with Auth)
```typescript
// secure/app/admin/page.tsx
import { redirect } from 'next/navigation';

// Server Component (not exported to client)
async function checkAuth() {
  // FIX: Verify authentication
  const session = await getSession();
  return session?.user?.isAuthenticated || false;
}

export default async function AdminPage() {
  const isAuthenticated = await checkAuth();
  
  if (!isAuthenticated) {
    // FIX: Redirect to login
    redirect('/login');
  }
  
  return <AdminPanel />;
}

// secure/app/admin/AdminPanel.tsx
'use client'

export default function AdminPanel() {
  const users = [
    { id: 1, name: 'John', passwordHash: '$2b$10$...' }
  ];
  
  return (
    <div>
      <h1>Admin Panel (Protected)</h1>
      <p>✅ Authentication required</p>
    </div>
  );
}
```

**Key Differences:**
- Insecure: Client component, no auth check
- Secure: Server component with authentication, redirect on failure

---

## Comparison 5: Password Storage

### ❌ Insecure (Plaintext)
```typescript
// insecure/app/admin/page.tsx
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'plaintext123'  // VULNERABILITY
  }
];

// Displayed in UI:
<td>{user.password}</td>
```

### ✅ Secure (Hashed)
```typescript
// secure/app/admin/AdminPanel.tsx
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: '$2b$10$...'  // FIX: Bcrypt hash
  }
];

// Displayed in UI:
<td>{user.passwordHash}</td>

// In actual implementation:
import bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
```

**Key Differences:**
- Insecure: Passwords stored as plaintext
- Secure: Passwords hashed with bcrypt (one-way)

---

## Comparison 6: API Security

### ❌ Insecure (No Protection)
```typescript
// insecure/app/api/data/route.ts
export async function GET(request: Request) {
  // VULNERABILITY: No authentication
  // VULNERABILITY: No rate limiting
  // VULNERABILITY: Expose everything
  
  const sensitiveData = {
    apiKey: 'sk_live_51...',
    databaseUrl: 'postgresql://admin:pass@...',
    users: [{ password: 'admin123' }]
  };
  
  // VULNERABILITY: No input validation
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  // VULNERABILITY: SQL injection
  const sqlQuery = `SELECT * FROM users WHERE name = '${query}'`;
  
  return NextResponse.json({
    data: sensitiveData,  // Expose everything
    debug: process.env    // Leak environment
  });
}
```

### ✅ Secure (Full Protection)
```typescript
// secure/app/api/data/route.ts
const rateLimitMap = new Map<string, number[]>();

function authenticateRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ') || false;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 10;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now]);
    return true;
  }
  
  const requests = rateLimitMap.get(ip)!;
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

function validateInput(input: any): boolean {
  if (typeof input === 'string') {
    const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b)/i;
    if (sqlPattern.test(input)) {
      return false;
    }
  }
  return true;
}

export async function GET(request: Request) {
  // FIX 1: Authentication
  if (!authenticateRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // FIX 2: Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // FIX 3: Input validation
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (query && !validateInput(query)) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }
  
  // FIX 4: Parameterized query (example)
  // const result = await db.query('SELECT * FROM users WHERE name = ?', [query]);
  
  // FIX 5: Return only public data
  const publicData = {
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json({ data: publicData });
}
```

**Key Differences:**
- Insecure: No protection, exposes everything
- Secure: Multi-layer protection (auth, rate limit, validation)

---

## Comparison 7: Code Injection

### ❌ Insecure (eval)
```typescript
// insecure/app/page.tsx
const handleInlineClick = (event: any) => {
  // VULNERABILITY: eval enables arbitrary code execution
  eval(event.target.getAttribute('data-action'));
};

<button
  data-action="alert('Injected Code')"
  onClick={handleInlineClick}
>
  Click Me
</button>

// Attack: data-action="fetch('/api/steal').then(r=>sendToAttacker(r))"
```

### ✅ Secure (Proper Event Handler)
```typescript
// secure/app/page.tsx
const handleSafeClick = () => {
  // FIX: Use proper React event handling
  alert('This is a safe click handler!');
};

<button onClick={handleSafeClick}>
  Click Me (Safe)
</button>

// No eval, no string-to-code conversion
```

**Key Differences:**
- Insecure: eval() converts strings to executable code
- Secure: Direct function reference, type-safe

---

## Summary Table

| Vulnerability | Insecure Pattern | Secure Pattern |
|---------------|------------------|----------------|
| Hardcoded Secrets | `const KEY = 'secret'` | `process.env.KEY` (server) |
| Reflected XSS | `innerHTML = userInput` | `escapeHtml(userInput)` |
| Stored XSS | `dangerouslySetInnerHTML={{ __html: raw }}` | `DOMPurify.sanitize(input)` |
| Missing Auth | No check | `if (!auth) redirect('/login')` |
| Plaintext Passwords | `password: 'text'` | `passwordHash: bcrypt.hash()` |
| Unprotected API | Direct data return | Auth + rate limit + validation |
| Code Injection | `eval(string)` | Direct function calls |
| SQL Injection | String concatenation | Parameterized queries |
| No Validation | Direct use | `validateInput()` first |
| CORS | `*` or none | Specific origins |

---

## Testing Comparison

### Insecure App Tests
```javascript
test('Should detect XSS vulnerability', async ({ page }) => {
  await page.fill('input', '<img src=x onerror=alert("XSS")>');
  const content = await page.content();
  expect(content).toContain('<img src=x'); // Vulnerable!
});
```

### Secure App Tests
```javascript
test('Should prevent XSS attacks', async ({ page }) => {
  await page.fill('input', '<img src=x onerror=alert("XSS")>');
  const content = await page.content();
  expect(content).toContain('&lt;img'); // Escaped!
});
```

---

## Configuration Comparison

### Insecure next.config.js
```javascript
module.exports = {
  reactStrictMode: true,
  // No security headers
};
```

### Secure next.config.js
```javascript
module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'" }
        ]
      }
    ];
  }
};
```

---

**Last Updated:** November 20, 2025
