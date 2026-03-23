import {useState, useEffect, useContext} from 'react';
import {ThemeContext} from '@/contexts/ThemeContext';

/**
 * Dark mode hook — compatibility wrapper.
 *
 * When used inside a ThemeProvider (most of the app via RootLayout),
 * delegates to ThemeContext. When used outside (e.g. PrintResume),
 * manages its own state as a standalone fallback.
 */
export function useDarkMode() {
  const themeContext = useContext(ThemeContext);

  // If ThemeProvider is available, delegate to it
  if (themeContext) {
    return {
      isDark: themeContext.isDark,
      toggleDarkMode: themeContext.toggleDarkMode,
    };
  }

  // Standalone fallback (for components outside ThemeProvider)
  return useDarkModeStandalone();
}

function useDarkModeStandalone() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('themeMode') || localStorage.getItem('darkMode');
    if (saved === 'dark' || saved === 'true') return true;
    if (saved === 'light' || saved === 'false') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setIsDark(!isDark);
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  };

  return {isDark, toggleDarkMode};
}
