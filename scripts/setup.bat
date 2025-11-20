@echo off
if not exist package.json (
  echo package.json missing. Run from project root.
  exit /b 1
)
call npm install
