#!/usr/bin/env bash
set -euo pipefail

if [ ! -f package.json ]; then
  echo "package.json missing. Run from project root." >&2
  exit 1
fi

npm install
