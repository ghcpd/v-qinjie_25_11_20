@echo off
echo Installing npm dependencies (with legacy-peer-deps fallback)...
npm install || (
	echo 'npm install failed; retrying with --legacy-peer-deps'
	npm install --legacy-peer-deps
)
echo Done.
