import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.success && data.data?.token) {
        // Save token and set auth header
        localStorage.setItem('token', data.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
        
        // If user data is included in response, use it
        if (data.data.user) {
          setUser(data.data.user);
          localStorage.setItem('user', JSON.stringify(data.data.user));
        } else {
          // If not, fetch user data
          await loadUser();
        }
        
        toast.success('Logged in successfully');
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Load user data
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Set the token in the headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      const { data } = await api.get('/auth/me');
      if (data.success && data.data?.user) {
        setUser(data.data.user);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        throw new Error('Invalid user data');
      }
    } catch (err) {
      console.error('Error loading user:', err);
      // Clear invalid/expired tokens
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear token and user data
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  // Update user data
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Load user on initial render
  useEffect(() => {
    loadUser();
  }, []);

  // Context value
  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
