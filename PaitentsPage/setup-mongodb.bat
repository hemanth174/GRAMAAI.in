@echo off
echo ===========================================
echo 📊 MongoDB Setup for Hospital System
echo ===========================================

echo.
echo This script will help you set up MongoDB for the Hospital Notification System
echo.

:: Check if MongoDB is already installed
where mongod >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo ✅ MongoDB is already installed!
    goto :start_mongo
)

echo ❌ MongoDB not found in PATH
echo.
echo Please install MongoDB Community Edition:
echo 1. Visit: https://www.mongodb.com/try/download/community
echo 2. Download MongoDB Community Server for Windows
echo 3. Run the installer with default settings
echo 4. Make sure to add MongoDB to PATH during installation
echo.
echo After installation, run this script again.
echo.
pause
exit /b 1

:start_mongo
echo.
echo 🚀 Starting MongoDB...

:: Create data directory if it doesn't exist
if not exist "C:\data\db" (
    echo 📁 Creating MongoDB data directory...
    mkdir "C:\data\db" 2>nul
    if %ERRORLEVEL% neq 0 (
        echo ⚠️  Could not create C:\data\db - trying current directory...
        mkdir "data" 2>nul
        mkdir "data\db" 2>nul
        echo 📁 Using local data directory: %CD%\data\db
        mongod --dbpath "%CD%\data\db"
        goto :end
    )
)

echo 📊 Starting MongoDB with default data path...
mongod --dbpath "C:\data\db"

:end
echo.
echo MongoDB setup complete!
pause