'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleMicroPauses, updateMicroPause } from '@/redux/slices/settingsSlice';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MicroPauseSettings as MicroPauseSettingsType } from '@/types';

export default function MicroPauseSettings() {
  const dispatch = useAppDispatch();
  const { microPauses } = useAppSelector(state => state.settings);

  const handleUpdatePause = (setting: keyof MicroPauseSettingsType, value: number) => {
    if (setting !== 'enableMicroPauses') {
      dispatch(updateMicroPause({ setting, value }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="enable-micropauses"
          checked={microPauses.enableMicroPauses}
          onCheckedChange={() => dispatch(toggleMicroPauses())}
        />
        <Label htmlFor="enable-micropauses">Enable Micro-Pauses</Label>
      </div>

      {microPauses.enableMicroPauses && (
        <div className="space-y-6">
          {/* Large Numbers Pause */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Large Numbers: {microPauses.largeNumbersPause.toFixed(1)}</Label>
            </div>
            <Slider
              value={[microPauses.largeNumbersPause]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => handleUpdatePause('largeNumbersPause', value)}
            />
            <p className="text-xs text-muted-foreground">
              Extra pause for numbers with 4+ digits
            </p>
          </div>

          {/* Sentence End Pause */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Sentence Ends: {microPauses.sentenceEndPause.toFixed(1)}</Label>
            </div>
            <Slider
              value={[microPauses.sentenceEndPause]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => handleUpdatePause('sentenceEndPause', value)}
            />
            <p className="text-xs text-muted-foreground">
              Pause after periods, exclamation or question marks
            </p>
          </div>

          {/* Other Punctuation Pause */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Other Punctuation: {microPauses.otherPunctuationPause.toFixed(1)}</Label>
            </div>
            <Slider
              value={[microPauses.otherPunctuationPause]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => handleUpdatePause('otherPunctuationPause', value)}
            />
            <p className="text-xs text-muted-foreground">
              Pause for commas, semicolons, colons, and parentheses
            </p>
          </div>

          {/* Paragraph Pause */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>New Paragraphs: {microPauses.paragraphPause.toFixed(1)}</Label>
            </div>
            <Slider
              value={[microPauses.paragraphPause]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => handleUpdatePause('paragraphPause', value)}
            />
            <p className="text-xs text-muted-foreground">
              Pause before starting a new paragraph
            </p>
          </div>

          {/* Long Word Pause */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Long Words: {microPauses.longWordPause.toFixed(1)}</Label>
            </div>
            <Slider
              value={[microPauses.longWordPause]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={([value]) => handleUpdatePause('longWordPause', value)}
            />
            <p className="text-xs text-muted-foreground">
              Extra time for words with 8+ characters
            </p>
          </div>
        </div>
      )}
    </div>
  );
}