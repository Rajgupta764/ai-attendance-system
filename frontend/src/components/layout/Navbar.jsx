import { Bell, Search } from 'lucide-react';
import { getGreeting } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-30 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Greeting */}
        <div className="hidden md:block text-right mr-4">
          <p className="text-sm text-slate-500">{getGreeting()},</p>
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
