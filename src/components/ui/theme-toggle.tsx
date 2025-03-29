"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useAppSelector } from '@/redux/hooks';
import { getThemeColors, applyThemeColors, removeCustomTheme } from '@/utils/theme-utils';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const colorScheme = useAppSelector(state => state.settings.colorScheme);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        // Toggle theme
        const newMode = isDarkMode ? 'light' : 'dark';
        setTheme(newMode);

        // Reapply color scheme for the new mode if one is selected
        if (colorScheme === 'Custom') {
          // Custom theme will be handled by the DisplaySettings component's useEffect
          return;
        } else if (colorScheme && colorScheme !== 'Default') {
          const colors = getThemeColors(colorScheme, !isDarkMode);
          applyThemeColors(colors);
        } else {
          removeCustomTheme();
        }
      }}
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> :
        <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
}
