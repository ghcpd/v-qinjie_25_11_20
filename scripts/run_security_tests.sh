#!/usr/bin/env bash
set -e
node tests/security_scan.js
node tests/assess_results.js
