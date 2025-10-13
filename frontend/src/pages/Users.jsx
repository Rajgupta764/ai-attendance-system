import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, UserCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    department: '',
    employeeId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (imageFile) {
        console.log('📸 Adding image to FormData:', {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        });
        formDataToSend.append('image', imageFile);
      } else {
        console.log('⚠️ No image file selected');
      }
      
      console.log('📤 Sending FormData with keys:', Array.from(formDataToSend.keys()));

      if (editingUser) {
        const { data } = await api.put(`/users/${editingUser._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (data.success) {
          toast.success('User updated successfully');
          fetchUsers();
        }
      } else {
        const { data } = await api.post('/auth/register', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (data.success) {
          toast.success('User created successfully');
          console.log('Created user data:', data.data.user);
          await fetchUsers(); // Wait for users to be fetched
        }
      }

      closeModal();
    } catch (error) {
      console.error('User creation error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { data } = await api.delete(`/users/${userId}`);
      if (data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        department: user.department || '',
        employeeId: user.employeeId || '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        department: '',
        employeeId: '',
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setImageFile(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Users Management</h1>
          <p className="text-slate-600 mt-1">Manage system users and their roles</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add User</span>
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredUsers.map((user) => (
          <Card key={user._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* User Avatar */}
                <div className="relative">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-slate-100"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100 flex items-center justify-center border-4 border-slate-100">
                      <UserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* User Info */}
                <div className="w-full space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-500">{user.email}</p>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Employee ID:</span>
                      <span className="font-medium">{user.employeeId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Department:</span>
                      <span className="font-medium">{user.department || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Role:</span>
                      <span
                        className={`font-medium ${
                          user.role === 'admin'
                            ? 'text-purple-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => openModal(user)}
                    className="flex-1 p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
                    title="Edit User"
                  >
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="flex-1 p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          )}

          <Input
            label="Employee ID"
            type="text"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          />

          <Input
            label="Department"
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {imageFile && (
              <div className="mt-3">
                <p className="text-sm text-slate-600 mb-2">Preview:</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary-200"
                />
              </div>
            )}
            {editingUser && editingUser.imageUrl && !imageFile && (
              <div className="mt-3">
                <p className="text-sm text-slate-600 mb-2">Current Image:</p>
                <img
                  src={editingUser.imageUrl}
                  alt="Current"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" loading={submitting}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
