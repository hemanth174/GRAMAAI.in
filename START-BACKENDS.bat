@echo off
echo Starting Hospital Backend Server...
cd /d "%~dp0Hospital"
start "Hospital Backend" cmd /k "node server.js"
echo Hospital Backend started!
echo.
echo Starting Patient Portal Backend Server...
cd /d "%~dp0PaitentsPage"
start "Patient Portal Backend" cmd /k "node server.js"
echo Patient Portal Backend started!
echo.
echo Both backends are now running!
echo Hospital Backend: http://localhost:5000
echo Patient Portal Backend: http://localhost:5001
pause
