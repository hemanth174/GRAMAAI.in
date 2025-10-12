@echo off
echo Starting Patient Portal Backend Server...
cd /d "%~dp0"
start "Patient Portal Backend" cmd /k "node server.js"
echo Backend server starting on http://localhost:5001
