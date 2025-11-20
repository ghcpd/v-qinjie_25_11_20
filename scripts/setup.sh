#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[setup] Installing dependencies..."
npm install

echo "[setup] Creating secure/.env.local if missing..."
if [ -f secure/.env.example ] && [ ! -f secure/.env.local ]; then
  cp secure/.env.example secure/.env.local
  echo "[setup] secure/.env.local created from example. Please update secrets appropriately."
fi

echo "[setup] Done."
