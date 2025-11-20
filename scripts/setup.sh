#!/usr/bin/env bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing insecure app dependencies..."
cd insecure
npm install
cd ..

echo "Installing secure app dependencies..."
cd secure
npm install
cd ..

echo "Running initial security scan..."
node scripts/scan.js

echo "Done. To run the secure app: npm run dev:secure"
