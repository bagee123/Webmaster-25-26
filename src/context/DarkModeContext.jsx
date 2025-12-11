import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DarkModeContext = createContext(undefined);

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    try {
      const stored = localStorage.getItem('darkMode');
      console.log('Initializing dark mode - stored value:', stored, 'type:', typeof stored);
      if (stored === 'true') {
        console.log('Using stored value: TRUE');
        return true;
      } else if (stored === 'false') {
        console.log('Using stored value: FALSE');
        return false;
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
    // DEFAULT to light mode if no stored value
    console.log('No stored value - defaulting to light mode');
    return false;
  });

  useEffect(() => {
    console.log('isDarkMode changed to:', isDarkMode);
    // Apply or remove dark class on document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      console.log('Dark mode ON - .dark class added to document');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Dark mode OFF - .dark class removed from document');
    }
    // Store preference
    try {
      localStorage.setItem('darkMode', String(isDarkMode));
      console.log('Saved to localStorage:', isDarkMode);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    console.log('Toggle clicked - current isDarkMode:', isDarkMode);
    setIsDarkMode(prev => {
      console.log('Toggling from', prev, 'to', !prev);
      return !prev;
    });
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
