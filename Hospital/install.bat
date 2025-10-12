@echo off
echo ========================================
echo Hospital Management System - Quick Start
echo ========================================
echo.

echo Installing Backend Dependencies...
echo.
call npm install express nodemailer body-parser cors

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To run the application:
echo.
echo 1. Start Backend (in this terminal):
echo    node server.js
echo.
echo 2. Start Frontend (in a NEW terminal):
echo    npm run dev
echo.
echo ========================================
echo.
pause
