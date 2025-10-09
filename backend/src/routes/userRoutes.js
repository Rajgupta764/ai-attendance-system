import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/stats', protect, authorize('admin'), getUserStats);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, upload.single('image'), updateUser); // Allow users to update their own profile
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
