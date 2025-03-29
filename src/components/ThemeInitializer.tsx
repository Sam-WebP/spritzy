'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppSelector } from '@/redux/hooks';
import { getThemeColors, applyThemeColors } from '@/utils/theme-utils';

export function ThemeInitializer() {
  const { resolvedTheme } = useTheme();
  const { colorScheme } = useAppSelector(state => state.settings);

  const { customThemeColors } = useAppSelector(state => state.settings);

  // Apply theme on initial load
  useEffect(() => {
    // Wait for theme to be resolved
    if (resolvedTheme && colorScheme) {
      const isDarkMode = resolvedTheme === 'dark';
      if (colorScheme === 'Custom') {
        const colors = isDarkMode
          ? customThemeColors?.dark
          : customThemeColors?.light;
        if (colors) {
          applyThemeColors(colors, true);
        }
      } else if (colorScheme !== 'Default') {
        const colors = getThemeColors(colorScheme, isDarkMode);
        applyThemeColors(colors);
      }
    }
  }, [resolvedTheme, colorScheme, customThemeColors?.dark, customThemeColors?.light]);

  // This is a utility component - it doesn't render anything
  return null;
}
