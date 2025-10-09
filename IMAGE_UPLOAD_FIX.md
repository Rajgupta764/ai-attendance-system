# 🖼️ Image Upload Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: Cloudinary Credentials Not Set

**Symptoms:**
- Images don't upload
- Error: "Cloudinary is not configured"
- Backend logs show warning about missing credentials

**Solution:**
Check your `backend/.env` file has these variables:

```env
CLOUDINARY_CLOUD_NAME=dzgeezrsd
CLOUDINARY_API_KEY=257341911488758
CLOUDINARY_API_SECRET=JSvCrVbwzgYYfwAxPHjDQJA8kKc
```

### Issue 2: Uploads Directory Missing

**Symptoms:**
- Error: "ENOENT: no such file or directory"
- Multer fails to save temporary files

**Solution:**
The backend automatically creates the `uploads/` directory on startup. If it doesn't exist:

```bash
cd backend
mkdir uploads
```

### Issue 3: File Size Too Large

**Symptoms:**
- Upload fails silently
- Error: "File too large"

**Solution:**
Current limit is 5MB. To change it, edit `backend/src/middleware/upload.js`:

```javascript
limits: {
  fileSize: 10 * 1024 * 1024, // Change to 10MB
}
```

### Issue 4: Invalid File Type

**Symptoms:**
- Error: "Only image files are allowed"

**Solution:**
Only these formats are allowed: `jpeg`, `jpg`, `png`, `gif`

Make sure you're uploading a valid image file.

### Issue 5: CORS Error

**Symptoms:**
- Browser console shows CORS error
- Request blocked by browser

**Solution:**
Check `backend/.env` has:

```env
CORS_ORIGIN=http://localhost:5173
```

Or in `backend/src/app.js`, CORS is configured to allow your frontend.

---

## How Image Upload Works

### 1. Frontend (Users.jsx)
```javascript
// User selects image
<input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

// Form submission
const formDataToSend = new FormData();
formDataToSend.append('image', imageFile);

// Send to backend
await api.post('/auth/register', formDataToSend, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### 2. Backend Route
```javascript
// authRoutes.js or userRoutes.js
router.post('/register', upload.single('image'), register);
```

### 3. Multer Middleware
- Receives the file
- Saves temporarily to `uploads/` directory
- Adds file info to `req.file`

### 4. Controller
```javascript
// authController.js
if (req.file) {
  const result = await uploadToCloudinary(req.file);
  imageUrl = result.url;
  imagePublicId = result.publicId;
}
```

### 5. Cloudinary
- Takes file from `uploads/`
- Uploads to Cloudinary cloud
- Returns secure URL
- File is deleted from `uploads/` after upload

---

## Testing Image Upload

### Test 1: Check Cloudinary Configuration

```bash
cd backend
node -e "require('dotenv').config(); console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME); console.log('API Key:', process.env.CLOUDINARY_API_KEY);"
```

Should output your Cloudinary credentials.

### Test 2: Test Upload Manually

1. Start backend: `npm run dev`
2. Check backend logs for Cloudinary warnings
3. Try uploading an image through the UI
4. Watch backend console for upload logs:
   - `📤 Uploading image to Cloudinary: ...`
   - `✅ Image uploaded successfully: ...`

### Test 3: Verify Cloudinary Dashboard

1. Go to https://cloudinary.com/console
2. Login with your account
3. Check "Media Library"
4. Look for `attendance-users/` folder
5. Uploaded images should appear there

---

## Current Configuration Status

✅ **Frontend:** Image upload form is working
✅ **Backend:** Multer middleware configured
✅ **Cloudinary:** Credentials are set in your .env
✅ **Error Handling:** Improved with detailed logging

---

## Debug Checklist

When image upload fails, check:

- [ ] Backend server is running (`npm run dev`)
- [ ] `.env` file has all Cloudinary credentials
- [ ] `uploads/` directory exists in backend folder
- [ ] File size is under 5MB
- [ ] File is a valid image (jpg, png, gif, jpeg)
- [ ] Browser console shows no CORS errors
- [ ] Backend console shows upload attempt logs
- [ ] Cloudinary account is active and has storage space

---

## Environment Variables Template

Create/update `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://smartsonuraj76458_db_user:Rajkumar@cluster0.zklz7ru.mongodb.net/attendance?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=dzgeezrsd
CLOUDINARY_API_KEY=257341911488758
CLOUDINARY_API_SECRET=JSvCrVbwzgYYfwAxPHjDQJA8kKc

# CORS
CORS_ORIGIN=http://localhost:5173

# AI Service
AI_SERVICE_ENABLED=true
AI_SERVICE_URL=http://localhost:8000/api/recognize

# Admin Account
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@attendance.com
ADMIN_PASSWORD=admin123
```

---

## Still Not Working?

### Check Backend Logs

When you try to upload, you should see:

```
📤 Uploading image to Cloudinary: user-photo.jpg
✅ Image uploaded successfully: https://res.cloudinary.com/...
```

If you see errors, they will tell you what's wrong:
- `❌ Cloudinary upload failed: Invalid credentials` → Check API keys
- `❌ Cloudinary upload failed: File too large` → Reduce image size
- `No file provided for upload` → Frontend not sending file correctly

### Check Browser Console

Press F12 in browser and look for:
- Network tab → Find the POST request → Check if file is in FormData
- Console tab → Look for any JavaScript errors

### Verify Cloudinary Credentials

1. Go to https://cloudinary.com/console
2. Click on "Dashboard"
3. Copy the credentials exactly as shown
4. Paste into your `.env` file
5. Restart backend server

---

## Success Indicators

When everything works correctly:

1. **Frontend:** File input shows selected file name
2. **Backend logs:** Shows upload progress and success
3. **Database:** User record has `imageUrl` field populated
4. **Cloudinary:** Image appears in Media Library
5. **UI:** User avatar displays the uploaded image

---

**Last Updated:** October 6, 2025  
**Status:** Image upload system is configured and ready to use
