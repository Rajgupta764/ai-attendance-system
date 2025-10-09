# 🤖 AI Face Recognition Service

Python Flask service for face recognition in the AI Attendance System.

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Visual Studio Build Tools (for dlib on Windows)

## 🚀 Quick Setup

### Step 1: Install Python Dependencies

```bash
# Navigate to ai-service folder
cd ai-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Start the AI Service

```bash
python app.py
```

You should see:
```
🤖 AI Face Recognition Service Starting...
📡 Loading face encodings...
✅ Service ready with 0 registered faces
🚀 Starting server on http://localhost:8000
```

### Step 3: Enable AI Service in Backend

Update `backend/.env`:
```env
AI_SERVICE_ENABLED=true
AI_SERVICE_URL=http://localhost:8000/api/recognize
```

Restart the backend server.

## 📝 How It Works

### 1. Register User Faces
When you create a user with an image, you need to register their face:
- The system stores face encodings
- Each user gets a unique face signature

### 2. Recognize Faces
When marking attendance:
- Capture image from webcam
- Send to AI service
- AI detects and recognizes face
- Returns user ID and confidence score
- Backend marks attendance automatically

## 🔧 API Endpoints

### POST /api/recognize
Recognize face from image
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

### POST /api/register-face
Register a new face
```json
{
  "userId": "user_id_here",
  "image": "data:image/jpeg;base64,..."
}
```

### GET /health
Health check
```json
{
  "status": "healthy",
  "service": "AI Face Recognition Service",
  "registered_faces": 5
}
```

## ⚠️ Windows Installation Notes

If you encounter issues installing `dlib` on Windows:

1. **Install Visual Studio Build Tools:**
   - Download: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Install "Desktop development with C++"

2. **Or use pre-built wheel:**
   ```bash
   pip install https://github.com/jloh02/dlib/releases/download/v19.24.1/dlib-19.24.1-cp311-cp311-win_amd64.whl
   ```

## 🎯 Testing

Test the service:
```bash
curl http://localhost:8000/health
```

## 📊 Face Data Storage

Face encodings are stored in `face_encodings.json` file.
- Automatically saved when faces are registered
- Loaded on service startup
- Can be backed up or transferred

## 🔒 Security Notes

- Service runs on localhost by default
- In production, use authentication
- Secure the endpoints
- Use HTTPS in production

---

**Service is ready to use! 🚀**
