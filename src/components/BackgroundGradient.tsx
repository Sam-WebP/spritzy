'use client';

import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { useAppSelector } from '@/redux/hooks';
import { getThemeColors } from '@/utils/theme-utils';
import { hexToRgba } from '@/utils/color-utils';

export default function BackgroundGradient() {
  const { resolvedTheme } = useTheme();
  const { colorScheme } = useAppSelector(state => state.settings);
  const { theme } = useAppSelector(state => state.theme);
  const [gradientColor, setGradientColor] = useState("rgba(255, 255, 255, 0.01)");

  useEffect(() => {
    const isDarkMode = resolvedTheme === 'dark';

    if (colorScheme === 'Custom' && theme.name === 'Custom') {
      const color = isDarkMode ? theme.dark.highlightText : theme.light.highlightText;
      setGradientColor(hexToRgba(color, 0.3));
    } else if (colorScheme && colorScheme !== 'Default') {
      const colors = getThemeColors(colorScheme, isDarkMode);
      setGradientColor(hexToRgba(colors.highlightText, 0.3));
    } else {
      setGradientColor(isDarkMode ? "rgba(138,43,226,0.3)" : "rgba(120,119,198,0.3)");
    }
  }, [colorScheme, resolvedTheme, theme]);

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-background" style={{
      backgroundImage: `radial-gradient(ellipse 80% 80% at 50% -20%, ${gradientColor}, rgba(255,255,255,0))`
    }}></div>
  );
}