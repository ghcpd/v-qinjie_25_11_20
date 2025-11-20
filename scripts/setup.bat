@echo off
REM Setup Windows script
npm install
cd insecure
npm install
cd ..
cd secure
npm install
cd ..
node scripts/scan.js
echo "Done. To run the secure app: npm run dev:secure"
