# 🏗️ System Architecture

Detailed architecture and design patterns of the AI Attendance System.

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Frontend (Vite + Tailwind)           │   │
│  │  - Pages  - Components  - Context  - Utils           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Express.js Backend (Node.js)               │   │
│  │  - Routes  - Controllers  - Middleware               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ↓                   ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│      DATA LAYER          │  │    EXTERNAL SERVICES     │
│  ┌──────────────────┐    │  │  ┌──────────────────┐   │
│  │    MongoDB       │    │  │  │   Cloudinary     │   │
│  │  - Users         │    │  │  │  (Image Storage) │   │
│  │  - Attendance    │    │  │  └──────────────────┘   │
│  └──────────────────┘    │  │  ┌──────────────────┐   │
└──────────────────────────┘  │  │   AI Service     │   │
                              │  │  (Face Recognition)│   │
                              │  └──────────────────┘   │
                              └──────────────────────────┘
```

## 🔄 Request Flow

### 1. User Authentication Flow

```
User Login Request
       │
       ↓
[Frontend: Login Page]
       │
       ↓ POST /api/auth/login
       │ { email, password }
       ↓
[Backend: Auth Route]
       │
       ↓
[Auth Controller]
       │
       ↓
[User Model - Find User]
       │
       ↓
[Compare Password (bcrypt)]
       │
       ↓
[Generate JWT Token]
       │
       ↓
[Response with Token & User Data]
       │
       ↓
[Frontend: Store Token & User]
       │
       ↓
[Redirect to Dashboard]
```

### 2. Attendance Marking Flow (Face Recognition)

```
Admin Opens Camera
       │
       ↓
[React Webcam Component]
       │
       ↓
Capture Image (Base64)
       │
       ↓ POST /api/attendance/recognize
       │ { imageData: "base64..." }
       ↓
[Backend: Attendance Route]
       │
       ↓
[Attendance Controller]
       │
       ↓
[Forward to AI Service]
       │
       ↓
[Python AI Service]
  - Decode Base64
  - Face Detection
  - Face Recognition
  - Return User ID + Confidence
       │
       ↓
[Backend: Validate User]
       │
       ↓
[Check Duplicate Attendance]
       │
       ↓
[Create Attendance Record]
       │
       ↓
[Save to MongoDB]
       │
       ↓
[Response with Attendance Data]
       │
       ↓
[Frontend: Show Success Toast]
       │
       ↓
[Update Attendance Table]
```

### 3. Report Generation Flow

```
Admin Applies Filters
       │
       ↓
[Frontend: Reports Page]
       │
       ↓ GET /api/attendance/report?startDate=...&endDate=...
       │
       ↓
[Backend: Attendance Route]
       │
       ↓
[Attendance Controller]
       │
       ↓
[Build MongoDB Query]
  - Date range filter
  - Department filter
  - Status filter
       │
       ↓
[Execute Query with Populate]
       │
       ↓
[Return Attendance Records]
       │
       ↓
[Frontend: Display in Table]
       │
       ↓
Admin Clicks Export CSV
       │
       ↓ GET /api/attendance/export/csv
       │
       ↓
[Backend: Generate CSV]
  - Parse data
  - Convert to CSV format
  - Set headers
       │
       ↓
[Download CSV File]
```

## 🗂️ Component Architecture

### Frontend Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Login (Public Route)
│       │   ├── Input Components
│       │   └── Button Component
│       │
│       └── Layout (Protected Route)
│           ├── Sidebar
│           │   ├── Navigation Links
│           │   └── User Profile
│           │
│           ├── Navbar
│           │   ├── Search Bar
│           │   └── Notifications
│           │
│           └── Page Content
│               ├── Dashboard (Admin/User)
│               │   ├── Stats Cards
│               │   ├── Charts (Recharts)
│               │   └── Recent Activity
│               │
│               ├── Users (Admin Only)
│               │   ├── User Table
│               │   ├── Search/Filter
│               │   └── Add/Edit Modal
│               │
│               ├── Attendance (Admin Only)
│               │   ├── Camera Modal
│               │   ├── Webcam Component
│               │   └── Attendance Table
│               │
│               ├── Reports (Admin Only)
│               │   ├── Filter Form
│               │   ├── Report Table
│               │   └── Export Button
│               │
│               ├── MyAttendance (User)
│               │   ├── Stats Cards
│               │   ├── Attendance Chart
│               │   └── History Table
│               │
│               ├── Profile (User)
│               │   ├── Profile Info
│               │   └── Password Form
│               │
│               └── Settings (Admin Only)
│                   └── Settings Cards
│
└── Toaster (Notifications)
```

## 🔐 Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────┐
│           Security Layers                    │
├─────────────────────────────────────────────┤
│                                              │
│  1. Frontend Route Protection                │
│     - ProtectedRoute Component               │
│     - Role-based rendering                   │
│     - Token validation                       │
│                                              │
│  2. API Authentication Middleware            │
│     - JWT token verification                 │
│     - User lookup                            │
│     - Token expiration check                 │
│                                              │
│  3. Role-based Authorization                 │
│     - Admin-only endpoints                   │
│     - User-specific data access              │
│     - Permission validation                  │
│                                              │
│  4. Data Validation                          │
│     - Input sanitization                     │
│     - Schema validation (Mongoose)           │
│     - File upload restrictions               │
│                                              │
│  5. Password Security                        │
│     - Bcrypt hashing (10 rounds)             │
│     - Password strength requirements         │
│     - Secure password update                 │
│                                              │
└─────────────────────────────────────────────┘
```

### JWT Token Flow

```
Login Success
     │
     ↓
Generate JWT Token
  - Payload: { id: user._id }
  - Secret: JWT_SECRET
  - Expiry: 7 days
     │
     ↓
Send to Frontend
     │
     ↓
Store in localStorage
     │
     ↓
Include in API Requests
  Authorization: Bearer <token>
     │
     ↓
Backend Middleware Verifies
     │
     ↓
Attach User to Request
  req.user = decodedUser
     │
     ↓
Controller Access User Data
```

## 💾 Database Design

### Entity Relationship Diagram

```
┌─────────────────────┐
│       Users         │
├─────────────────────┤
│ _id (PK)            │
│ name                │
│ email (unique)      │
│ password (hashed)   │
│ role                │
│ imageUrl            │
│ imagePublicId       │
│ faceData []         │
│ department          │
│ employeeId (unique) │
│ isActive            │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘
          │
          │ 1:N
          ↓
┌─────────────────────┐
│    Attendance       │
├─────────────────────┤
│ _id (PK)            │
│ userId (FK) ────────┼──→ Users._id
│ date                │
│ status              │
│ markedBy (FK) ──────┼──→ Users._id (Admin)
│ checkInTime         │
│ checkOutTime        │
│ method              │
│ confidence          │
│ notes               │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘

Indexes:
- Users: email (unique), employeeId (unique)
- Attendance: userId + date (compound, unique)
- Attendance: date (descending)
```

### Data Access Patterns

```
Common Queries:

1. User Login
   db.users.findOne({ email: "..." }).select('+password')

2. Get Today's Attendance
   db.attendance.find({
     date: { $gte: startOfDay }
   }).populate('userId markedBy')

3. Get User Attendance History
   db.attendance.find({
     userId: "...",
     date: { $gte: startDate, $lte: endDate }
   }).sort({ date: -1 })

4. Get Attendance Report
   db.attendance.find({
     date: { $gte: startDate, $lte: endDate },
     'userId.department': "..."
   }).populate('userId')

5. Get Statistics
   db.attendance.aggregate([
     { $match: { date: { $gte: startDate } } },
     { $group: {
         _id: '$date',
         present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } }
       }
     }
   ])
```

## 🔌 API Architecture

### RESTful API Design

```
Resource-Based URLs:

Authentication:
POST   /api/auth/login           - Login user
POST   /api/auth/register        - Register user (Admin)
GET    /api/auth/me              - Get current user
PUT    /api/auth/update-password - Update password

Users:
GET    /api/users                - List all users
GET    /api/users/:id            - Get user by ID
POST   /api/users                - Create user (via register)
PUT    /api/users/:id            - Update user
DELETE /api/users/:id            - Delete user
GET    /api/users/stats          - Get user statistics

Attendance:
GET    /api/attendance/history/:userId  - Get user history
GET    /api/attendance/report           - Get filtered report
GET    /api/attendance/today            - Get today's records
POST   /api/attendance/mark             - Mark attendance
POST   /api/attendance/recognize        - Face recognition
GET    /api/attendance/export/csv       - Export CSV
GET    /api/attendance/stats            - Get statistics
```

### Middleware Stack

```
Request
   │
   ↓
[CORS Middleware]
   │
   ↓
[Body Parser]
   │
   ↓
[Route Handler]
   │
   ↓
[Auth Middleware] (if protected)
   │
   ↓
[Role Authorization] (if admin-only)
   │
   ↓
[Controller Logic]
   │
   ↓
[Response]
   │
   ↓
[Error Handler] (if error)
```

## 🎨 Frontend State Management

### Context Architecture

```
AuthContext
├── State
│   ├── user (object)
│   ├── loading (boolean)
│   └── isAuthenticated (boolean)
│
├── Actions
│   ├── login(email, password)
│   ├── logout()
│   └── updateUser(userData)
│
└── Computed
    ├── isAdmin (user.role === 'admin')
    └── userId (user.id)

Usage in Components:
const { user, login, logout, isAdmin } = useAuth()
```

### Data Flow Pattern

```
User Action
   │
   ↓
Component Event Handler
   │
   ↓
API Call (axios)
   │
   ↓
Update Local State (useState)
   │
   ↓
Update Context (if needed)
   │
   ↓
Re-render Components
   │
   ↓
Show Toast Notification
```

## 🤖 AI Service Integration

### Face Recognition Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│  ┌────────────────────────────────┐     │
│  │     React Webcam Component     │     │
│  │  - Capture image               │     │
│  │  - Convert to Base64           │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
                  │
                  ↓ POST /api/attendance/recognize
┌─────────────────────────────────────────┐
│      Backend (Node.js/Express)          │
│  ┌────────────────────────────────┐     │
│  │   Attendance Controller        │     │
│  │  - Receive Base64 image        │     │
│  │  - Forward to AI service       │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
                  │
                  ↓ POST to AI_SERVICE_URL
┌─────────────────────────────────────────┐
│      AI Service (Python)                 │
│  ┌────────────────────────────────┐     │
│  │   Face Recognition Pipeline    │     │
│  │  1. Decode Base64 image        │     │
│  │  2. Detect faces (OpenCV)      │     │
│  │  3. Extract face encodings     │     │
│  │  4. Compare with database      │     │
│  │  5. Calculate confidence       │     │
│  │  6. Return user ID             │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
                  │
                  ↓ { userId, confidence }
┌─────────────────────────────────────────┐
│      Backend (Node.js/Express)          │
│  ┌────────────────────────────────┐     │
│  │   Create Attendance Record     │     │
│  │  - Validate user               │     │
│  │  - Check duplicates            │     │
│  │  - Save to MongoDB             │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
                  │
                  ↓ Success response
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│  - Show success toast                    │
│  - Update attendance table               │
│  - Close camera modal                    │
└─────────────────────────────────────────┘
```

## 📊 Performance Optimization

### Backend Optimizations

```
1. Database Indexing
   - email (unique index)
   - employeeId (unique index)
   - userId + date (compound index)
   - date (descending index)

2. Query Optimization
   - Use .select() to limit fields
   - Use .populate() efficiently
   - Implement pagination
   - Use lean() for read-only queries

3. Caching Strategy (Future)
   - Redis for session storage
   - Cache frequently accessed data
   - Invalidate on updates

4. Response Compression
   - Gzip compression
   - Minify JSON responses
```

### Frontend Optimizations

```
1. Code Splitting
   - Route-based splitting
   - Lazy loading components
   - Dynamic imports

2. Asset Optimization
   - Image optimization (Cloudinary)
   - Tree shaking (Vite)
   - Minification
   - Bundle analysis

3. Rendering Optimization
   - React.memo for expensive components
   - useMemo for computed values
   - useCallback for functions
   - Virtual scrolling for large lists

4. Network Optimization
   - API request debouncing
   - Request cancellation
   - Optimistic UI updates
```

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────┐
│              CDN (CloudFront)                │
│         Static Assets + Frontend             │
└─────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────┐
│           Load Balancer (Nginx)              │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
┌──────────────┐          ┌──────────────┐
│  Backend     │          │  Backend     │
│  Instance 1  │          │  Instance 2  │
│  (PM2)       │          │  (PM2)       │
└──────────────┘          └──────────────┘
        │                         │
        └────────────┬────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│         MongoDB Atlas (Replica Set)          │
└─────────────────────────────────────────────┘
```

## 🔄 CI/CD Pipeline

```
Developer Push to GitHub
         │
         ↓
GitHub Actions Triggered
         │
         ├─→ Run Tests
         ├─→ Run Linter
         ├─→ Build Frontend
         ├─→ Build Backend
         │
         ↓
All Checks Pass?
         │
         ↓ Yes
Deploy to Production
         │
         ├─→ Deploy Frontend (Vercel)
         ├─→ Deploy Backend (Heroku/AWS)
         └─→ Update Database (Migrations)
         │
         ↓
Send Deployment Notification
```

---

## 📚 Design Patterns Used

1. **MVC Pattern** - Model-View-Controller separation
2. **Repository Pattern** - Data access abstraction
3. **Middleware Pattern** - Request processing pipeline
4. **Context Pattern** - State management (React)
5. **HOC Pattern** - Protected routes
6. **Compound Components** - Card, Table components
7. **Factory Pattern** - API instance creation
8. **Observer Pattern** - Event handling

---

## 🎯 Scalability Considerations

1. **Horizontal Scaling** - Stateless backend design
2. **Database Sharding** - User-based partitioning
3. **Caching Layer** - Redis integration ready
4. **Microservices** - AI service separation
5. **Load Balancing** - Nginx configuration
6. **CDN Integration** - Static asset delivery
7. **Message Queue** - Background job processing (future)

---

**This architecture ensures high performance, security, and scalability! 🚀**
