# 📁 Project Structure

Complete directory structure of the AI Attendance System.

```
Ai Attendance/
│
├── 📄 README.md                      # Main documentation
├── 📄 QUICK_START.md                 # Quick start guide
├── 📄 SETUP_GUIDE.md                 # Detailed setup instructions
├── 📄 API_DOCUMENTATION.md           # API reference
├── 📄 DEPLOYMENT.md                  # Deployment guide
├── 📄 FEATURES.md                    # Features overview
├── 📄 PROJECT_STRUCTURE.md           # This file
├── 📄 LICENSE                        # MIT License
├── 📄 .gitignore                     # Git ignore rules
├── 📄 package.json                   # Root package file
│
├── 📂 backend/                       # Backend (Node.js + Express)
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 .env.example               # Environment variables template
│   ├── 📄 .gitignore                 # Backend git ignore
│   │
│   └── 📂 src/                       # Source code
│       ├── 📄 server.js              # Server entry point
│       ├── 📄 app.js                 # Express app configuration
│       │
│       ├── 📂 config/                # Configuration files
│       │   ├── 📄 database.js        # MongoDB connection
│       │   └── 📄 cloudinary.js      # Cloudinary setup
│       │
│       ├── 📂 models/                # Mongoose models
│       │   ├── 📄 User.js            # User schema
│       │   └── 📄 Attendance.js      # Attendance schema
│       │
│       ├── 📂 controllers/           # Route controllers
│       │   ├── 📄 authController.js  # Authentication logic
│       │   ├── 📄 userController.js  # User management
│       │   └── 📄 attendanceController.js  # Attendance logic
│       │
│       ├── 📂 routes/                # API routes
│       │   ├── 📄 authRoutes.js      # Auth endpoints
│       │   ├── 📄 userRoutes.js      # User endpoints
│       │   └── 📄 attendanceRoutes.js # Attendance endpoints
│       │
│       └── 📂 middleware/            # Custom middleware
│           ├── 📄 auth.js            # JWT authentication
│           ├── 📄 errorHandler.js    # Error handling
│           └── 📄 upload.js          # File upload (Multer)
│
├── 📂 frontend/                      # Frontend (React + Vite)
│   ├── 📄 package.json               # Frontend dependencies
│   ├── 📄 vite.config.js             # Vite configuration
│   ├── 📄 tailwind.config.js         # Tailwind CSS config
│   ├── 📄 postcss.config.js          # PostCSS config
│   ├── 📄 eslint.config.js           # ESLint configuration
│   ├── 📄 index.html                 # HTML template
│   ├── 📄 .env.example               # Environment template
│   ├── 📄 .gitignore                 # Frontend git ignore
│   │
│   └── 📂 src/                       # Source code
│       ├── 📄 main.jsx               # App entry point
│       ├── 📄 App.jsx                # Main App component
│       ├── 📄 index.css              # Global styles
│       │
│       ├── 📂 components/            # React components
│       │   ├── 📄 ProtectedRoute.jsx # Route protection
│       │   │
│       │   ├── 📂 ui/                # UI components
│       │   │   ├── 📄 Button.jsx     # Button component
│       │   │   ├── 📄 Card.jsx       # Card component
│       │   │   ├── 📄 Input.jsx      # Input component
│       │   │   ├── 📄 Modal.jsx      # Modal component
│       │   │   └── 📄 Table.jsx      # Table component
│       │   │
│       │   └── 📂 layout/            # Layout components
│       │       ├── 📄 Layout.jsx     # Main layout
│       │       ├── 📄 Sidebar.jsx    # Sidebar navigation
│       │       └── 📄 Navbar.jsx     # Top navbar
│       │
│       ├── 📂 pages/                 # Page components
│       │   ├── 📄 Login.jsx          # Login page
│       │   ├── 📄 Dashboard.jsx      # Dashboard (Admin/User)
│       │   ├── 📄 Users.jsx          # User management (Admin)
│       │   ├── 📄 Attendance.jsx     # Attendance marking (Admin)
│       │   ├── 📄 Reports.jsx        # Reports page (Admin)
│       │   ├── 📄 MyAttendance.jsx   # User attendance view
│       │   ├── 📄 Profile.jsx        # User profile
│       │   └── 📄 Settings.jsx       # System settings (Admin)
│       │
│       ├── 📂 context/               # React Context
│       │   └── 📄 AuthContext.jsx    # Authentication context
│       │
│       └── 📂 utils/                 # Utility functions
│           ├── 📄 api.js             # Axios instance
│           └── 📄 helpers.js         # Helper functions
│
└── 📂 ai-service/                    # AI Service (Python - Optional)
    ├── 📄 app.py                     # Flask/FastAPI app
    ├── 📄 requirements.txt           # Python dependencies
    └── 📄 README.md                  # AI service docs
```

## 📊 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| Backend Files | 15 | API, models, controllers, middleware |
| Frontend Files | 25 | Components, pages, utilities |
| Documentation | 8 | Guides, API docs, README |
| Configuration | 12 | Package.json, env, configs |
| **Total** | **60+** | Complete project files |

## 🔑 Key Files Explained

### Backend

**`server.js`**
- Entry point for the backend
- Connects to MongoDB
- Creates default admin user
- Starts Express server

**`app.js`**
- Express app configuration
- Middleware setup
- Route registration
- Error handling

**`models/User.js`**
- User schema definition
- Password hashing
- Authentication methods
- Data validation

**`models/Attendance.js`**
- Attendance schema
- Compound indexes
- Date validation
- Status enumeration

**`controllers/authController.js`**
- Login logic
- User registration
- Password management
- JWT token generation

**`controllers/attendanceController.js`**
- Mark attendance
- Face recognition integration
- Attendance reports
- CSV export

**`middleware/auth.js`**
- JWT verification
- Role-based authorization
- Protected route handling

### Frontend

**`App.jsx`**
- Main application component
- Route configuration
- Protected routes
- Toast notifications

**`main.jsx`**
- React entry point
- Root rendering
- Strict mode wrapper

**`components/layout/Layout.jsx`**
- Main layout structure
- Sidebar + Navbar + Content
- Responsive design

**`components/layout/Sidebar.jsx`**
- Navigation menu
- Role-based links
- User profile display
- Logout functionality

**`pages/Dashboard.jsx`**
- Statistics cards
- Charts and graphs
- Real-time data
- Admin/User views

**`pages/Attendance.jsx`**
- Face recognition camera
- Manual attendance
- Today's records
- Real-time updates

**`pages/Users.jsx`**
- User CRUD operations
- Image upload
- Search and filter
- Role management

**`context/AuthContext.jsx`**
- Authentication state
- Login/Logout functions
- User data management
- Token handling

**`utils/api.js`**
- Axios configuration
- Request interceptors
- Response handling
- Error management

## 📦 Dependencies

### Backend Dependencies
```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "dotenv": "Environment variables",
  "cors": "Cross-origin requests",
  "multer": "File uploads",
  "cloudinary": "Image storage",
  "axios": "HTTP client",
  "json2csv": "CSV export"
}
```

### Frontend Dependencies
```json
{
  "react": "UI library",
  "react-dom": "React DOM",
  "react-router-dom": "Routing",
  "axios": "HTTP client",
  "framer-motion": "Animations",
  "recharts": "Charts",
  "lucide-react": "Icons",
  "react-webcam": "Camera",
  "react-hot-toast": "Notifications",
  "tailwindcss": "Styling"
}
```

## 🔄 Data Flow

```
User Action (Frontend)
    ↓
React Component
    ↓
API Call (Axios)
    ↓
Express Route
    ↓
Controller Logic
    ↓
MongoDB Query
    ↓
Response to Frontend
    ↓
UI Update
```

## 🎨 Component Hierarchy

```
App
├── AuthProvider
│   ├── Router
│   │   ├── Login (Public)
│   │   └── Layout (Protected)
│   │       ├── Sidebar
│   │       ├── Navbar
│   │       └── Pages
│   │           ├── Dashboard
│   │           ├── Users (Admin)
│   │           ├── Attendance (Admin)
│   │           ├── Reports (Admin)
│   │           ├── Settings (Admin)
│   │           ├── MyAttendance (User)
│   │           └── Profile (User)
└── Toaster
```

## 🗄️ Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/user),
  imageUrl: String,
  imagePublicId: String,
  faceData: [Number],
  department: String,
  employeeId: String (unique),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  status: String (Present/Absent/Late/Leave),
  markedBy: ObjectId (ref: User),
  checkInTime: Date,
  checkOutTime: Date,
  method: String (face-recognition/manual),
  confidence: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Environment Variables

### Backend (.env)
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT signing key
- `JWT_EXPIRE` - Token expiration
- `CLOUDINARY_*` - Image storage credentials
- `AI_SERVICE_URL` - AI service endpoint
- `CORS_ORIGIN` - Allowed frontend origin
- `ADMIN_*` - Default admin credentials

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 📝 Code Style

- **ES6+ JavaScript** - Modern syntax
- **Async/Await** - Promise handling
- **Arrow Functions** - Concise syntax
- **Destructuring** - Clean code
- **Template Literals** - String formatting
- **Modular Exports** - Code organization

## 🧪 Testing Structure (Future)

```
tests/
├── backend/
│   ├── unit/
│   │   ├── models/
│   │   └── controllers/
│   └── integration/
│       └── api/
└── frontend/
    ├── unit/
    │   └── components/
    └── e2e/
        └── flows/
```

---

**This structure ensures scalability, maintainability, and clean code organization! 🚀**
