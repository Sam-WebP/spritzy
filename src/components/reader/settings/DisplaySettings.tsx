'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleSetting, toggleFocusControlsHiding } from '@/redux/slices/settingsSlice';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function DisplaySettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);

  return (
    <div className="space-y-6">
      {/* Original Display Options Section */}
      <div className="space-y-4">
        <Label className="text-base">Display Options</Label>

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

      {/* Separator */}
      <Separator className="my-4" />

      {/* Focus Mode Section */}
      <div className="space-y-4">
        <Label className="text-base">Focus Mode Settings</Label>
        
        <div className="grid grid-cols-1 gap-4">
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
            Move your mouse to show controls again.
          </p>
        </div>
      </div>
    </div>
  );
}