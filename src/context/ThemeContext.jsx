import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('userTheme');
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme to entire document
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      html.classList.add('dark-mode');
      body.classList.add('dark-mode');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add('dark-mode');
        body.classList.add('dark-mode');
      } else {
        html.classList.remove('dark-mode');
        body.classList.remove('dark-mode');
      }
    } else {
      html.classList.remove('dark-mode');
      body.classList.remove('dark-mode');
    }

    // Save to localStorage
    try {
      localStorage.setItem('userTheme', theme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};