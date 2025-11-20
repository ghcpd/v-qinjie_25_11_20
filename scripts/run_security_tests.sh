#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[security-tests] Running scan and tests..."
npm test
