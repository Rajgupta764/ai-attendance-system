# 🎯 Get Started - Complete Checklist

Your step-by-step guide to getting the AI Attendance System up and running!

## ✅ Pre-Installation Checklist

### Required Software
- [ ] **Node.js 18+** installed
  - Check: `node --version`
  - Download: https://nodejs.org

- [ ] **MongoDB 6+** installed
  - Check: `mongod --version`
  - Download: https://www.mongodb.com/try/download/community

- [ ] **Git** installed
  - Check: `git --version`
  - Download: https://git-scm.com

- [ ] **Code Editor** (VS Code recommended)
  - Download: https://code.visualstudio.com

### Optional (for AI features)
- [ ] **Python 3.8+** installed
  - Check: `python --version`
  - Download: https://python.org

## 📦 Installation Steps

### Step 1: Project Setup
- [ ] Navigate to project directory
  ```bash
  cd "c:\Users\Raj kumar\Desktop\Ai Attendance"
  ```

- [ ] Verify all files are present
  ```bash
  dir  # Windows
  ls   # macOS/Linux
  ```

### Step 2: Backend Setup
- [ ] Navigate to backend folder
  ```bash
  cd backend
  ```

- [ ] Install dependencies
  ```bash
  npm install
  ```

- [ ] Create .env file
  ```bash
  copy .env.example .env  # Windows
  cp .env.example .env    # macOS/Linux
  ```

- [ ] Configure .env file (open in editor)
  - [ ] Set `MONGODB_URI`
  - [ ] Set `JWT_SECRET`
  - [ ] Set Cloudinary credentials (optional)
  - [ ] Review other settings

### Step 3: Frontend Setup
- [ ] Navigate to frontend folder
  ```bash
  cd ../frontend
  ```

- [ ] Install dependencies
  ```bash
  npm install
  ```

- [ ] Create .env file
  ```bash
  copy .env.example .env  # Windows
  cp .env.example .env    # macOS/Linux
  ```

- [ ] Verify API URL (should be `http://localhost:5000/api`)

### Step 4: Database Setup
- [ ] Start MongoDB service
  ```bash
  # Windows
  net start MongoDB
  
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```

- [ ] Verify MongoDB is running
  ```bash
  mongosh  # Should connect successfully
  ```

## 🚀 Running the Application

### Option A: Run Both Servers Together (Recommended)
- [ ] From project root directory
  ```bash
  npm install  # Install concurrently
  npm run dev
  ```

### Option B: Run Separately
- [ ] **Terminal 1 - Backend**
  ```bash
  cd backend
  npm run dev
  ```
  - [ ] Wait for "Server running on port 5000"
  - [ ] Wait for "MongoDB Connected"
  - [ ] Note the admin credentials displayed

- [ ] **Terminal 2 - Frontend**
  ```bash
  cd frontend
  npm run dev
  ```
  - [ ] Wait for "Local: http://localhost:5173"

## 🌐 Access the Application

- [ ] Open browser
- [ ] Navigate to: `http://localhost:5173`
- [ ] You should see the login page

## 🔐 First Login

- [ ] Use default admin credentials:
  - **Email:** `admin@attendance.com`
  - **Password:** `admin123`

- [ ] Click "Sign In"
- [ ] You should be redirected to the dashboard

## ⚙️ Initial Configuration

### Change Admin Password (Important!)
- [ ] Click on profile/avatar in sidebar
- [ ] Go to "Profile" page
- [ ] Scroll to "Change Password" section
- [ ] Enter current password: `admin123`
- [ ] Enter new secure password
- [ ] Click "Update Password"

### Configure Cloudinary (For Image Uploads)
- [ ] Sign up at https://cloudinary.com (free tier)
- [ ] Go to Dashboard
- [ ] Copy credentials:
  - Cloud Name
  - API Key
  - API Secret
- [ ] Update `backend/.env` file
- [ ] Restart backend server

## 👥 Add Your First User

- [ ] Navigate to "Users" page
- [ ] Click "Add User" button
- [ ] Fill in user details:
  - [ ] Name
  - [ ] Email
  - [ ] Password
  - [ ] Employee ID (optional)
  - [ ] Department (optional)
  - [ ] Upload profile image (optional)
- [ ] Select role: "User"
- [ ] Click "Create User"

## 📅 Mark Attendance

### Manual Attendance
- [ ] Go to "Attendance" page
- [ ] Click "Manual Entry"
- [ ] Select user from dropdown
- [ ] Click "Mark Present"
- [ ] Verify attendance appears in table

### Face Recognition (Optional - Requires AI Service)
- [ ] Set up Python AI service (see SETUP_GUIDE.md)
- [ ] Enable AI service in backend/.env
- [ ] Click "Face Recognition" button
- [ ] Allow camera access
- [ ] Position face in frame
- [ ] Click "Capture & Recognize"

## 📊 View Reports

- [ ] Navigate to "Reports" page
- [ ] Set date range (optional)
- [ ] Apply filters (optional)
- [ ] View attendance records
- [ ] Click "Export CSV" to download

## 👤 Test User Login

- [ ] Logout from admin account
- [ ] Login with user credentials
- [ ] Verify user dashboard loads
- [ ] Check "My Attendance" page
- [ ] View personal statistics

## ✅ Verification Checklist

### Backend Verification
- [ ] Backend running on port 5000
- [ ] MongoDB connected successfully
- [ ] Default admin user created
- [ ] API health check: `http://localhost:5000/api/health`

### Frontend Verification
- [ ] Frontend running on port 5173
- [ ] Login page loads correctly
- [ ] Can login with admin credentials
- [ ] Dashboard displays properly
- [ ] All pages accessible

### Functionality Verification
- [ ] User creation works
- [ ] Image upload works (if Cloudinary configured)
- [ ] Attendance marking works
- [ ] Reports generation works
- [ ] CSV export works
- [ ] Password change works
- [ ] Logout works

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- [ ] Check if MongoDB is running
- [ ] Verify MONGODB_URI in .env
- [ ] Check MongoDB logs

### Issue: Port Already in Use
**Solution:**
- [ ] Change PORT in backend/.env
- [ ] Or kill process using the port
- [ ] Restart server

### Issue: Cannot Login
**Solution:**
- [ ] Verify backend is running
- [ ] Check console for errors
- [ ] Verify credentials
- [ ] Check network tab in browser

### Issue: Image Upload Fails
**Solution:**
- [ ] Verify Cloudinary credentials
- [ ] Check file size (max 5MB)
- [ ] Check file format (jpg, png, gif)
- [ ] Check backend logs

### Issue: Face Recognition Not Working
**Solution:**
- [ ] Verify AI service is running
- [ ] Check AI_SERVICE_ENABLED=true
- [ ] Verify AI_SERVICE_URL
- [ ] Check camera permissions

## 📚 Next Steps

### Learn the System
- [ ] Read [FEATURES.md](FEATURES.md) - Understand all features
- [ ] Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [ ] Study [ARCHITECTURE.md](ARCHITECTURE.md) - System design

### Customize the System
- [ ] Update branding/logo
- [ ] Modify color scheme (tailwind.config.js)
- [ ] Add custom departments
- [ ] Configure notifications

### Deploy to Production
- [ ] Follow [DEPLOYMENT.md](DEPLOYMENT.md)
- [ ] Set up MongoDB Atlas
- [ ] Deploy backend (Heroku/AWS)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configure domain & SSL

### Add AI Features
- [ ] Set up Python environment
- [ ] Install face_recognition library
- [ ] Create AI service (see SETUP_GUIDE.md)
- [ ] Test face recognition
- [ ] Train with user faces

## 🎯 Development Workflow

### Daily Development
1. [ ] Start MongoDB
2. [ ] Run backend: `cd backend && npm run dev`
3. [ ] Run frontend: `cd frontend && npm run dev`
4. [ ] Make changes
5. [ ] Test in browser
6. [ ] Commit changes

### Before Committing
- [ ] Test all functionality
- [ ] Check console for errors
- [ ] Verify no hardcoded secrets
- [ ] Update documentation if needed
- [ ] Run linter (if configured)

## 📊 Progress Tracker

### Setup Progress
- [ ] Prerequisites installed
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Database running
- [ ] Application running
- [ ] First login successful

### Configuration Progress
- [ ] Admin password changed
- [ ] Cloudinary configured
- [ ] First user added
- [ ] Attendance marked
- [ ] Reports generated

### Learning Progress
- [ ] Understand features
- [ ] Know API endpoints
- [ ] Understand architecture
- [ ] Can customize UI
- [ ] Can add features

## 🎉 Success Criteria

You've successfully set up the system when:
- ✅ Both backend and frontend are running
- ✅ You can login as admin
- ✅ You can create users
- ✅ You can mark attendance
- ✅ You can generate reports
- ✅ All pages load without errors

## 📞 Getting Help

### Documentation
- [ ] Check [INDEX.md](INDEX.md) for all docs
- [ ] Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed help
- [ ] See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API help

### Troubleshooting
- [ ] Check browser console for errors
- [ ] Check backend terminal for errors
- [ ] Review error messages carefully
- [ ] Search documentation for solutions

### Community Support
- [ ] GitHub Issues for bugs
- [ ] GitHub Discussions for questions
- [ ] Stack Overflow for general help

## 🚀 Quick Commands Reference

### Start Everything
```bash
# From project root
npm run dev
```

### Backend Only
```bash
cd backend
npm run dev
```

### Frontend Only
```bash
cd frontend
npm run dev
```

### MongoDB
```bash
# Start
net start MongoDB  # Windows
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux

# Check status
mongosh
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## ✨ Tips for Success

1. **Keep terminals open** - Don't close backend/frontend terminals
2. **Check logs** - Always monitor console output
3. **Save .env files** - Don't commit them to git
4. **Use strong passwords** - Change default credentials
5. **Test incrementally** - Verify each feature works
6. **Read documentation** - Comprehensive guides available
7. **Ask for help** - Use community resources

## 🎊 Congratulations!

Once you complete this checklist, you'll have:
- ✅ Fully functional AI Attendance System
- ✅ Understanding of all features
- ✅ Ability to customize and extend
- ✅ Knowledge to deploy to production

**You're ready to build amazing attendance tracking solutions! 🚀**

---

**Need help? Start with [QUICK_START.md](QUICK_START.md) or [SETUP_GUIDE.md](SETUP_GUIDE.md)**

*Last Updated: 2024-01-15*
