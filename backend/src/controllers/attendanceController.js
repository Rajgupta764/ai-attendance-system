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

    res.status(200).json({ 
      success: true, 
      count: attendance.length, 
      data: { 
        attendance, 
        stats: { totalDays, presentDays, absentDays, percentage } 
      } 
    });
  } catch (error) {
    console.error('Error in getAttendanceHistory:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance history', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
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

    const data = attendance.map(record => {
      // Helper function to format date as YYYY-MM-DD
      const formatDate = (date) => {
        if (!date) return 'N/A';
        // Ensure we have a Date object
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'Invalid Date';
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Helper function to format time as HH:MM:SS
      const formatTime = (date) => {
        if (!date) return 'N/A';
        // Ensure we have a Date object
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'Invalid Time';
        
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      // Format dates for the record
      const recordDate = record.date ? new Date(record.date) : null;
      const checkInDate = record.checkInTime ? new Date(record.checkInTime) : null;

      return {
        'Record Date': recordDate ? formatDate(recordDate) : 'N/A',
        'Record Time': recordDate ? formatTime(recordDate) : 'N/A',
        'Check In Date': checkInDate ? formatDate(checkInDate) : 'N/A',
        'Check In Time': checkInDate ? formatTime(checkInDate) : 'N/A',
        'Employee ID': record.userId?.employeeId || 'N/A',
        'Name': record.userId?.name || 'N/A',
        'Email': record.userId?.email || 'N/A',
        'Department': record.userId?.department || 'N/A',
        'Status': record.status || 'N/A',
        'Method': record.method || 'N/A',
      };
    });

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
// @desc    Get users who haven't marked attendance today
// @route   GET /api/attendance/absent-today
// @access  Private/Admin
export const getAbsentUsers = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all users who haven't marked attendance today
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'attendances',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $gte: ['$date', today] },
                    { $lt: ['$date', new Date(today.getTime() + 24 * 60 * 60 * 1000)] }
                  ]
                }
              }
            }
          ],
          as: 'attendance'
        }
      },
      {
        $match: {
          'attendance.0': { $exists: false } // Users with no attendance record for today
        }
      },
      {
        $project: {
          password: 0,
          __v: 0,
          attendance: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error in getAbsentUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch absent users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mark multiple users as absent
// @route   POST /api/attendance/mark-absent
// @access  Private/Admin
export const markUsersAsAbsent = async (req, res) => {
  try {
    const { userIds, date } = req.body;
    const markDate = date ? new Date(date) : new Date();
    markDate.setHours(0, 0, 0, 0);

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide user IDs to mark as absent' 
      });
    }

    const results = [];
    
    for (const userId of userIds) {
      try {
        // Check if attendance already marked for the day
        const existingAttendance = await Attendance.findOne({
          userId,
          date: {
            $gte: markDate,
            $lt: new Date(markDate.getTime() + 24 * 60 * 60 * 1000)
          }
        });

        if (existingAttendance) {
          existingAttendance.status = 'Absent';
          existingAttendance.markedBy = req.user._id;
          existingAttendance.notes = 'Marked absent by admin';
          await existingAttendance.save();
          results.push({ userId, status: 'updated', attendance: existingAttendance });
        } else {
          const user = await User.findById(userId);
          if (!user) {
            results.push({ userId, status: 'error', message: 'User not found' });
            continue;
          }

          const newAttendance = await Attendance.create({
            userId,
            status: 'Absent',
            markedBy: req.user._id,
            date: markDate,
            method: 'manual',
            notes: 'Marked absent by admin'
          });
          
          results.push({ userId, status: 'created', attendance: newAttendance });
        }
      } catch (error) {
        console.error(`Error marking user ${userId} as absent:`, error);
        results.push({ 
          userId, 
          status: 'error', 
          message: error.message 
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error in markUsersAsAbsent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark users as absent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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

    // Generate dates for the last N days to ensure all dates are included
    const dateMap = {};
    const today = new Date();
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD format
      dateMap[dateStr] = { present: 0, absent: 0, total: 0 };
    }

    attendance.forEach(record => {
      // Use record.date if available, otherwise use checkInTime
      const recordDate = record.date || record.checkInTime;
      const dateKey = new Date(recordDate).toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { present: 0, absent: 0, total: 0 };
      }
      
      dateMap[dateKey].total++;
      if (record.status === 'Present') {
        dateMap[dateKey].present++;
      } else {
        dateMap[dateKey].absent++;
      }

      const dept = record.userId?.department || 'Unknown';
      if (!departmentStats[dept]) departmentStats[dept] = { present: 0, total: 0 };
      departmentStats[dept].total++;
      if (record.status === 'Present') departmentStats[dept].present++;
    });

    // Convert date strings to proper date objects and sort them
    const sortedDailyStats = Object.entries(dateMap)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .reduce((acc, [date, data]) => {
        acc[date] = data;
        return acc;
      }, {});

    res.status(200).json({ 
      success: true, 
      data: { 
        dailyStats: sortedDailyStats, 
        departmentStats 
      } 
    });
  } catch (error) {
    console.error('Error in getAttendanceStats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};
