import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import axios from 'axios';
import { Parser } from 'json2csv';

// @desc    Mark attendance (Face Recognition)
// @route   POST /api/attendance/mark
// @access  Private/Admin
export const markAttendance = async (req, res) => {
  try {
    const { userId, status, method, confidence, notes } = req.body;

    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({ userId, date: { $gte: today } });
    if (existingAttendance)
      return res.status(400).json({ success: false, message: 'Attendance already marked for today', data: existingAttendance });

    const attendance = await Attendance.create({
      userId,
      markedBy: req.user._id,
      date: new Date(),
      status: status || 'Present',
      method: method || 'face-recognition',
      confidence: confidence || 0,
      notes: notes || '',
    });

    const populatedAttendance = await Attendance.findById(attendance._id).populate('markedBy', 'name email');

    res.status(201).json({ success: true, message: `Attendance marked successfully for ${user.name}`, data: { attendance: populatedAttendance } });
  } catch (error) {
    console.error('Error in markAttendance:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Recognize face and mark attendance
// @route   POST /api/attendance/recognize
// @access  Private/Admin
export const recognizeAndMark = async (req, res) => {
  try {
    const { imageData } = req.body;
    if (!imageData) return res.status(400).json({ success: false, message: 'Image data is required' });

    if (process.env.AI_SERVICE_ENABLED !== 'true') {
      return res.status(503).json({ success: false, message: 'AI service is not enabled' });
    }

    try {
      const aiResponse = await axios.post(process.env.AI_SERVICE_URL, { image: imageData }, { timeout: 10000 });
      const { userId, confidence } = aiResponse.data;

      if (!userId) return res.status(404).json({ success: false, message: 'Face not recognized' });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found in database' });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAttendance = await Attendance.findOne({ userId, date: { $gte: today } });
      if (existingAttendance) return res.status(400).json({ success: false, message: 'Attendance already marked for today' });

      const attendance = new Attendance({
        userId,
        checkInTime: new Date(),
        status: 'Present',
        method: 'face_recognition',
        markedBy: req.user._id,
      });

      await attendance.save();

      const populatedAttendance = await Attendance.findById(attendance._id)
        .populate('userId', 'name email imageUrl employeeId department')
        .populate('markedBy', 'name email');

      res.status(201).json({ success: true, message: `Attendance marked for ${user.name} (Confidence: ${confidence}%)`, data: { attendance: populatedAttendance } });
    } catch (aiError) {
      console.error('AI Service Error:', aiError.message);
      return res.status(503).json({ success: false, message: 'AI service unavailable. Please try again later.' });
    }
  } catch (error) {
    console.error('Error in recognizeAndMark:', error);
    res.status(500).json({ success: false, message: 'Failed to process attendance', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Get attendance history
// @route   GET /api/attendance/history/:userId
// @access  Private
export const getAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, status } = req.query;

    let query = { userId };
    if (startDate || endDate) query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
    if (status) query.status = status;

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email imageUrl employeeId department')
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const absentDays = attendance.filter(a => a.status === 'Absent').length;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({ success: true, count: attendance.length, data: { attendance, stats: { totalDays, presentDays, absentDays, percentage } } });
  } catch (error) {
    console.error('Error in getAttendanceHistory:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance history', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Get attendance report
// @route   GET /api/attendance/report
// @access  Private/Admin
export const getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, department, status } = req.query;
    let query = {};
    if (startDate || endDate) query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
    if (status) query.status = status;

    let attendance = await Attendance.find(query)
      .populate('userId', 'name email imageUrl employeeId department')
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    if (department) attendance = attendance.filter(a => a.userId?.department === department);

    res.status(200).json({ success: true, count: attendance.length, data: { attendance } });
  } catch (error) {
    console.error('Error in getAttendanceReport:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance report', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private/Admin
export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ $or: [{ date: { $gte: today } }, { checkInTime: { $gte: today } }], status: 'Present' })
      .populate('userId', 'name email imageUrl employeeId department')
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    const totalUsers = await User.countDocuments({ role: 'user', isActive: true });
    const presentToday = attendance.length;
    const absentToday = totalUsers - presentToday;
    const percentage = totalUsers > 0 ? ((presentToday / totalUsers) * 100).toFixed(2) : 0;

    res.status(200).json({ success: true, data: { attendance, stats: { totalUsers, presentToday, absentToday, percentage } } });
  } catch (error) {
    console.error('Error in getTodayAttendance:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch today\'s attendance', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Get logged-in user's attendance for today
// @route   GET /api/attendance/my-today
// @access  Private
export const getMyTodayAttendance = async (req, res) => {
  try {
    console.log('Request user:', req.user); // Debug log
    
    if (!req.user || !req.user._id) {
      console.error('User not authenticated or user ID missing');
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Fetching attendance for user:', req.user._id, 'on:', today);
    
    const attendance = await Attendance.findOne({ 
      userId: req.user._id, 
      date: { $gte: today } 
    }).populate('markedBy', 'name email');

    console.log('Found attendance:', attendance);

    if (!attendance) {
      return res.status(200).json({ 
        success: true, 
        data: { present: false },
        message: 'No attendance recorded for today' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        ...attendance.toObject(),
        present: true
      } 
    });
  } catch (error) {
    console.error('Error in getMyTodayAttendance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// @desc    Export attendance to CSV
// @route   GET /api/attendance/export/csv
// @access  Private/Admin
export const exportToCSV = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    if (startDate || endDate) query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);

    const attendance = await Attendance.find(query).populate('userId', 'name email employeeId department').sort({ date: -1 });

    const data = attendance.map(record => ({
      Date: new Date(record.date).toLocaleDateString(),
      'Employee ID': record.userId?.employeeId || 'N/A',
      Name: record.userId?.name || 'N/A',
      Email: record.userId?.email || 'N/A',
      Department: record.userId?.department || 'N/A',
      Status: record.status,
      'Check In': new Date(record.checkInTime).toLocaleTimeString(),
      Method: record.method,
      Confidence: record.confidence ? `${record.confidence}%` : 'N/A',
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance-report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error in exportToCSV:', error);
    res.status(500).json({ success: false, message: 'Failed to export attendance', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private/Admin
export const getAttendanceStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ $or: [{ date: { $gte: startDate } }, { checkInTime: { $gte: startDate } }] })
      .populate('userId', 'department');

    const dailyStats = {};
    const departmentStats = {};

    attendance.forEach(record => {
      const dateKey = new Date(record.checkInTime).toLocaleDateString();
      if (!dailyStats[dateKey]) dailyStats[dateKey] = { present: 0, absent: 0, total: 0 };
      dailyStats[dateKey].total++;
      if (record.status === 'Present') dailyStats[dateKey].present++;
      else dailyStats[dateKey].absent++;

      const dept = record.userId?.department || 'Unknown';
      if (!departmentStats[dept]) departmentStats[dept] = { present: 0, total: 0 };
      departmentStats[dept].total++;
      if (record.status === 'Present') departmentStats[dept].present++;
    });

    res.status(200).json({ success: true, data: { dailyStats, departmentStats } });
  } catch (error) {
    console.error('Error in getAttendanceStats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};
