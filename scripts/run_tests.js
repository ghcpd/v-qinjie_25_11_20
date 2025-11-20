const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

function runScan() {
  console.log('Running static scan...');
  const res = child_process.spawnSync('node', [path.join('scripts', 'scan.js')], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error('Scan script failed');
    process.exit(res.status);
  }
}

function runAll() {
  runScan();
  // Validate secure app for insecure patterns
  console.log('Validating secure app...');
  const v = child_process.spawnSync('node', [path.join('scripts','validate_secure.js')], { stdio: 'inherit' });
  if (v.status !== 0) {
    console.error('Secure validation failed');
    process.exit(v.status);
  }

  console.log('Dynamic tests (headless browser) are optional and require Playwright to be installed');
}

runAll();
