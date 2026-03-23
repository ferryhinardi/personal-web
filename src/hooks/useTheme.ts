import {useContext} from 'react';
import {ThemeContext} from '@/contexts/ThemeContext';

/**
 * Hook to access the theme system.
 *
 * Usage:
 * ```tsx
 * const { theme, isDark, toggleDarkMode, setTheme, availableThemes } = useTheme();
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
