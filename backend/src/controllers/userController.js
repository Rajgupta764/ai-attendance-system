import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role, department, search } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Users can update their own profile, Admins can update any)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, department, employeeId, isActive } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Security check: Users can only update their own profile, unless they're admin
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user.id === req.params.id;

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    // Handle image upload
    console.log('📸 Update - File received:', req.file ? 'Yes' : 'No');
    if (req.file) {
      try {
        console.log('📁 File details:', {
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype
        });
        
        // Delete old image from cloudinary
        if (user.imagePublicId) {
          console.log('🗑️ Deleting old image:', user.imagePublicId);
          await deleteFromCloudinary(user.imagePublicId);
        }

        console.log('☁️ Uploading new image to Cloudinary...');
        const result = await uploadToCloudinary(req.file);
        user.imageUrl = result.url;
        user.imagePublicId = result.publicId;
        console.log('✅ New image uploaded! URL:', result.url);
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError.message);
        // Continue without updating image
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Only admins can change role and isActive status
    if (isAdmin) {
      if (role) user.role = role;
      if (typeof isActive !== 'undefined') user.isActive = isActive;
    }
    
    if (department) user.department = department;
    if (employeeId) user.employeeId = employeeId;

    await user.save();

    console.log('📤 Sending updated user with imageUrl:', user.imageUrl);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete image from cloudinary
    if (user.imagePublicId) {
      await deleteFromCloudinary(user.imagePublicId);
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const departmentStats = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalAdmins,
        departmentStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
