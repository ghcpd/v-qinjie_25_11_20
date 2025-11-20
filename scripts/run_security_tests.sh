#!/usr/bin/env bash
node "$(dirname "$0")/run_security_tests.js"
cat "$(dirname "$0")/../reports/security_scan_results.json"
