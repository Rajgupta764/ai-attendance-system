@echo off
echo ========================================
echo   AI Attendance Backend Server
echo ========================================
echo.

REM Kill any existing Node processes on port 5000
echo Checking for existing processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Found process %%a on port 5000, terminating...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Starting backend server...
echo.

npm run dev
