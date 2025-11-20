@echo off
node scripts/scan.js
node scripts/run_tests.js
echo Security tests complete. Results available in reports/security_scan_results.json
