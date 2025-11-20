@echo off
node "%~dp0\run_security_tests.js"
type "%~dp0..\reports\security_scan_results.json"
