import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Hash, Lock, Save, Camera } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.put(`/users/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Profile image updated successfully');
        // Update user context with new image
        updateUser(data.data.user);
        setImageFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600 mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-slate-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center border-4 border-slate-100">
                      <User className="w-16 h-16 text-primary-600" />
                    </div>
                  )}
                  
                  {/* Camera Button Overlay */}
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full cursor-pointer shadow-lg transition-all hover:scale-110"
                  >
                    <Camera className="w-5 h-5" />
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{user?.name}</h2>
                <p className="text-slate-500 mb-2">{user?.email}</p>
                <p className="text-xs text-slate-400 mb-4">Click camera icon to change photo</p>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    user?.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <User className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="font-medium text-slate-900">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Hash className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-xs text-slate-500">Employee ID</p>
                    <p className="font-medium text-slate-900">{user?.employeeId || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-xs text-slate-500">Department</p>
                    <p className="font-medium text-slate-900">{user?.department || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Update Profile Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Update Profile Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-xl">
              <p className="text-sm text-slate-600 mb-4">
                Upload a clear photo of your face for better attendance recognition. Recommended: Front-facing photo with good lighting.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Current"
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <label
                    htmlFor="profile-image-input"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    {uploadingImage ? 'Uploading...' : 'Choose New Photo'}
                  </label>
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
              />

              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
              />

              <Button type="submit" loading={loading}>
                <Save className="w-5 h-5" />
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
