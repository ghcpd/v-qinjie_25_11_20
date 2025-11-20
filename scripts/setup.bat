@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0.."

echo [setup] Installing dependencies...
npm install

echo [setup] Creating secure/.env.local if missing...
if exist secure\.env.example if not exist secure\.env.local (
  copy secure\.env.example secure\.env.local >nul
  echo [setup] secure/.env.local created from example. Please update secrets appropriately.
)

echo [setup] Done.
