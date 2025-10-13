import { createContext, useContext, useState } from 'react';

// Create a context for layout state
const LayoutContext = createContext();

// Custom hook to use layout context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// Layout provider component
export const LayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <LayoutContext.Provider value={{
      sidebarOpen,
      toggleSidebar,
      openSidebar,
      closeSidebar
    }}>
      {children}
    </LayoutContext.Provider>
  );
};
