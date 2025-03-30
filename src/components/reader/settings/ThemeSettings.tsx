'use client';

import { useEffect } from 'react';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setColorScheme } from '@/redux/slices/settingsSlice';
import { COLOR_THEMES } from '@/utils/constants';
import {
  getThemeColors,
  applyThemeColors,
  removeCustomTheme,
  getContrastColor,
  SystemTheme
} from '@/utils/theme-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ThemeSettings() {
  const { theme: systemTheme, setTheme, resolvedTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppSelector(state => state.settings);
  const isDarkMode = resolvedTheme === 'dark';

  // Apply theme whenever light/dark mode or color scheme changes
  useEffect(() => {
    if (colorScheme && colorScheme !== 'Default') {
      const colors = getThemeColors(colorScheme, isDarkMode);
      applyThemeColors(colors);
    } else {
      removeCustomTheme();
    }
  }, [colorScheme, isDarkMode]);

  // Handle system theme change (light/dark)
  const handleSystemThemeChange = (theme: SystemTheme) => {
    setTheme(theme);
  };

  // Handle color scheme selection
  const handleColorSchemeChange = (schemeName: string) => {
    dispatch(setColorScheme(schemeName));

    if (schemeName === 'Default') {
      removeCustomTheme();
    } else {
      const colors = getThemeColors(schemeName, isDarkMode);

      document.documentElement.style.setProperty('--primary-custom', colors.primary);
      document.documentElement.style.setProperty('--primary-foreground-custom', getContrastColor(colors.primary));

      applyThemeColors(colors);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="system">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="system">Light/Dark Mode</TabsTrigger>
          <TabsTrigger value="colorScheme">Color Scheme</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-4">
          <div className="flex flex-col space-y-2">
            <Label className="text-base">Choose Theme Mode</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className={systemTheme === "light" ? "border-primary" : ""}
                onClick={() => handleSystemThemeChange('light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={systemTheme === "dark" ? "border-primary" : ""}
                onClick={() => handleSystemThemeChange('dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={systemTheme === "system" ? "border-primary" : ""}
                onClick={() => handleSystemThemeChange('system')}
              >
                <Sun className="h-4 w-4 mr-2" />
                System
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colorScheme" className="mt-4">
          <div className="space-y-4">
            <Label className="text-base">Choose Color Scheme</Label>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_THEMES.map(theme => (
                <Button
                  key={theme.name}
                  variant="outline"
                  size="sm"
                  className={colorScheme === theme.name ? "border-primary" : ""}
                  onClick={() => handleColorSchemeChange(theme.name)}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: theme.light.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: theme.dark.primary }}
                    />
                    {theme.name}
                  </div>
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                className={colorScheme === "Default" ? "border-primary" : ""}
                onClick={() => handleColorSchemeChange('Default')}
              >
                System Default
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
