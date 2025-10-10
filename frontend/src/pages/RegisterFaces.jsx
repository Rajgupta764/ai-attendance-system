import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, X, UserCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import axios from 'axios';

const RegisterFaces = () => {
  const [users, setUsers] = useState([]);
  const [registeredFaces, setRegisteredFaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    fetchRegisteredFaces();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setUsers(data.data.users.filter(u => u.role === 'user'));
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredFaces = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/registered-faces');
      if (response.data.success) {
        setRegisteredFaces(response.data.registeredUsers);
      }
    } catch (error) {
      console.error('Failed to fetch registered faces:', error);
      // Fallback to empty array if AI service is not available
      setRegisteredFaces([]);
    }
  };
  const openCamera = (user) => {
    setSelectedUser(user);
    setIsCameraOpen(true);
  };

  const handleRegisterFace = async () => {
    if (!selectedUser) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      toast.error('Failed to capture image');
      return;
    }

    try {
      // Simulate face registration
      setRegisteredFaces(prev => [...prev, selectedUser._id]);
      toast.success('Face registration simulation successful');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to register face');
    } finally {
      setCapturing(false);
    }
  };

  const isRegistered = (userId) => {
    return registeredFaces.includes(userId);
  };

  const captureAndRegister = async () => {
    if (!selectedUser) return;

    setCapturing(true);
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      toast.error('Failed to capture image');
      setCapturing(false);
      return;
    }

    try {
      // Call AI service to register face
      const response = await axios.post('http://localhost:8000/api/register-face', {
        userId: selectedUser._id,
        image: imageSrc,
      });

      if (response.data.success) {
        setRegisteredFaces(prev => [...prev, selectedUser._id]);
        toast.success(`Face registered successfully for ${selectedUser.name}`);
        setCapturing(false);
        setIsCameraOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Failed to register face');
      setCapturing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Register Faces</h1>
        <p className="text-slate-600 mt-1">Register user faces for AI recognition</p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="p-4">
          <p className="text-blue-900">
            <strong>📸 How it works:</strong> Click "Register Face" for each user to capture their photo. 
            Once registered, the AI can recognize them during attendance marking.
          </p>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <UserCircle className="w-12 h-12 text-primary-600" />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {user.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-1">{user.email}</p>
                  <p className="text-xs text-slate-400 mb-4">
                    {user.employeeId || 'No ID'} • {user.department || 'No Dept'}
                  </p>

                  {isRegistered(user._id) ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Face Registered</span>
                    </div>
                  ) : (
                    <Button onClick={() => openCamera(user)} size="sm">
                      <Camera className="w-4 h-4" />
                      Register Face
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">No users found. Please add users first.</p>
          </CardContent>
        </Card>
      )}

      {/* Camera Modal */}
      <Modal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        title={`Register Face - ${selectedUser?.name}`}
      >
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: 'user',
              }}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={captureAndRegister} className="flex-1" loading={capturing}>
              <CheckCircle className="w-5 h-5" />
              Capture & Register
            </Button>
            <Button variant="secondary" onClick={() => setIsCameraOpen(false)}>
              <X className="w-5 h-5" />
              Cancel
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Instructions:</strong> Position the user's face clearly in the camera frame and click "Capture & Register".
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterFaces;
