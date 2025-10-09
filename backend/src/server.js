// Environment variables are loaded in loader.js before this file runs
import app from './app.js';
import connectDB from './config/database.js';
import User from './models/User.js';
import fs from 'fs';
import path from 'path';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'System Admin',
        email: process.env.ADMIN_EMAIL || 'admin@attendance.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        department: 'Administration',
      });
      console.log('✅ Default admin user created');
      console.log(`📧 Email: ${process.env.ADMIN_EMAIL || 'admin@attendance.com'}`);
      console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  createDefaultAdmin();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
