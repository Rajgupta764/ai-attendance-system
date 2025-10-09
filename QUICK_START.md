# ⚡ Quick Start Guide

Get your AI Attendance System up and running in 5 minutes!

## 🚀 Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Git installed

## 📦 Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies (optional - for running both servers together)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your MongoDB URI and other settings:
```env
MONGODB_URI=mongodb://localhost:27017/ai-attendance
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

The default settings should work for local development.

### 3. Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Start the Application

**Option A: Run Both Servers Together (from root directory)**
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### 6. Login

Use the default admin credentials:
```
Email: admin@attendance.com
Password: admin123
```

**⚠️ Important:** Change the default password after first login!

## 🎯 What's Next?

1. **Change Admin Password**
   - Go to Profile → Change Password

2. **Add Users**
   - Navigate to Users → Add User
   - Upload profile images

3. **Mark Attendance**
   - Go to Attendance → Mark Attendance
   - Use Face Recognition or Manual Entry

4. **View Reports**
   - Navigate to Reports
   - Filter and export attendance data

## 🔧 Common Issues

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod --version
net start MongoDB  # Windows
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001
```

### Cloudinary Upload Error
- Sign up at https://cloudinary.com
- Get your credentials from Dashboard
- Update backend/.env

## 📚 Documentation

- [Full Setup Guide](SETUP_GUIDE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Features List](FEATURES.md)

## 🆘 Need Help?

- Check [Troubleshooting](SETUP_GUIDE.md#troubleshooting)
- Open an issue on GitHub
- Email: support@attendance.com

---

**Happy Coding! 🎉**
