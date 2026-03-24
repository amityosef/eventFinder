#!/bin/bash

# Event Finder - Start Project Script
# Launches both server and client in separate terminals

echo "🚀 Starting Event Finder System..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Install dependencies if node_modules doesn't exist
if [ ! -d "$PROJECT_ROOT/server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd "$PROJECT_ROOT/server" && npm install
fi

if [ ! -d "$PROJECT_ROOT/client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd "$PROJECT_ROOT/client" && npm install
fi

# Check for .env files
if [ ! -f "$PROJECT_ROOT/server/.env" ]; then
    echo "⚠️  Server .env file not found. Copying from .env.example..."
    cp "$PROJECT_ROOT/server/.env.example" "$PROJECT_ROOT/server/.env" 2>/dev/null || echo "❌ No .env.example found"
fi

if [ ! -f "$PROJECT_ROOT/client/.env" ]; then
    echo "⚠️  Client .env file not found. Copying from .env.example..."
    cp "$PROJECT_ROOT/client/.env.example" "$PROJECT_ROOT/client/.env" 2>/dev/null || echo "❌ No .env.example found"
fi

# Detect OS and start terminals accordingly
case "$(uname -s)" in
    Linux*)
        echo "🐧 Detected Linux"
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --tab --title="Server" -- bash -c "cd $PROJECT_ROOT/server && npm run start:dev; exec bash"
            gnome-terminal --tab --title="Client" -- bash -c "cd $PROJECT_ROOT/client && npm run dev; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -T "Server" -e "cd $PROJECT_ROOT/server && npm run start:dev" &
            xterm -T "Client" -e "cd $PROJECT_ROOT/client && npm run dev" &
        else
            echo "Starting in background..."
            cd "$PROJECT_ROOT/server" && npm run start:dev &
            cd "$PROJECT_ROOT/client" && npm run dev &
        fi
        ;;
    Darwin*)
        echo "🍎 Detected macOS"
        osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/server && npm run start:dev\""
        osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_ROOT/client && npm run dev\""
        ;;
    CYGWIN*|MINGW*|MSYS*)
        echo "🪟 Detected Windows"
        start cmd /k "cd /d $PROJECT_ROOT\server && npm run start:dev"
        start cmd /k "cd /d $PROJECT_ROOT\client && npm run dev"
        ;;
    *)
        echo "❓ Unknown OS. Starting in background..."
        cd "$PROJECT_ROOT/server" && npm run start:dev &
        cd "$PROJECT_ROOT/client" && npm run dev &
        ;;
esac

echo ""
echo "✅ Event Finder is starting!"
echo "=================================="
echo "🔵 Server: https://localhost:3000"
echo "🟢 Client: https://localhost:5173"
echo "📚 API Docs: https://localhost:3000/api/docs"
echo "=================================="
