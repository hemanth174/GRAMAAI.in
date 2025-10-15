@echo off
echo ===========================================
echo 🏥 Starting Hospital Notification System
echo ===========================================

title Hospital Notification System

echo.
echo 🚀 Starting MongoDB (make sure MongoDB is installed)...
start "MongoDB" /min mongod --dbpath "C:\data\db" 2>nul

echo 📊 Waiting for MongoDB to start...
timeout /t 3 /nobreak > nul

echo.
echo 🔔 Starting Notification Server (Port 5002)...
start "Notification Server" /min node notification-server.js

echo.
echo 🤖 Starting AI Assistant Server (Port 5003)...
start "AI Assistant Server" /min node ai-assistant-server.js

echo.
echo 🏥 Starting Patient Portal Backend (Port 5001)...
start "Patient Backend" /min node server.js

echo.
echo 🌐 Starting Patient Portal Frontend (Port 5173)...
start "Patient Frontend" /min npm run dev

echo.
echo ===========================================
echo ✅ All services starting...
echo ===========================================
echo.
echo 📋 Services Overview:
echo    📱 Patient Portal Frontend: http://localhost:5173
echo    🏥 Patient Backend API: http://localhost:5001
echo    🔔 Notification Service: http://localhost:5002
echo    🤖 AI Assistant Service: http://localhost:5003
echo    📊 MongoDB: Default port 27017
echo.
echo 💡 Press any key to open Patient Portal...
pause > nul

start http://localhost:5173

echo.
echo 🎉 Hospital Notification System is ready!
echo    Check the individual terminal windows for service logs
echo.
pause