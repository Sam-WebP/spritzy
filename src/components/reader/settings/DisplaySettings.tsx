'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleSetting } from '@/redux/slices/settingsSlice';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function DisplaySettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);

  return (
    <div className="space-y-4">
      <Label className="text-base">Display Options</Label>

      {/* Toggle Options */}
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
  );
}