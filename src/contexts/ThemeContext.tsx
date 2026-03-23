import {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {themes} from '@/types/theme.types';
import type {ThemeMode, ThemeDefinition} from '@/types/theme.types';

interface ThemeContextValue {
  /** Current theme definition */
  theme: ThemeDefinition;
  /** Current color mode */
  mode: ThemeMode;
  /** Resolved dark mode state (accounts for 'system' preference) */
  isDark: boolean;
  /** Set the active color theme by ID */
  setTheme: (themeId: string) => void;
  /** Set the color mode */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark mode */
  toggleDarkMode: () => void;
  /** All available themes */
  availableThemes: ThemeDefinition[];
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('themeId') || 'default';
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    // Migrate from old darkMode key
    const oldDark = localStorage.getItem('darkMode');
    if (oldDark === 'true') return 'dark';
    if (oldDark === 'false') return 'light';
    return 'system';
  });

  // Listen for system preference changes when mode is 'system'
  const [systemDarkSignal, setSystemDarkSignal] = useState(0);
  useEffect(() => {
    if (mode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemDarkSignal((n) => n + 1);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  const isDark = useMemo(() => {
    if (mode === 'system') return getSystemDark();
    return mode === 'dark';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, systemDarkSignal]);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Apply dark mode class
    root.classList.add('theme-transition');
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setTimeout(() => root.classList.remove('theme-transition'), 300);

    // Apply theme hue
    const themeDef = themes.find((t) => t.id === themeId) || themes[0];
    root.setAttribute('data-theme', themeId);
    root.style.setProperty('--theme-hue', String(themeDef.hue));

    // Persist
    localStorage.setItem('themeId', themeId);
    localStorage.setItem('themeMode', mode);
    // Clean up old key
    localStorage.removeItem('darkMode');
  }, [themeId, isDark, mode]);

  const setTheme = useCallback((id: string) => {
    if (themes.find((t) => t.id === id)) {
      setThemeId(id);
    }
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setModeState((prev) => {
      if (prev === 'system') return getSystemDark() ? 'light' : 'dark';
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const theme = useMemo(
    () => themes.find((t) => t.id === themeId) || themes[0],
    [themeId],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      isDark,
      setTheme,
      setMode,
      toggleDarkMode,
      availableThemes: themes,
    }),
    [theme, mode, isDark, setTheme, setMode, toggleDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
