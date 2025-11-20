#!/usr/bin/env bash
set -e
echo "Installing dependencies for insecure and secure apps..."
cd insecure; npm install; cd ..
cd secure; npm install; cd ..
npm install

echo "Setup complete. To run the secure app: npm run dev (runs secure on port 3000)"
