@echo off
setlocal enabledelayedexpansion

echo ======================================
echo   Security Evaluation Project Setup  
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [32m✓[0m Node.js version: %NODE_VERSION%
echo.

REM Install root dependencies
echo [36m📦 Installing root dependencies...[0m
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [31mX Failed to install root dependencies[0m
    exit /b 1
)
echo.

REM Setup insecure application
echo [33m🔓 Setting up insecure application...[0m
cd insecure
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [31mX Failed to install insecure app dependencies[0m
    exit /b 1
)
cd ..
echo.

REM Setup secure application
echo [32m🔒 Setting up secure application...[0m
cd secure
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [31mX Failed to install secure app dependencies[0m
    exit /b 1
)
cd ..
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo [36m📝 Creating .env file...[0m
    copy .env.example .env
    echo [32m✓[0m .env file created. Please update with your actual values.
) else (
    echo [32m✓[0m .env file already exists
)
echo.

REM Create reports directory
if not exist reports (
    mkdir reports
    echo [32m✓[0m Created reports directory
)

echo.
echo ======================================
echo   Setup Complete! ✅                  
echo ======================================
echo.
echo Next steps:
echo.
echo 1. Run the insecure app:
echo    cd insecure ^&^& npm run dev
echo.
echo 2. Run the secure app:
echo    cd secure ^&^& npm run dev
echo.
echo 3. Run security tests:
echo    scripts\run_security_tests.bat
echo.
echo Both apps will run on http://localhost:3000
echo Make sure to stop one before starting the other.
echo.

pause
