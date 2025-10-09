@echo off
echo ========================================
echo Starting AI Attendance System
echo ========================================
echo.

REM Kill any existing processes on ports
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 >nul

echo.
echo ========================================
echo Starting Backend (Port 5000)...
echo ========================================
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 5 >nul

echo.
echo ========================================
echo Starting AI Service (Port 8000)...
echo ========================================
start "AI Service" cmd /k "cd ai-service && python simple_app.py"
timeout /t 3 >nul

echo.
echo ========================================
echo Starting Frontend (Port 5173)...
echo ========================================
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo AI Service: http://localhost:8000
echo.
echo Press any key to open the application in browser...
pause >nul
start http://localhost:5173
