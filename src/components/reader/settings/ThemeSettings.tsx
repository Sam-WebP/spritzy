'use client';

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Palette } from "lucide-react";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  handleThemeChange, 
  updateCustomTheme 
} from '@/redux/slices/themeSlice';
import { updateTheme } from '@/redux/slices/settingsSlice';
import { ColorTheme } from '@/types';
import { COLOR_THEMES } from '@/utils/constants';
import { applyCustomThemeToCssVars, removeCustomTheme, SystemTheme } from '@/utils/theme-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ThemeSettings() {
  const { theme: systemTheme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  const { customTheme } = useAppSelector(state => state.theme);
  
  // Handle system theme selection (light/dark)
  const handleSystemThemeChange = (theme: SystemTheme) => {
    setTheme(theme);
    removeCustomTheme(); // Remove any custom theme when switching to system theme
  };
  
  // Handle selection of a preset color scheme
  const handleColorSchemeChange = (themeName: string) => {
    const selectedTheme = themeName === 'Custom' 
        ? customTheme 
        : COLOR_THEMES.find(t => t.name === themeName);
    
    if (selectedTheme) {
      dispatch(handleThemeChange(themeName));
      dispatch(updateTheme(selectedTheme));
      applyCustomThemeToCssVars(selectedTheme);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="system">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="system">System Theme</TabsTrigger>
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
                  className={
                    document.documentElement.classList.contains('using-custom-theme') && 
                    settings.theme.name === theme.name 
                      ? "border-primary" 
                      : ""
                  }
                  onClick={() => handleColorSchemeChange(theme.name)}
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: theme.highlightText,
                      border: `1px solid ${theme.text}`
                    }} 
                  />
                  {theme.name}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                className={
                  document.documentElement.classList.contains('using-custom-theme') && 
                  settings.theme.name === "Custom" 
                    ? "border-primary" 
                    : ""
                }
                onClick={() => handleColorSchemeChange('Custom')}
              >
                <Palette className="h-4 w-4 mr-2" />
                Custom
              </Button>
            </div>

            {/* Custom Theme Editor */}
            {settings.theme.name === 'Custom' && 
             document.documentElement.classList.contains('using-custom-theme') && (
              <Card className="border-dashed mt-4">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Custom Theme Editor</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(customTheme)
                    .filter(([key]) => key !== 'name')
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-2">
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <div className="flex gap-2 items-center">
                          <div 
                            className="w-6 h-6 rounded-md border"
                            style={{ backgroundColor: value as string }}
                          />
                          <Input
                            id={key}
                            value={value as string}
                            onChange={(e) => {
                              const newColor = e.target.value;
                              const updatedTheme = {
                                ...customTheme,
                                [key]: newColor
                              };
                              
                              dispatch(updateCustomTheme({
                                property: key as keyof ColorTheme, 
                                value: newColor
                              }));
                              
                              if (settings.theme.name === 'Custom') {
                                dispatch(updateTheme(updatedTheme));
                                applyCustomThemeToCssVars(updatedTheme);
                              }
                            }}
                            className="w-28 font-mono"
                            type="text"
                          />
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}