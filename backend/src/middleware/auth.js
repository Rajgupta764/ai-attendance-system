import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers.authorization); // Debug log
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.error('No token provided in headers');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      console.log('Found user:', user ? user._id : 'No user found'); // Debug log

      if (!user) {
        console.error('User not found for token');
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.isActive) {
        console.error('User account is deactivated:', user._id);
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated',
        });
      }

      // Attach user to request
      req.user = user;
      console.log('User attached to request:', { id: user._id, role: user.role });
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
