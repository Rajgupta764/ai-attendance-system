import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Leave'],
      default: 'Present',
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
    },
    method: {
      type: String,
      enum: ['face-recognition', 'manual'],
      default: 'face-recognition',
    },
    confidence: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one attendance per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for faster queries
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ userId: 1, date: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
