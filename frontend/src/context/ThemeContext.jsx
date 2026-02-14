import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('sanapath_theme');
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode) => {
      if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('light-mode', !prefersDark);
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else if (mode === 'light') {
        root.classList.add('light-mode');
        root.setAttribute('data-theme', 'light');
      } else {
        root.classList.remove('light-mode');
        root.setAttribute('data-theme', 'dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('sanapath_theme', theme);

    // Listen for system preference changes when in 'system' mode
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
