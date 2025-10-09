# 📡 API Documentation

Complete API reference for the AI Attendance System backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔐 Authentication Endpoints

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@attendance.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Admin User",
      "email": "admin@attendance.com",
      "role": "admin",
      "imageUrl": "https://cloudinary.com/...",
      "department": "Administration",
      "employeeId": "ADM001"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing credentials
- `401` - Invalid credentials

---

### Register User

**POST** `/auth/register`

Create a new user account (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: John Doe
email: john@example.com
password: password123
role: user
department: Engineering
employeeId: ENG001
image: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "imageUrl": "https://cloudinary.com/...",
      "department": "Engineering",
      "employeeId": "ENG001"
    }
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - User already exists
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Admin User",
      "email": "admin@attendance.com",
      "role": "admin",
      "imageUrl": "https://cloudinary.com/...",
      "department": "Administration",
      "employeeId": "ADM001"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Update Password

**PUT** `/auth/update-password`

Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing fields
- `401` - Current password incorrect

---

## 👥 User Management Endpoints

### Get All Users

**GET** `/users`

Retrieve all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `role` (optional) - Filter by role (admin/user)
- `department` (optional) - Filter by department
- `search` (optional) - Search by name, email, or employee ID

**Example:**
```
GET /users?role=user&department=Engineering&search=john
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": {
    "users": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "imageUrl": "https://cloudinary.com/...",
        "department": "Engineering",
        "employeeId": "ENG001",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

### Get User by ID

**GET** `/users/:id`

Get specific user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "imageUrl": "https://cloudinary.com/...",
      "department": "Engineering",
      "employeeId": "ENG001",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - User not found
- `401` - Unauthorized

---

### Update User

**PUT** `/users/:id`

Update user information (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: John Updated
email: john.updated@example.com
role: user
department: Engineering
employeeId: ENG001
isActive: true
image: <file> (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "John Updated",
      "email": "john.updated@example.com",
      "role": "user",
      "imageUrl": "https://cloudinary.com/...",
      "department": "Engineering",
      "employeeId": "ENG001",
      "isActive": true
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

---

### Delete User

**DELETE** `/users/:id`

Delete a user (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

---

### Get User Statistics

**GET** `/users/stats`

Get user statistics (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 50,
    "activeUsers": 48,
    "totalAdmins": 2,
    "departmentStats": [
      {
        "_id": "Engineering",
        "count": 25
      },
      {
        "_id": "HR",
        "count": 10
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

---

## 📅 Attendance Endpoints

### Mark Attendance (Manual)

**POST** `/attendance/mark`

Manually mark attendance (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "userId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "status": "Present",
  "method": "manual",
  "notes": "Late arrival"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully for John Doe",
  "data": {
    "attendance": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "userId": {
        "id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "name": "John Doe",
        "email": "john@example.com",
        "imageUrl": "https://cloudinary.com/...",
        "employeeId": "ENG001",
        "department": "Engineering"
      },
      "date": "2024-01-15T00:00:00.000Z",
      "status": "Present",
      "markedBy": {
        "id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Admin User",
        "email": "admin@attendance.com"
      },
      "checkInTime": "2024-01-15T09:30:00.000Z",
      "method": "manual",
      "confidence": 0,
      "notes": "Late arrival"
    }
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Attendance already marked or missing userId
- `404` - User not found
- `401` - Unauthorized
- `403` - Forbidden

---

### Mark Attendance (Face Recognition)

**POST** `/attendance/recognize`

Mark attendance using face recognition (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked for John Doe (Confidence: 95.5%)",
  "data": {
    "attendance": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "userId": {
        "id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "name": "John Doe",
        "email": "john@example.com",
        "imageUrl": "https://cloudinary.com/...",
        "employeeId": "ENG001",
        "department": "Engineering"
      },
      "date": "2024-01-15T00:00:00.000Z",
      "status": "Present",
      "markedBy": {
        "id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Admin User"
      },
      "checkInTime": "2024-01-15T09:30:00.000Z",
      "method": "face-recognition",
      "confidence": 95.5
    }
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Missing image data or already marked
- `404` - Face not recognized
- `503` - AI service unavailable
- `401` - Unauthorized
- `403` - Forbidden

---

### Get Attendance History

**GET** `/attendance/history/:userId`

Get attendance history for a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional) - Filter from date (YYYY-MM-DD)
- `endDate` (optional) - Filter to date (YYYY-MM-DD)
- `status` (optional) - Filter by status (Present/Absent/Late/Leave)

**Example:**
```
GET /attendance/history/65f1a2b3c4d5e6f7g8h9i0j2?startDate=2024-01-01&endDate=2024-01-31&status=Present
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": {
    "attendance": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j3",
        "userId": {
          "id": "65f1a2b3c4d5e6f7g8h9i0j2",
          "name": "John Doe",
          "email": "john@example.com",
          "imageUrl": "https://cloudinary.com/...",
          "employeeId": "ENG001",
          "department": "Engineering"
        },
        "date": "2024-01-15T00:00:00.000Z",
        "status": "Present",
        "checkInTime": "2024-01-15T09:30:00.000Z",
        "method": "face-recognition",
        "confidence": 95.5
      }
    ],
    "stats": {
      "totalDays": 20,
      "presentDays": 18,
      "absentDays": 2,
      "percentage": "90.00"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Get Attendance Report

**GET** `/attendance/report`

Get attendance report with filters (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `startDate` (optional) - Filter from date
- `endDate` (optional) - Filter to date
- `department` (optional) - Filter by department
- `status` (optional) - Filter by status

**Example:**
```
GET /attendance/report?startDate=2024-01-01&endDate=2024-01-31&department=Engineering
```

**Response:**
```json
{
  "success": true,
  "count": 150,
  "data": {
    "attendance": [
      // Array of attendance records
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

---

### Get Today's Attendance

**GET** `/attendance/today`

Get today's attendance records (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": [
      // Array of today's attendance records
    ],
    "stats": {
      "totalUsers": 50,
      "presentToday": 45,
      "absentToday": 5,
      "percentage": "90.00"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

---

### Export Attendance to CSV

**GET** `/attendance/export/csv`

Export attendance report as CSV (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `startDate` (optional) - Filter from date
- `endDate` (optional) - Filter to date

**Example:**
```
GET /attendance/export/csv?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
CSV file download with headers:
```
Date,Employee ID,Name,Email,Department,Status,Check In,Method,Confidence
```

**Status Codes:**
- `200` - Success (CSV file)
- `401` - Unauthorized
- `403` - Forbidden

---

### Get Attendance Statistics

**GET** `/attendance/stats`

Get attendance statistics (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `days` (optional) - Number of days to analyze (default: 7)

**Example:**
```
GET /attendance/stats?days=30
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dailyStats": {
      "2024-01-15": {
        "present": 45,
        "absent": 5,
        "total": 50
      }
    },
    "departmentStats": {
      "Engineering": {
        "present": 20,
        "total": 25
      },
      "HR": {
        "present": 9,
        "total": 10
      }
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden

---

## 🏥 Health Check

### API Health

**GET** `/health`

Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "AI Attendance System API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Success

---

## 🔒 Authorization Levels

### Public Endpoints
- `POST /auth/login`
- `GET /health`

### Authenticated Endpoints
- `GET /auth/me`
- `PUT /auth/update-password`
- `GET /users/:id` (own profile)
- `GET /attendance/history/:userId` (own history)

### Admin Only Endpoints
- `POST /auth/register`
- `GET /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /users/stats`
- `POST /attendance/mark`
- `POST /attendance/recognize`
- `GET /attendance/report`
- `GET /attendance/today`
- `GET /attendance/export/csv`
- `GET /attendance/stats`

---

## 📊 Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - External service down |

---

## 🔑 Error Codes

| Code | Description |
|------|-------------|
| `AUTH_001` | Invalid credentials |
| `AUTH_002` | Token expired |
| `AUTH_003` | Invalid token |
| `USER_001` | User not found |
| `USER_002` | User already exists |
| `ATT_001` | Attendance already marked |
| `ATT_002` | Face not recognized |
| `AI_001` | AI service unavailable |

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. File uploads use `multipart/form-data`
3. Maximum file size: 5MB
4. Supported image formats: JPEG, PNG, GIF
5. JWT tokens expire after 7 days (configurable)
6. Rate limiting: 100 requests per 15 minutes per IP

---

## 🔗 Postman Collection

Import the Postman collection for easy API testing:

```json
{
  "info": {
    "name": "AI Attendance System API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    // Collection items
  ]
}
```

---

**For support, contact: api-support@attendance.com**
