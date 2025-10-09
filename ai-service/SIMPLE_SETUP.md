# 🤖 Simple AI Service Setup

## ⚡ Quick Setup (3 Steps)

### Step 1: Install Python (if not installed)
Download and install Python from: https://www.python.org/downloads/
- ✅ Check "Add Python to PATH" during installation

### Step 2: Install Dependencies

Open PowerShell in the `ai-service` folder and run:

```bash
# Install dependencies
pip install Flask flask-cors numpy Pillow opencv-python-headless face-recognition
```

**Note:** This may take 5-10 minutes. Be patient!

### Step 3: Start the AI Service

```bash
python app.py
```

You should see:
```
🤖 AI Face Recognition Service Starting...
✅ Service ready with 0 registered faces
🚀 Starting server on http://localhost:8000
```

---

## 🔧 Enable in Backend

Update `backend/.env`:
```env
AI_SERVICE_ENABLED=true
AI_SERVICE_URL=http://localhost:8000/api/recognize
```

Restart your backend server.

---

## 🎯 How to Use

### Step 1: Register User Faces First

Before face recognition works, you need to register user faces:

1. Create a user in the system (Users page)
2. You'll need to manually register their face using the AI service

**For now, use the Manual Entry** - Face recognition requires training with user photos first.

### Step 2: Mark Attendance

Once faces are registered:
1. Click "Face Recognition" button
2. Allow camera access
3. Position face in frame
4. Click "Capture & Recognize"
5. System will recognize and mark attendance

---

## ⚠️ Windows Installation Issues?

If `face-recognition` fails to install on Windows:

### Option 1: Use CMake
```bash
pip install cmake
pip install dlib
pip install face-recognition
```

### Option 2: Install Visual Studio Build Tools
Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Install "Desktop development with C++"
- Restart computer
- Try `pip install face-recognition` again

### Option 3: Use Pre-built Wheels
Download dlib wheel from: https://github.com/z-mahmud22/Dlib_Windows_Python3.x
Then:
```bash
pip install dlib-19.24.1-cp311-cp311-win_amd64.whl
pip install face-recognition
```

---

## 🎯 Simplified Alternative

If face recognition is too complex to set up, you can:
- ✅ Use **Manual Entry** for attendance (works perfectly!)
- ✅ Skip AI service for now
- ✅ Add it later when needed

The system works great with manual attendance marking! 🚀

---

**Need help? The manual entry feature works perfectly without AI setup!**
