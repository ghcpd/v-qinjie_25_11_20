@echo off
setlocal

echo ======================================
echo   Running Security Tests             
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [31mX[0m Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [36m🔍 Running static security analysis...[0m
echo.

REM Run the security scanner
node scripts\run_security_tests.js

echo.
echo ======================================
echo   Security Scan Complete! ✅         
echo ======================================
echo.
echo Reports generated:
echo   - reports\security_scan_results.json
echo   - reports\SECURITY_TEST_REPORT.md
echo.
echo To run end-to-end tests with Playwright:
echo   npm run test:e2e
echo.

pause
