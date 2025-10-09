@echo off
echo ========================================
echo Starting AI Face Recognition Service
echo ========================================
echo.

if not exist venv (
    echo Error: Virtual environment not found!
    echo Please run install.bat first
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Starting Flask server on http://localhost:8000
echo Press Ctrl+C to stop
echo.

python app.py
