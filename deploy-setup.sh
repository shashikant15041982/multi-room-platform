#!/bin/bash

# Multi-Room Platform — Automated Deployment Setup
# Run this on Replit to auto-configure the backend

echo "🚀 Multi-Room AI Chat Platform — Deployment Setup"
echo "=================================================="
echo ""

# Check if running on Replit
if [ ! -d "$HOME/.replit" ]; then
  echo "⚠️  This script is designed for Replit."
  echo "To run locally: npm install && node server.js"
  exit 1
fi

echo "✓ Running on Replit detected"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✓ Dependencies installed"
else
  echo "✗ Dependency installation failed"
  exit 1
fi

echo ""

# Step 2: Check Node.js version
echo "🔍 Node.js Version:"
node --version
echo ""

# Step 3: Check required environment variables
echo "🔑 Checking environment variables..."
REQUIRED_VARS=("ANTHROPIC_API_KEY" "OPENAI_API_KEY" "DEEPSEEK_API_KEY" "MISTRAL_API_KEY")

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING_VARS+=("$var")
    echo "  ✗ $var (MISSING)"
  else
    echo "  ✓ $var (set)"
  fi
done

echo ""

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo "⚠️  Missing API keys:"
  for var in "${MISSING_VARS[@]}"; do
    echo "  - $var"
  done
  echo ""
  echo "📋 Setup instructions:"
  echo "  1. Go to Replit → Click 🔒 (Secrets)"
  echo "  2. Add each missing API key:"
  for var in "${MISSING_VARS[@]}"; do
    echo "     Key: $var"
    echo "     Value: [paste your API key]"
  done
  echo ""
  echo "  3. Re-run this script"
  exit 1
else
  echo "✓ All API keys configured"
fi

echo ""

# Step 4: Verify files
echo "📁 Checking required files..."
REQUIRED_FILES=("server.js" "package.json")

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (MISSING)"
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
  echo ""
  echo "✗ Missing files. Clone the full repo:"
  echo "  git clone https://github.com/shashikant15041982/multi-room-platform.git"
  exit 1
fi

echo ""

# Step 5: Test connection
echo "🔌 Testing API connections..."
echo "  (This requires running the server...)"
echo ""

# Step 6: Success!
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "  1. Click the green 'Run' button in Replit"
echo "  2. Wait for: '🚀 Multi-AI backend running on port 3000'"
echo "  3. Copy the public URL (e.g., https://example.replit.dev)"
echo "  4. Update in index-v2-chat-focused.html:"
echo "     const API_URL = 'https://your-replit-url';"
echo "  5. Test: Create room → Send message"
echo ""
echo "📚 More info: See QUICK_START_DEPLOYMENT.md"
echo ""

