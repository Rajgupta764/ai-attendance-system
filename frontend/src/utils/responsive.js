import { useState, useEffect } from 'react';

// Custom hook for responsive design
export const useResponsive = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isDesktop, isTablet, isMobile };
};

// Responsive utility classes
export const responsiveClasses = {
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    single: 'grid grid-cols-1',
    double: 'grid grid-cols-1 lg:grid-cols-2',
    triple: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    quad: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  },
  flex: {
    between: 'flex justify-between items-center',
    center: 'flex justify-center items-center',
    start: 'flex justify-start items-center',
  },
  text: {
    heading: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
    subheading: 'text-lg sm:text-xl lg:text-2xl font-semibold',
    body: 'text-sm sm:text-base',
    caption: 'text-xs sm:text-sm',
  },
  spacing: {
    section: 'py-8 sm:py-12 lg:py-16',
    card: 'p-4 sm:p-6 lg:p-8',
    button: 'px-4 py-2 sm:px-6 sm:py-3',
  }
};
