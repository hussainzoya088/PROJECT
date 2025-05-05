import React, { useState, useEffect } from 'react';
import './App.css';  // Ensure you have your CSS for dark theme here

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-theme', isDarkMode);
  };

  useEffect(() => {
    // Set the initial theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);
    }
  }, []);

  useEffect(() => {
    // Save the theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <h1>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</h1>
      {/* Add the rest of your components here */}
    </div>
  );
};

export default App;
