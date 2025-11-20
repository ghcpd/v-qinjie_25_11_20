@echo off
echo Installing dependencies for insecure and secure apps...
pushd insecure
npm install
popd
pushd secure
npm install
popd
npm install

echo Setup complete. To run secure app: npm run dev (runs secure on port 3000)
