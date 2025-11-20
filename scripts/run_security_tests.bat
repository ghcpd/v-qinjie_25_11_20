@echo off
cd /d "%~dp0.."

echo [security-tests] Running scan and tests...
npm test
