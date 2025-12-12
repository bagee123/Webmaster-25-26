import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DarkModeContext = createContext(undefined);

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('darkMode');
      if (stored === 'true') {
        return true;
      } else if (stored === 'false') {
        return false;
      }
    } catch (error) {
      // Silently fail for localStorage access
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('darkMode', String(isDarkMode));
    } catch (error) {
      // Silently fail for localStorage access
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}

export { DarkModeContext };
