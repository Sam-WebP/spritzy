'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateFont, updateNumericSetting } from '@/redux/slices/settingsSlice';
import { FONT_OPTIONS } from '@/utils/constants';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Type, TextCursor } from "lucide-react";

export default function FontSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);

  return (
    <div className="space-y-6">
      {/* Font Family */}
      <div>
        <Label className="text-base mb-2 block">Font Family</Label>
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
        <div className="text-xs text-muted-foreground mt-1">
          <TextCursor className="h-3 w-3 inline-block mr-1" />
          Adjust spacing between characters
        </div>
      </div>
    </div>
  );
}