import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    presentToday: 0,
    absentToday: 0,
    percentage: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('Please login again');
          return;
        }

        // Set the token in the headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (isAdmin) {
          // For admin, fetch both today's attendance and stats
          const [todayRes, statsRes] = await Promise.all([
            api.get('/attendance/today').catch(err => {
              console.error('Error fetching today data:', err);
              return { data: { success: false } };
            }),
            api.get('/attendance/stats?days=7').catch(err => {
              console.error('Error fetching stats:', err);
              return { data: { success: false } };
            })
          ]);

          console.log('Today Response:', todayRes?.data);
          console.log('Stats Response:', statsRes?.data);

          if (todayRes?.data?.success) {
            const { totalUsers, presentToday, absentToday, percentage } = todayRes.data.data.stats;
            setStats({
              totalUsers,
              presentToday,
              absentToday,
              percentage: parseFloat(percentage).toFixed(2)
            });
          }

          if (statsRes?.data?.success) {
            const dailyData = Object.entries(statsRes.data.data.dailyStats || {}).map(([date, data]) => ({
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              present: data.present || 0,
              absent: data.absent || 0,
            }));
            setAttendanceData(dailyData.reverse());
          }
        } else {
          // For non-admin users, fetch their own stats
          try {
            console.log('Fetching user attendance for today...');
            const response = await api.get('/attendance/my-today');
            
            console.log('User today response:', response.data);
            
            if (response.data.success) {
              setStats(prev => ({
                ...prev,
                presentToday: response.data.data?.present ? 1 : 0,
                absentToday: response.data.data?.absent ? 1 : 0,
                percentage: response.data.data?.percentage || 0
              }));
            }
          } catch (error) {
            console.error('Error in fetching user today data:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
            
            if (error.response?.status === 401) {
              // Handle unauthorized (token expired/invalid)
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          }
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Absent Today',
      value: stats.absentToday,
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.percentage}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const pieData = [
    { name: 'Present', value: stats.presentToday, color: '#10b981' },
    { name: 'Absent', value: stats.absentToday, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 p-4">
        <div className="bg-red-100 p-4 rounded-lg max-w-md w-full text-center">
          <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to your attendance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
