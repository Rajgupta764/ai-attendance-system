@echo off
echo ========================================
echo AI Attendance System - Service Manager
echo ========================================
echo.

REM Check if services are running
echo Checking service status...
netstat -ano | findstr LISTENING | findstr -E ":5000|:8000|:5173" > temp_services.txt

echo Current Services:
echo ================
findstr ":5000" temp_services.txt >nul 2>&1 && echo ✅ Backend (Port 5000) - RUNNING || echo ❌ Backend (Port 5000) - STOPPED
findstr ":8000" temp_services.txt >nul 2>&1 && echo ✅ AI Service (Port 8000) - RUNNING || echo ❌ AI Service (Port 8000) - STOPPED
findstr ":5173" temp_services.txt >nul 2>&1 && echo ✅ Frontend (Port 5173) - RUNNING || echo ❌ Frontend (Port 5173) - STOPPED

echo.
echo Options:
echo ========
echo 1) Start All Services (Recommended)
echo 2) Check Status Only
echo 3) Restart All Services
echo 4) Stop All Services
echo 5) Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto status_only
if "%choice%"=="3" goto restart_all
if "%choice%"=="4" goto stop_all
if "%choice%"=="5" goto exit

:start_all
echo.
echo Starting all services...
call START_ALL.bat
goto end

:status_only
echo.
echo Status checked above.
goto end

:restart_all
echo.
echo Stopping all services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr -E ":5000|:8000|:5173" ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 3 >nul
echo Starting all services...
call START_ALL.bat
goto end

:stop_all
echo.
echo Stopping all services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr -E ":5000|:8000|:5173" ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
echo All services stopped.
goto end

:exit
del temp_services.txt 2>nul
echo Goodbye!
goto end

:end
del temp_services.txt 2>nul
echo.
echo Press any key to exit...
pause >nul
