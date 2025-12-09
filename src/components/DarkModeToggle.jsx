import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import '../css/darkModeToggle.css';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      aria-label="Toggle dark mode"
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
