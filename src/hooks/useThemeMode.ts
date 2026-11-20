import { useEffect, useState } from 'react';

const themeStorageKey = 'theme';

function initialDarkMode(): boolean {
  const savedTheme = localStorage.getItem(themeStorageKey);
  return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// light/dark mode saved in this browser; applied as the `dark` class on <html>
export function useThemeMode() {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem(themeStorageKey, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(current => !current);
  return { isDarkMode, toggleDarkMode };
}
