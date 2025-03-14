'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ColorTheme, HighlightPattern } from '@/types';
import { COLOR_THEMES, FONT_OPTIONS, DEFAULT_HIGHLIGHT_PATTERN } from '@/utils/constants';
import { parsePatternString } from '@/utils/color-utils';
import { 
  updateTheme, 
  updateFont, 
  toggleSetting, 
  updateNumericSetting, 
  resetSettings 
} from '@/redux/slices/settingsSlice';
import { 
  handleThemeChange, 
  updateCustomTheme 
} from '@/redux/slices/themeSlice';
import { setHighlightPattern } from '@/redux/slices/readerSlice';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, RefreshCw, Paintbrush, Type } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function SettingsPanel() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);
  const { customTheme } = useAppSelector(state => state.theme);
  const { highlightPattern } = useAppSelector(state => state.reader);
  
  const [isPatternEditorOpen, setIsPatternEditorOpen] = useState<boolean>(false);
  const [newPattern, setNewPattern] = useState<string>('');

  const openPatternEditor = () => {
    const formattedPattern = highlightPattern
      .map(rule => `${rule.maxLength}:${rule.highlightIndex}`)
      .join(', ');
    setNewPattern(formattedPattern);
    setIsPatternEditorOpen(true);
  };

  const handleApplyPattern = () => {
    try {
      const patternRules = parsePatternString(newPattern);
      dispatch(setHighlightPattern(patternRules));
      setIsPatternEditorOpen(false);
    } catch (error) {
      alert('Invalid pattern format. Please use the format "maxLength:highlightIndex" separated by commas.');
    }
  };

  const handleResetPattern = () => {
    dispatch(setHighlightPattern(DEFAULT_HIGHLIGHT_PATTERN));
    setIsPatternEditorOpen(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Reader Settings</CardTitle>
        <Button 
          onClick={() => dispatch(resetSettings())}
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-6">
        {/* Color Theme */}
        <div>
          <Label className="mb-2 block">Color Theme</Label>
          <div className="flex flex-wrap gap-2">
            {[...COLOR_THEMES, { ...customTheme }].map(themeOption => (
              <Button
                key={themeOption.name}
                variant={settings.theme.name === themeOption.name ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  dispatch(handleThemeChange(themeOption.name));
                  dispatch(updateTheme(themeOption.name === 'Custom' ? customTheme : themeOption));
                }}
              >
                <Paintbrush className="h-4 w-4 mr-2" />
                {themeOption.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Theme Editor */}
        {settings.theme.name === 'Custom' && (
          <Card className="border-dashed">
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
                          dispatch(updateCustomTheme({
                            property: key as keyof ColorTheme, 
                            value: newColor
                          }));
                          
                          if (settings.theme.name === 'Custom') {
                            dispatch(updateTheme({
                              ...settings.theme,
                              [key]: newColor
                            }));
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
        
        {/* Font Family */}
        <div>
          <Label className="mb-2 block">Font Family</Label>
          <div className="flex gap-2">
            {FONT_OPTIONS.map(font => (
              <Button
                key={font.name}
                variant={settings.font.name === font.name ? "default" : "outline"}
                size="sm"
                className={font.className}
                onClick={() => dispatch(updateFont(font.name))}
              >
                <Type className="h-4 w-4 mr-2" />
                {font.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Font Size: {settings.fontSize}px</Label>
          </div>
          <Slider
            value={[settings.fontSize]} 
            min={12}
            max={48}
            step={1}
            onValueChange={([value]) => dispatch(updateNumericSetting({
              setting: 'fontSize',
              value
            }))}
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Letter Spacing: {settings.letterSpacing}px</Label>
          </div>
          <Slider
            value={[settings.letterSpacing]} 
            min={0}
            max={10}
            step={0.5}
            onValueChange={([value]) => dispatch(updateNumericSetting({
              setting: 'letterSpacing',
              value
            }))}
          />
        </div>

        {/* Toggle Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        
        {/* Highlight Pattern */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Highlight Pattern</Label>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openPatternEditor}
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>
          
          {isPatternEditorOpen && (
            <Card className="border-dashed mt-2">
              <CardContent className="pt-4 space-y-3">
                <Alert variant="default" className="text-xs">
                  <AlertDescription>
                    Format: "maxLength:highlightIndex" separated by commas<br/>
                    Example: "4:0, 6:1, 8:2, 10:3" means:
                    <br/>- Words up to 4 chars: highlight 1st letter (index 0)
                    <br/>- Words 5-6 chars: highlight 2nd letter (index 1)
                    <br/>- etc.
                  </AlertDescription>
                </Alert>
                
                <Input 
                  type="text" 
                  value={newPattern} 
                  onChange={(e) => setNewPattern(e.target.value)}
                  placeholder="4:0, 6:1, 8:2, 10:3, ..."
                  aria-label="Enter highlight pattern"
                />
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleApplyPattern}>Apply Pattern</Button>
                  <Button size="sm" variant="outline" onClick={handleResetPattern}>Reset</Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsPatternEditorOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}