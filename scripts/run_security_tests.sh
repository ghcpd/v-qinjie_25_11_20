#!/bin/bash

echo "======================================"
echo "  Running Security Tests             "
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "🔍 Running static security analysis..."
echo ""

# Run the security scanner
node scripts/run_security_tests.js

echo ""
echo "======================================"
echo "  Security Scan Complete! ✅         "
echo "======================================"
echo ""
echo "Reports generated:"
echo "  - reports/security_scan_results.json"
echo "  - reports/SECURITY_TEST_REPORT.md"
echo ""
echo "To run end-to-end tests with Playwright:"
echo "  npm run test:e2e"
echo ""
