import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Private/Admin
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, employeeId } = req.body;
    
    // For public signup, always set role to 'user' (ignore role from request body for security)
    const userRole = 'user';

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Handle image upload
    let imageUrl = '';
    let imagePublicId = '';

    console.log('📸 File received:', req.file ? 'Yes' : 'No');
    if (req.file) {
      console.log('📁 File details:', {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
      
      try {
        console.log('☁️ Uploading to Cloudinary...');
        const result = await uploadToCloudinary(req.file);
        imageUrl = result.url;
        imagePublicId = result.publicId;
        console.log('✅ Upload successful! URL:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError.message);
        console.error('Stack:', uploadError.stack);
        // Continue without image - don't fail user creation
      }
    } else {
      console.log('⚠️ No file in request');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole, // Always 'user' for public signup
      department,
      employeeId,
      imageUrl,
      imagePublicId,
    });

    const responseData = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          imageUrl: user.imageUrl,
          department: user.department,
          employeeId: user.employeeId,
        },
      },
    };
    
    console.log('📤 Sending response with imageUrl:', user.imageUrl);
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          imageUrl: user.imageUrl,
          department: user.department,
          employeeId: user.employeeId,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
