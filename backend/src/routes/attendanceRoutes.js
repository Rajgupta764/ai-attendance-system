import express from 'express';
import {
  markAttendance,
  recognizeAndMark,
  getAttendanceHistory,
  getAttendanceReport,
  getTodayAttendance,
  exportToCSV,
  getAttendanceStats,
  getMyTodayAttendance,
  getAbsentUsers,
  markUsersAsAbsent
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Mark attendance
router.post('/mark', protect, authorize('admin'), markAttendance);

// Recognize face and mark attendance
router.post('/recognize', protect, authorize('admin'), recognizeAndMark);

// Get attendance history for a user
router.get('/history/:userId', protect, getAttendanceHistory);

// Get attendance report
router.get('/report', protect, authorize('admin'), getAttendanceReport);

// Get today's attendance (admin view)
router.get('/today', protect, authorize('admin'), getTodayAttendance);

// Get current user's attendance for today
router.get('/my-today', protect, (req, res, next) => {
  console.log('User in route handler:', req.user); // Debug log
  next();
}, getMyTodayAttendance);

// Export attendance to CSV
router.get('/export/csv', protect, authorize('admin'), exportToCSV);

// Get attendance statistics
router.get('/stats', protect, authorize('admin'), getAttendanceStats);

// Get users who haven't marked attendance today
router.get('/absent-today', protect, authorize('admin'), getAbsentUsers);

// Mark multiple users as absent
router.post('/mark-absent', protect, authorize('admin'), markUsersAsAbsent);

export default router;
