'use client';

import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { useAppSelector } from '@/redux/hooks';
import { getThemeColors } from '@/utils/theme-utils';

export default function BackgroundGradient() {
  const { resolvedTheme } = useTheme();
  const { colorScheme } = useAppSelector(state => state.settings);
  const { theme } = useAppSelector(state => state.theme);
  const [gradientColor, setGradientColor] = useState("rgba(255, 255, 255, 0.01)");
  
  useEffect(() => {
    const isDarkMode = resolvedTheme === 'dark';
    
    // Use the active theme colors
    if (colorScheme === 'Custom' && theme.name === 'Custom') {
      // Use custom theme color
      const color = isDarkMode ? theme.dark.highlightText : theme.light.highlightText;
      // Convert hex to rgba with opacity
      setGradientColor(hexToRgba(color, 0.3));
    } else if (colorScheme && colorScheme !== 'Default') {
      // Use selected color scheme
      const colors = getThemeColors(colorScheme, isDarkMode);
      setGradientColor(hexToRgba(colors.highlightText, 0.3));
    } else {
      // Use theme default color
      setGradientColor(isDarkMode ? "rgba(138,43,226,0.3)" : "rgba(120,119,198,0.3)");
    }
  }, [colorScheme, resolvedTheme, theme]);
  
  // Helper to convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number = 1) => {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    } catch {
      console.error('Error converting hex to rgba', hex);
      return "rgba(120,119,198,0.3)"; // Fallback color
    }
  };
  
  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-background" style={{
      backgroundImage: `radial-gradient(ellipse 80% 80% at 50% -20%, ${gradientColor}, rgba(255,255,255,0))`
    }}></div>
  );
}