@echo off
echo ========================================
echo AI Face Recognition Service Setup
echo ========================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo Error: Failed to create virtual environment
    echo Make sure Python is installed and in PATH
    pause
    exit /b 1
)

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate

echo.
echo Step 3: Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Step 4: Installing dependencies...
echo This may take 5-10 minutes...
pip install Flask flask-cors numpy Pillow

echo.
echo Step 5: Installing face recognition (this may take longer)...
pip install cmake
pip install dlib
pip install face-recognition

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the AI service, run:
echo   venv\Scripts\activate
echo   python app.py
echo.
pause
