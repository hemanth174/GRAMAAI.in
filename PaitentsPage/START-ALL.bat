@echo off
echo ========================================
echo   PATIENT PORTAL - START ALL SERVICES
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend Server (Port 5001)...
start "Patient Portal Backend" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (Port 5173)...
start "Patient Portal Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   ALL SERVICES STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
