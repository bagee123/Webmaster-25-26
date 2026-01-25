import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DarkModeContext = createContext(undefined);

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      // First check sessionStorage for instant initialization (avoids flash)
      const session = sessionStorage.getItem('darkMode');
      if (session === 'true') {
        return true;
      } else if (session === 'false') {
        return false;
      }
      
      // Fall back to localStorage for persistence across sessions
      const stored = localStorage.getItem('darkMode');
      if (stored === 'true') {
        return true;
      } else if (stored === 'false') {
        return false;
      }
    } catch {
      // Silently fail for storage access
    }
    return false;
  });

  // Apply dark mode class immediately on initialization to prevent flash
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save to both sessionStorage (for instant next load) and localStorage (for persistence)
  useEffect(() => {
    try {
      sessionStorage.setItem('darkMode', String(isDarkMode));
      localStorage.setItem('darkMode', String(isDarkMode));
    } catch {
      // Silently fail for storage access
    }
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
