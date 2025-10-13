import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on desktop when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Always visible on desktop, conditional on mobile */}
      <Sidebar isOpen={sidebarOpen || window.innerWidth >= 1024} onClose={() => setSidebarOpen(false)} />

      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay - only show on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
