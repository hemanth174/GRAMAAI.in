@echo off
echo ====================================
echo Hospital Management System Setup
echo Installing Database Dependencies
echo ====================================
echo.

echo Installing sqlite, sqlite3, and bcryptjs...
npm install sqlite sqlite3 bcryptjs

echo.
echo ====================================
echo Installation Complete!
echo ====================================
echo.
echo You can now start the server with:
echo   node server.js
echo   OR
echo   start-server.bat
echo.
pause
