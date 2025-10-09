# 🚀 AI Attendance System - Setup Guide

Complete step-by-step guide to set up and run the AI Attendance System on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **Python 3.8+** (Optional, for AI service) - [Download](https://www.python.org/downloads/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🔧 Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd "Ai Attendance"
```

## 🗄️ Step 2: MongoDB Setup

### Windows

1. **Install MongoDB Community Server**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Run the installer and follow the setup wizard
   - Choose "Complete" installation
   - Install MongoDB as a Service

2. **Verify Installation**
   ```bash
   mongod --version
   ```

3. **Start MongoDB Service**
   ```bash
   net start MongoDB
   ```

### macOS

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🔙 Step 3: Backend Setup

### 3.1 Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install npm packages
npm install
```

### 3.2 Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-attendance

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration (Sign up at https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Service Configuration
AI_SERVICE_URL=http://localhost:8000/api/recognize
AI_SERVICE_ENABLED=false

# CORS Origin
CORS_ORIGIN=http://localhost:5173

# Default Admin Credentials
ADMIN_EMAIL=admin@attendance.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=System Admin
```

### 3.3 Cloudinary Setup (Image Storage)

1. **Create Cloudinary Account**
   - Visit [Cloudinary](https://cloudinary.com)
   - Sign up for a free account
   - Go to Dashboard

2. **Get Credentials**
   - Copy `Cloud Name`
   - Copy `API Key`
   - Copy `API Secret`
   - Update `.env` file with these values

### 3.4 Create Uploads Directory

```bash
# Create uploads folder (if not exists)
mkdir uploads
```

### 3.5 Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected: localhost
✅ Default admin user created
📧 Email: admin@attendance.com
🔑 Password: admin123
```

## 🎨 Step 4: Frontend Setup

### 4.1 Install Dependencies

```bash
# Open new terminal
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install
```

### 4.2 Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4.3 Start Frontend Development Server

```bash
# Start Vite dev server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## 🌐 Step 5: Access the Application

1. **Open Browser**
   - Navigate to: `http://localhost:5173`

2. **Login with Default Credentials**
   ```
   Email: admin@attendance.com
   Password: admin123
   ```

3. **Change Default Password**
   - Go to Profile → Change Password
   - Update to a secure password

## 🤖 Step 6: AI Service Setup (Optional)

### 6.1 Create AI Service Directory

```bash
# Create ai-service directory in project root
mkdir ai-service
cd ai-service
```

### 6.2 Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 6.3 Install Python Dependencies

Create `requirements.txt`:

```txt
Flask==3.0.0
flask-cors==4.0.0
face-recognition==1.3.0
opencv-python==4.8.1.78
numpy==1.24.3
Pillow==10.1.0
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 6.4 Create Face Recognition Service

Create `app.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Store face encodings (in production, use database)
known_face_encodings = {}

@app.route('/api/recognize', methods=['POST'])
def recognize_face():
    try:
        data = request.json
        image_data = data.get('image')
        
        # Decode base64 image
        image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        
        # Find faces in image
        face_locations = face_recognition.face_locations(image_np)
        face_encodings = face_recognition.face_encodings(image_np, face_locations)
        
        if len(face_encodings) == 0:
            return jsonify({'error': 'No face detected'}), 404
        
        # Compare with known faces
        for user_id, known_encoding in known_face_encodings.items():
            matches = face_recognition.compare_faces([known_encoding], face_encodings[0])
            if matches[0]:
                face_distances = face_recognition.face_distance([known_encoding], face_encodings[0])
                confidence = (1 - face_distances[0]) * 100
                
                return jsonify({
                    'userId': user_id,
                    'confidence': round(confidence, 2)
                })
        
        return jsonify({'error': 'Face not recognized'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/register-face', methods=['POST'])
def register_face():
    try:
        data = request.json
        user_id = data.get('userId')
        image_data = data.get('image')
        
        # Decode base64 image
        image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        
        # Get face encoding
        face_encodings = face_recognition.face_encodings(image_np)
        
        if len(face_encodings) == 0:
            return jsonify({'error': 'No face detected'}), 400
        
        # Store encoding
        known_face_encodings[user_id] = face_encodings[0]
        
        return jsonify({'message': 'Face registered successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'AI Face Recognition'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
```

### 6.5 Start AI Service

```bash
python app.py
```

### 6.6 Enable AI Service in Backend

Update backend `.env`:

```env
AI_SERVICE_ENABLED=true
AI_SERVICE_URL=http://localhost:8000/api/recognize
```

Restart backend server.

## ✅ Step 7: Verify Installation

### 7.1 Check All Services

1. **MongoDB**: `http://localhost:27017` (should be running)
2. **Backend API**: `http://localhost:5000/api/health`
3. **Frontend**: `http://localhost:5173`
4. **AI Service** (if enabled): `http://localhost:8000/health`

### 7.2 Test Basic Functionality

1. **Login** ✓
   - Use admin credentials
   - Should redirect to dashboard

2. **Dashboard** ✓
   - View statistics
   - See charts and graphs

3. **User Management** ✓
   - Add new user
   - Upload profile image
   - Edit user details

4. **Attendance** ✓
   - Mark manual attendance
   - Test face recognition (if AI enabled)

5. **Reports** ✓
   - Filter attendance
   - Export to CSV

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Find process using port
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill process or change PORT in .env
```

### Cloudinary Upload Error

**Error**: `Cloudinary upload failed`

**Solution**:
- Verify Cloudinary credentials in `.env`
- Check internet connection
- Ensure image size is under 10MB

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
- Verify `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches CORS_ORIGIN
- Restart backend server

### Face Recognition Not Working

**Error**: `AI service unavailable`

**Solution**:
- Check if AI service is running on port 8000
- Verify `AI_SERVICE_ENABLED=true` in backend `.env`
- Check AI service logs for errors

## 📦 Building for Production

### Backend Production Build

```bash
cd backend

# Set environment to production
# Update .env: NODE_ENV=production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start src/server.js --name ai-attendance-api
pm2 save
pm2 startup
```

### Frontend Production Build

```bash
cd frontend

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy dist folder to hosting service
```

## 🚀 Deployment Options

### Backend Deployment
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: VPS with full control
- **AWS EC2**: Scalable cloud hosting
- **Railway**: Simple deployment platform

### Frontend Deployment
- **Vercel**: Optimized for React/Vite
- **Netlify**: Easy static site hosting
- **GitHub Pages**: Free hosting option
- **AWS S3 + CloudFront**: Scalable CDN

### Database Deployment
- **MongoDB Atlas**: Managed cloud database
- **DigitalOcean Managed MongoDB**: Reliable hosting
- **AWS DocumentDB**: MongoDB-compatible service

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Face Recognition Library](https://github.com/ageitgey/face_recognition)

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error logs in terminal
3. Search existing GitHub issues
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - System information
   - Screenshots (if applicable)

## ✨ Next Steps

After successful setup:

1. **Customize Branding**
   - Update logo and colors
   - Modify app name

2. **Configure Email Notifications**
   - Set up email service (SendGrid, Mailgun)
   - Configure notification templates

3. **Add More Features**
   - Implement leave management
   - Add shift scheduling
   - Create advanced reports

4. **Security Enhancements**
   - Enable 2FA
   - Add rate limiting
   - Implement IP whitelisting

---

**🎉 Congratulations! Your AI Attendance System is now ready to use!**
