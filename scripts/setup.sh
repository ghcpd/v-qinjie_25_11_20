#!/bin/bash

echo "======================================"
echo "  Security Evaluation Project Setup  "
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi
echo ""

# Setup insecure application
echo "🔓 Setting up insecure application..."
cd insecure
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install insecure app dependencies"
    exit 1
fi
cd ..
echo ""

# Setup secure application
echo "🔒 Setting up secure application..."
cd secure
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install secure app dependencies"
    exit 1
fi
cd ..
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created. Please update with your actual values."
else
    echo "✓ .env file already exists"
fi
echo ""

# Create reports directory
if [ ! -d "reports" ]; then
    mkdir reports
    echo "✓ Created reports directory"
fi

echo ""
echo "======================================"
echo "  Setup Complete! ✅                  "
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Run the insecure app:"
echo "   cd insecure && npm run dev"
echo ""
echo "2. Run the secure app:"
echo "   cd secure && npm run dev"
echo ""
echo "3. Run security tests:"
echo "   ./scripts/run_security_tests.sh"
echo ""
echo "Both apps will run on http://localhost:3000"
echo "Make sure to stop one before starting the other."
echo ""
