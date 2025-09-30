@echo off
REM Fears to Fiction - Server Launcher Script (Windows)
REM Automatically detects and runs the best available HTTP server

echo.
echo 🎮 Fears to Fiction - Starting Local Server...
echo.

REM Try Python 3
where python3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Using Python 3
    echo 🌐 Server running at: http://localhost:8000
    echo 📱 Press Ctrl+C to stop
    echo.
    python3 -m http.server 8000
    exit /b 0
)

REM Try Python
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Using Python
    echo 🌐 Server running at: http://localhost:8000
    echo 📱 Press Ctrl+C to stop
    echo.
    python -m http.server 8000
    exit /b 0
)

REM Try npx (Node.js)
where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Using Node.js http-server
    echo 🌐 Server running at: http://localhost:8000
    echo 📱 Press Ctrl+C to stop
    echo.
    npx http-server -p 8000
    exit /b 0
)

REM No server available
echo ❌ Error: No HTTP server found!
echo.
echo Please install one of the following:
echo   - Python: https://python.org
echo   - Node.js: https://nodejs.org
echo.
echo Or manually start a server on port 8000
pause
exit /b 1