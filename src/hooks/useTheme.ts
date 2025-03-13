import { useState, useCallback, useEffect } from 'react';
import { COLOR_THEMES } from '@/utils/constants';
import { ColorTheme } from '@/types';

interface UseThemeReturn {
  theme: ColorTheme;
  customTheme: ColorTheme;
  availableThemes: ColorTheme[];
  setTheme: (theme: ColorTheme) => void;
  handleThemeChange: (themeName: string) => void;
  updateCustomTheme: (property: keyof ColorTheme, value: string) => void;
  applyCustomTheme: () => void;
}

export function useTheme(
  initialTheme: ColorTheme = COLOR_THEMES[0], 
  onThemeChange?: (theme: ColorTheme) => void
): UseThemeReturn {
  const [theme, setTheme] = useState<ColorTheme>(initialTheme);
  const [customTheme, setCustomTheme] = useState<ColorTheme>({
    name: 'Custom',
    background: '#ffffff',
    containerBackground: '#ffffff',
    text: '#374151',
    highlightText: '#dc2626',
    highlightBorder: '#dc2626',
    wordBackground: '#f9fafb',
  });

  const handleThemeChange = useCallback((themeName: string) => {
    let newTheme: ColorTheme;
    
    if (themeName === 'Custom') {
      newTheme = customTheme;
    } else {
      newTheme = COLOR_THEMES.find(t => t.name === themeName) || COLOR_THEMES[0];
    }
    
    setTheme(newTheme);
  }, [customTheme]);

  // Notify parent component about theme change
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(theme);
    }
  }, [theme, onThemeChange]);

  const updateCustomTheme = useCallback((property: keyof ColorTheme, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [property]: value
    }));
  }, []);

  const applyCustomTheme = useCallback(() => {
    setTheme(customTheme);
  }, [customTheme]);

  return {
    theme,
    customTheme,
    availableThemes: COLOR_THEMES,
    setTheme,
    handleThemeChange,
    updateCustomTheme,
    applyCustomTheme
  };
}