'use client';

import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { useAppSelector } from '@/redux/hooks';
import { getThemeColors } from '@/utils/theme-utils';
import { hexToRgba } from '@/utils/color-utils';

export default function BackgroundGradient() {
  const { resolvedTheme } = useTheme();
  const { colorScheme, customThemeColors } = useAppSelector(state => state.settings);
  const [gradientColor, setGradientColor] = useState("rgba(255, 255, 255, 0.01)");

  useEffect(() => {
    const isDarkMode = resolvedTheme === 'dark';

    if (colorScheme === 'Custom') {
      const colors = isDarkMode
        ? customThemeColors?.dark
        : customThemeColors?.light;
      if (colors?.primary) {
        setGradientColor(hexToRgba(colors.primary, 0.3));
      }
    } else if (colorScheme && colorScheme !== 'Default') {
      const colors = getThemeColors(colorScheme, isDarkMode);
      setGradientColor(hexToRgba(colors?.primary, 0.3));
    } else {
      setGradientColor(isDarkMode ? "rgba(138,43,226,0.3)" : "rgba(120,119,198,0.3)");
    }
  }, [colorScheme, resolvedTheme, customThemeColors?.dark, customThemeColors?.light]); // Updated dependencies

  return (
    <div className="fixed top-0 left-0 z-[-2] h-full w-full bg-background" style={{
      backgroundImage: `radial-gradient(ellipse 80% 80% at 50% 120%, ${gradientColor}, rgba(255,255,255,0))`
    }}></div>
  );
}
