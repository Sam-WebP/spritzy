'use client';

import { useEffect } from 'react';
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleSetting, toggleFocusControlsHiding, setColorScheme } from '@/redux/slices/settingsSlice';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { COLOR_THEMES } from '@/utils/constants';
import {
  getThemeColors,
  applyThemeColors,
  removeCustomTheme,
  SystemTheme
} from '@/utils/theme-utils';
import { Input } from "@/components/ui/input";
import { updateCustomColor } from '@/redux/slices/settingsSlice';

export default function DisplaySettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  const { theme: systemTheme, setTheme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Apply theme whenever light/dark mode or color scheme changes
  useEffect(() => {
    if (settings.colorScheme === 'Custom') {
      // Apply custom theme colors directly
      const colors = isDarkMode
        ? settings.customThemeColors.dark
        : settings.customThemeColors.light;
      applyThemeColors(colors);
    } else if (settings.colorScheme && settings.colorScheme !== 'Default') {
      const colors = getThemeColors(settings.colorScheme, isDarkMode);
      applyThemeColors(colors);
    } else {
      removeCustomTheme();
    }
  }, [settings.colorScheme, isDarkMode, settings.customThemeColors]);

  // Handle system theme change (light/dark)
  const handleSystemThemeChange = (theme: SystemTheme) => {
    setTheme(theme);
  };

  // Handle color scheme selection
  const handleColorSchemeChange = (schemeName: string) => {
    dispatch(setColorScheme(schemeName));

    if (schemeName === 'Default') {
      removeCustomTheme();
    } else if (schemeName === 'Custom') {
      // Apply current custom colors
      const colors = isDarkMode
        ? settings.customThemeColors.dark
        : settings.customThemeColors.light;
      applyThemeColors(colors, true);
    } else {
      const colors = getThemeColors(schemeName, isDarkMode);
      applyThemeColors(colors);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color Scheme Section */}
      <div className="space-y-4">
        <Label className="text-base">Theme Options</Label>

        {/* Light/Dark Mode Toggle */}
        <div className="flex flex-col space-y-2">
          <Label className="text-sm">Choose Theme Mode</Label>
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
              System
            </Button>
          </div>
        </div>

        {/* Color Scheme Selection */}
        <div className="space-y-2">
          <Label className="text-sm">Choose Color Scheme</Label>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_THEMES.map(theme => (
              <Button
                key={theme.name}
                variant="outline"
                size="sm"
                className={settings.colorScheme === theme.name ? "border-primary" : ""}
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
              className={settings.colorScheme === "Custom" ? "border-primary" : ""}
              onClick={() => handleColorSchemeChange('Custom')}
            >
              Custom
            </Button>
          </div>
        </div>

        {/* Custom Color Inputs */}
        {settings.colorScheme === 'Custom' && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <Label className="text-base">Custom Colors</Label>

            <div className="space-y-4">
              <div>
                <Label className="text-sm">Light Mode</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Label htmlFor="light-bg">Background</Label>
                  <Input
                    id="light-bg"
                    type="color"
                    value={settings.customThemeColors.light.background}
                    onChange={(e) => dispatch(updateCustomColor({
                      mode: 'light',
                      property: 'background',
                      value: e.target.value
                    }))}
                  />

                  <Label htmlFor="light-fg">Text</Label>
                  <Input
                    id="light-fg"
                    type="color"
                    value={settings.customThemeColors.light.foreground}
                    onChange={(e) => dispatch(updateCustomColor({
                      mode: 'light',
                      property: 'foreground',
                      value: e.target.value
                    }))}
                  />

                  <Label htmlFor="light-primary">Primary</Label>
                  <Input
                    id="light-primary"
                    type="color"
                    value={settings.customThemeColors.light.primary}
                    onChange={(e) => dispatch(updateCustomColor({
                      mode: 'light',
                      property: 'primary',
                      value: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Dark Mode</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Label htmlFor="dark-bg">Background</Label>
                  <Input
                    id="dark-bg"
                    type="color"
                    value={settings.customThemeColors.dark.background}
                    onChange={(e) => dispatch(updateCustomColor({
                      mode: 'dark',
                      property: 'background',
                      value: e.target.value
                    }))}
                  />

                  <Label htmlFor="dark-fg">Text</Label>
                  <Input
                    id="dark-fg"
                    type="color"
                    value={settings.customThemeColors.dark.foreground}
                    onChange={(e) => dispatch(updateCustomColor({
                      mode: 'dark',
                      property: 'foreground',
                      value: e.target.value
                    }))}
                  />

                  <Label htmlFor="dark-primary">Primary</Label>
                  <Input
                    id="dark-primary"
                    type="color"
                    value={settings.customThemeColors.dark.primary}
                    onChange={(e) => dispatch(updateCustomColor({
                      mode: 'dark',
                      property: 'primary',
                      value: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Word Display Options */}
      <div className="space-y-4">
        <Label className="text-base">Word Display Options</Label>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-focus"
              checked={settings.showFocusLetter}
              onCheckedChange={() => dispatch(toggleSetting('showFocusLetter'))}
            />
            <Label htmlFor="show-focus">Highlight Focus Letter</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-border"
              checked={settings.showFocusBorder}
              onCheckedChange={() => dispatch(toggleSetting('showFocusBorder'))}
            />
            <Label htmlFor="show-border">Show Focus Border</Label>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Focus Mode Section */}
      <div className="space-y-4">
        <Label className="text-base">Focus Mode Settings</Label>

        <div className="grid grid-cols-1 gap-4">
          {/* Auto-hide controls toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-hide-controls"
              checked={settings.autoHideFocusControls}
              onCheckedChange={() => dispatch(toggleFocusControlsHiding())}
            />
            <Label htmlFor="auto-hide-controls">Auto-hide Focus Mode Controls</Label>
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            When enabled, controls will hide after 2 seconds of inactivity during playback.
          </p>
        </div>
      </div>
    </div>
  );
}
