import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  UserCircle,
  ScanFace,
  UserX,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/register-faces', icon: ScanFace, label: 'Register Faces' },
    { to: '/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/absent-users', icon: UserX, label: 'Absent Users' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/my-attendance', icon: Calendar, label: 'My Attendance' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <AnimatePresence>
      {(isOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
        <motion.div
          initial={typeof window !== 'undefined' && window.innerWidth < 1024 ? { x: -300 } : false}
          animate={{ x: 0 }}
          exit={typeof window !== 'undefined' && window.innerWidth < 1024 ? { x: -300 } : false}
          transition={{
            type: typeof window !== 'undefined' && window.innerWidth < 1024 ? 'tween' : 'none',
            duration: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0.3 : 0
          }}
          className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] fixed left-0 top-16 flex flex-col z-50 lg:h-screen lg:top-0"
        >
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  AI Attendance
                </h1>
                <p className="text-xs text-slate-500 mt-1">Face Recognition System</p>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
