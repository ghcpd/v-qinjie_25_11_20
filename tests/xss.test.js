// Optional Playwright test - requires Playwright installed globally or in project
// Test will confirm XSS vulnerability in the insecure app and that the secure app is protected.
const { chromium } = require('playwright');

(async () => {
  const insecureUrl = 'http://localhost:3000';
  const secureUrl = 'http://localhost:3000';

  // To run: start insecure app (npm run dev:insecure) on port 3000, then run this script.
  // Open insecure app and execute XSS
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(insecureUrl);
  await page.fill('textarea', '<img src=x onerror=window.__XSS_EXECUTION=true>');
  await page.click('button:has-text("Render as HTML")');
  const executed = await page.evaluate(() => { return Boolean(window.__XSS_EXECUTION); });
  console.log('Insecure XSS executed:', executed);

  await browser.close();
})();
