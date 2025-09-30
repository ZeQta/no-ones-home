#!/bin/bash

# Fears to Fiction - Server Launcher Script
# Automatically detects and runs the best available HTTP server

echo "🎮 Fears to Fiction - Starting Local Server..."
echo ""

# Try Python 3
if command -v python3 &> /dev/null; then
    echo "✓ Using Python 3"
    echo "🌐 Server running at: http://localhost:8000"
    echo "📱 Press Ctrl+C to stop"
    echo ""
    python3 -m http.server 8000
    exit 0
fi

# Try Python 2
if command -v python &> /dev/null; then
    echo "✓ Using Python 2"
    echo "🌐 Server running at: http://localhost:8000"
    echo "📱 Press Ctrl+C to stop"
    echo ""
    python -m SimpleHTTPServer 8000
    exit 0
fi

# Try npx (Node.js)
if command -v npx &> /dev/null; then
    echo "✓ Using Node.js http-server"
    echo "🌐 Server running at: http://localhost:8000"
    echo "📱 Press Ctrl+C to stop"
    echo ""
    npx http-server -p 8000
    exit 0
fi

# No server available
echo "❌ Error: No HTTP server found!"
echo ""
echo "Please install one of the following:"
echo "  - Python: https://python.org"
echo "  - Node.js: https://nodejs.org"
echo ""
echo "Or manually start a server on port 8000"
exit 1