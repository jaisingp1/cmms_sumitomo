// client/src/components/ThemeToggler.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggler: React.FC = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    // This should not happen if ThemeToggler is used within ThemeProvider
    return null;
  }

  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-14.66l-.707.707M5.05 18.95l-.707.707M21 12h-1M4 12H3m15.66-8.66l-.707-.707M6.464 5.05l-.707-.707" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggler;
