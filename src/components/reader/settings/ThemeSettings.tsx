'use client';

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Palette, Paintbrush } from "lucide-react";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  handleThemeChange, 
  updateCustomTheme 
} from '@/redux/slices/themeSlice';
import { updateTheme } from '@/redux/slices/settingsSlice';
import { ColorTheme } from '@/types';
import { COLOR_THEMES } from '@/utils/constants';
import { applyCustomThemeToDOM } from '@/utils/theme-utils';

export default function ThemeSettings() {
  const { theme: nextTheme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  const { customTheme } = useAppSelector(state => state.theme);

  // Handle theme selection with both next-themes and redux
  const handleThemeClick = (themeName: string) => {
    if (themeName === 'Light') {
      setTheme('light');
    } else if (themeName === 'Dark') {
      setTheme('dark');
    } else {
      // For custom themes, update redux state
      const selectedTheme = themeName === 'Custom' 
        ? customTheme 
        : COLOR_THEMES.find(t => t.name === themeName);
      
      if (selectedTheme) {
        dispatch(handleThemeChange(themeName));
        dispatch(updateTheme(selectedTheme));
        
        // Apply the theme to CSS variables
        applyCustomThemeToDOM(selectedTheme);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base">Theme</Label>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className={nextTheme === "light" ? "border-primary" : ""}
          onClick={() => handleThemeClick('Light')}
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </Button>
        
        <Button
          variant="outline"
          size="sm" 
          className={nextTheme === "dark" ? "border-primary" : ""}
          onClick={() => handleThemeClick('Dark')}
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </Button>

        {/* Other themes from COLOR_THEMES */}
        {COLOR_THEMES.filter(t => !['Default', 'Dark'].includes(t.name)).map(themeOption => (
          <Button
            key={themeOption.name}
            variant="outline"
            size="sm"
            className={settings.theme.name === themeOption.name ? "border-primary" : ""}
            onClick={() => handleThemeClick(themeOption.name)}
          >
            <Paintbrush className="h-4 w-4 mr-2" />
            {themeOption.name}
          </Button>
        ))}

        {/* Custom theme button */}
        <Button
          variant="outline"
          size="sm"
          className={settings.theme.name === "Custom" ? "border-primary" : ""}
          onClick={() => handleThemeClick('Custom')}
        >
          <Palette className="h-4 w-4 mr-2" />
          Custom
        </Button>
      </div>

      {/* Custom Theme Editor */}
      {settings.theme.name === 'Custom' && (
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
                          
                          // Apply the theme to CSS variables
                          applyCustomThemeToDOM(updatedTheme);
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
  );
}