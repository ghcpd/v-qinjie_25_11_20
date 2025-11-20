@echo off
call npm run test || exit /b 1
call npm run scan
