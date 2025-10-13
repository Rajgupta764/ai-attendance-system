import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { formatTime, getStatusColor } from '@/utils/helpers';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const webcamRef = useRef(null);

  useEffect(() => {
    fetchTodayAttendance();
    fetchUsers();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/today');
      if (data.success) {
        setAttendance(data.data.attendance);
      }
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setUsers(data.data.users.filter(u => u.role === 'user'));
      }
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error('Failed to capture image');
      return;
    }

    setCapturing(true);

    try {
      // Try AI recognition first
      const { data } = await api.post('/attendance/recognize', {
        imageData: imageSrc,
      });

      if (data.success) {
        toast.success(data.message);
        setIsCameraOpen(false);
        fetchTodayAttendance();
      }
    } catch (error) {
      // If AI service is not available, show manual selection
      if (error.response?.status === 503) {
        toast.error('AI service unavailable. Please select user manually.');
        setIsCameraOpen(false);
        // Show manual attendance marking
      } else {
        toast.error(error.response?.data?.message || 'Recognition failed');
      }
    } finally {
      setCapturing(false);
    }
  };

  const markManualAttendance = async (userId) => {
    try {
      const { data } = await api.post('/attendance/mark', {
        userId,
        status: 'Present',
        method: 'manual',
      });

      if (data.success) {
        toast.success(data.message);
        fetchTodayAttendance();
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Attendance Today</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Mark and manage today's attendance</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsCameraOpen(true)} className="w-full sm:w-auto">
            <Camera className="w-5 h-5" />
            <span>Mark Attendance</span>
          </Button>
          <Button variant="outline" onClick={() => setSelectedUser({})}>
            <CalendarIcon className="w-5 h-5" />
            Manual Entry
          </Button>
        </div>
      </div>
      {/* Today's Attendance - Mobile Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {attendance.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No attendance records for today</p>
            </CardContent>
          </Card>
        ) : (
          attendance.map((record) => (
            <Card key={record._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  {record.userId?.imageUrl ? (
                    <img
                      src={record.userId.imageUrl}
                      alt={record.userId.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center border-2 border-slate-200">
                      <span className="text-primary-600 font-semibold">
                        {record.userId?.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{record.userId?.name}</h3>
                    <p className="text-sm text-slate-500 truncate">{record.userId?.email}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Employee ID:</span>
                    <span className="font-medium">{record.userId?.employeeId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Department:</span>
                    <span className="font-medium">{record.userId?.department || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Check In:</span>
                    <span className="font-medium">{formatTime(record.checkInTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className={`font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Method:</span>
                    <span className="font-medium capitalize">{record.method}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Camera Modal */}
      <Modal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} title="Face Recognition">
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-auto"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: 'user',
              }}
            />
            {capturing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button
              onClick={captureImage}
              disabled={capturing}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Camera className="w-5 h-5" />
              {capturing ? 'Processing...' : 'Capture'}
            </Button>
            <Button variant="secondary" onClick={() => setIsCameraOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manual Entry Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Mark Attendance Manually"
      >
        <div className="space-y-4">
          {selectedUser?._id ? (
            <div className="text-center">
              <p className="text-lg font-medium">Mark attendance for:</p>
              <p className="text-2xl font-bold mt-2">{selectedUser.name}</p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Button onClick={() => markManualAttendance(selectedUser._id)} className="w-full sm:w-auto">
                  Mark Present
                </Button>
                <Button variant="secondary" onClick={() => setSelectedUser(null)} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Employee
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onChange={(e) => {
                    const user = users.find((u) => u._id === e.target.value);
                    if (user) setSelectedUser(user);
                  }}
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.employeeId || user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => selectedUser?._id && markManualAttendance(selectedUser._id)}
                  disabled={!selectedUser?._id}
                  className="w-full sm:w-auto"
                >
                  Mark Present
                </Button>
                <Button variant="secondary" onClick={() => setSelectedUser(null)} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Attendance;
