const { test, expect } = require('@playwright/test');

test.describe('Security Vulnerability Tests - Insecure App', () => {
  const baseUrl = 'http://localhost:3000';

  test('Should detect hardcoded API keys in client-side code', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check if API keys are exposed in the page source
    const pageContent = await page.content();
    const hasExposedKeys = pageContent.includes('sk_live_') || 
                          pageContent.includes('MySecretPassword') ||
                          pageContent.includes('super_secret_jwt');
    
    expect(hasExposedKeys).toBe(true); // In insecure version, keys should be exposed
  });

  test('Should detect Reflected XSS vulnerability', async ({ page }) => {
    await page.goto(baseUrl);
    
    const xssPayload = '<img src=x onerror=alert("XSS")>';
    await page.fill('input[placeholder*="searching"]', xssPayload);
    await page.click('button:has-text("Search")');
    
    // Check if the payload is rendered without escaping
    const searchResults = await page.locator('#search-results').innerHTML();
    const isVulnerable = searchResults.includes('<img src=x');
    
    expect(isVulnerable).toBe(true); // In insecure version, should be vulnerable
  });

  test('Should detect Stored XSS vulnerability in comments', async ({ page }) => {
    await page.goto(baseUrl);
    
    const xssPayload = '<script>alert("Stored XSS")</script>';
    await page.fill('input[placeholder*="Comment"]', xssPayload);
    await page.click('button:has-text("Add Comment")');
    
    // Check if script tag is present in the DOM
    const pageContent = await page.content();
    const isVulnerable = pageContent.includes('<script>alert("Stored XSS")</script>');
    
    expect(isVulnerable).toBe(true); // In insecure version, should be vulnerable
  });

  test('Should detect dangerouslySetInnerHTML vulnerability', async ({ page }) => {
    await page.goto(baseUrl);
    
    const maliciousHtml = '<img src=x onerror=alert("Dangerous HTML")>';
    await page.fill('textarea[placeholder*="HTML"]', maliciousHtml);
    
    // Check if unsafe HTML is rendered
    const pageContent = await page.content();
    const isVulnerable = pageContent.includes('onerror=alert');
    
    expect(isVulnerable).toBe(true); // In insecure version, should be vulnerable
  });

  test('Should detect lack of authentication on admin page', async ({ page }) => {
    const response = await page.goto(`${baseUrl}/admin`);
    
    // Admin page should be accessible without authentication in insecure version
    expect(response.status()).toBe(200);
    
    // Check if sensitive data (passwords) is displayed
    const pageContent = await page.content();
    const hasPlaintextPasswords = pageContent.includes('plaintext123') || 
                                   pageContent.includes('password456');
    
    expect(hasPlaintextPasswords).toBe(true);
  });

  test('Should detect API exposing sensitive data without authentication', async ({ page }) => {
    const response = await page.goto(`${baseUrl}/api/data`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    const hasSensitiveData = JSON.stringify(data).includes('apiKey') || 
                             JSON.stringify(data).includes('password');
    
    expect(hasSensitiveData).toBe(true); // In insecure version, should expose data
  });

  test('Should detect SQL injection vulnerability in API', async ({ page }) => {
    const sqlInjection = "' OR '1'='1";
    const response = await page.goto(`${baseUrl}/api/data?query=${encodeURIComponent(sqlInjection)}`);
    
    // In insecure version, SQL injection should not be validated
    expect(response.status()).toBe(200);
  });
});

test.describe('Security Tests - Secure App', () => {
  const baseUrl = 'http://localhost:3000';

  test('Should NOT expose API keys in client-side code', async ({ page }) => {
    await page.goto(baseUrl);
    
    const pageContent = await page.content();
    const hasExposedKeys = pageContent.includes('sk_live_') || 
                          pageContent.includes('MySecretPassword') ||
                          pageContent.includes('super_secret_jwt');
    
    expect(hasExposedKeys).toBe(false); // In secure version, keys should NOT be exposed
  });

  test('Should prevent Reflected XSS attacks', async ({ page }) => {
    await page.goto(baseUrl);
    
    const xssPayload = '<img src=x onerror=alert("XSS")>';
    await page.fill('input[placeholder*="Search"]', xssPayload);
    await page.click('button:has-text("Search")');
    
    // Check if the payload is escaped
    await page.waitForTimeout(500);
    const pageContent = await page.content();
    const isEscaped = pageContent.includes('&lt;img') || !pageContent.includes('<img src=x onerror=');
    
    expect(isEscaped).toBe(true); // In secure version, should be escaped
  });

  test('Should sanitize user input in comments', async ({ page }) => {
    await page.goto(baseUrl);
    
    const xssPayload = '<script>alert("Stored XSS")</script>';
    await page.fill('input[placeholder*="comment"]', xssPayload);
    await page.click('button:has-text("Add Comment")');
    
    await page.waitForTimeout(500);
    
    // Check if script tag is sanitized
    const pageContent = await page.content();
    const isSanitized = !pageContent.includes('<script>alert("Stored XSS")</script>');
    
    expect(isSanitized).toBe(true); // In secure version, should be sanitized
  });

  test('Should require authentication for admin page', async ({ page }) => {
    const response = await page.goto(`${baseUrl}/admin`);
    
    // Should redirect to login or return 401/403
    expect([200, 307, 401, 403]).toContain(response.status());
    
    // If 200, should be on login page
    if (response.status() === 200) {
      const url = page.url();
      expect(url).toContain('login');
    }
  });

  test('Should protect API endpoints with authentication', async ({ page }) => {
    const response = await page.goto(`${baseUrl}/api/data`);
    
    // Should return 401 Unauthorized without proper auth
    expect(response.status()).toBe(401);
  });

  test('Should validate and reject SQL injection attempts', async ({ page }) => {
    const sqlInjection = "' OR '1'='1";
    const response = await page.goto(`${baseUrl}/api/data?query=${encodeURIComponent(sqlInjection)}`);
    
    // Should return 400 or 401 for invalid/malicious input
    expect([400, 401]).toContain(response.status());
  });

  test('Should use password hashes instead of plaintext', async ({ page }) => {
    // Try to access admin (will redirect but we can check the code)
    await page.goto(baseUrl);
    
    const pageContent = await page.content();
    
    // Should not contain plaintext passwords
    const hasPlaintextPasswords = pageContent.includes('plaintext123') || 
                                   pageContent.includes('password456');
    
    expect(hasPlaintextPasswords).toBe(false);
  });
});
