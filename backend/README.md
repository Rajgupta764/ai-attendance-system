# AI Attendance Backend

Backend server for the AI-powered attendance system with face recognition.

## Quick Start

### Option 1: Using the Start Script (Recommended)
```bash
start.bat
```
This will automatically kill any processes on port 5000 and start the server.

### Option 2: Using npm
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Service Configuration
AI_SERVICE_URL=http://localhost:8000/api/recognize
AI_SERVICE_ENABLED=true

# CORS Origin
CORS_ORIGIN=http://localhost:5173

# Admin Default Credentials
ADMIN_EMAIL=admin@attendance.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=System Admin
```

## Troubleshooting

### Port Already in Use Error

If you see `Error: listen EADDRINUSE: address already in use :::5000`, it means port 5000 is already occupied.

**Solution 1: Use the start.bat script**
```bash
start.bat
```

**Solution 2: Manually kill the process**
```bash
# Find the process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the actual process ID)
taskkill /F /PID <PID>
```

**Solution 3: Kill all Node processes**
```bash
taskkill /F /IM node.exe
```

### Cloudinary Credentials Not Configured

If you see the warning about Cloudinary credentials, make sure:
1. Your `.env` file exists in the backend directory
2. The Cloudinary variables are properly set
3. There are no extra spaces or quotes around the values

### MongoDB Connection Error

Make sure your `MONGODB_URI` is correct and:
- Your MongoDB instance is running (if local)
- Your IP is whitelisted (if using MongoDB Atlas)
- Your credentials are correct

## Architecture

The backend uses:
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── loader.js           # Environment loader
├── start.bat           # Startup script
└── package.json        # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/user/:userId` - Get user's attendance
- `GET /api/attendance/export` - Export attendance data

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Notes

- The server automatically creates a default admin user on first run
- Environment variables are loaded via `loader.js` to ensure proper initialization
- Image uploads are handled by Cloudinary (optional, will skip if not configured)
- The AI service integration is optional and can be disabled via `AI_SERVICE_ENABLED`
