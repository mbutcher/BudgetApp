import { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'default' | 'slate' | 'forest' | 'warm' | 'midnight';

const VALID_THEMES: readonly ThemeName[] = ['default', 'slate', 'forest', 'warm', 'midnight'];

function isThemeName(value: string | null): value is ThemeName {
  return VALID_THEMES.includes(value as ThemeName);
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'default',
  setTheme: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components -- standard context pattern: hook co-located with its Provider
export const useTheme = (): ThemeContextValue => useContext(ThemeContext);

const STORAGE_KEY = 'budgetapp_theme';

function applyTheme(name: ThemeName): void {
  document.documentElement.setAttribute('data-theme', name);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeName(stored) ? stored : 'default';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (name: ThemeName) => {
    setThemeState(name);
    localStorage.setItem(STORAGE_KEY, name);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
