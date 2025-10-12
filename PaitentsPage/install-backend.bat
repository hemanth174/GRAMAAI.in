@echo off
echo Installing Patient Portal Backend Dependencies...
cd /d "%~dp0"
npm install --prefix . --package-lock-only=false express cors sqlite3 sqlite
echo.
echo Backend dependencies installed successfully!
pause
