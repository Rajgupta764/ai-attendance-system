import express from 'express';
import {
  register,
  login,
  getMe,
  updatePassword,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Protected routes - only admin can register users
router.post('/register', protect, authorize('admin'), upload.single('image'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

export default router;
