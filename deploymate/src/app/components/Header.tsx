import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Todo Application' }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check user preference or system preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    applyDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    applyDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="app-header">
      <div className="flex-1">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <button 
        className="dark-mode-toggle" 
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}; 