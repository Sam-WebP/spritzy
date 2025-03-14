'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppSelector } from '@/redux/hooks';
import { getThemeColors, applyThemeColors } from '@/utils/theme-utils';

export function ThemeInitializer() {
  const { resolvedTheme } = useTheme();
  const { colorScheme } = useAppSelector(state => state.settings);
  
  // Apply theme on initial load
  useEffect(() => {
    // Wait for theme to be resolved
    if (resolvedTheme && colorScheme && colorScheme !== 'Default') {
      const isDarkMode = resolvedTheme === 'dark';
      const colors = getThemeColors(colorScheme, isDarkMode);
      applyThemeColors(colors);
    }
  }, [resolvedTheme, colorScheme]);
  
  // This is a utility component - it doesn't render anything
  return null;
}