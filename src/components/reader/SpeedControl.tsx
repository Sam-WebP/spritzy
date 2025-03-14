'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setWpm } from '@/redux/slices/readerSlice';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function SpeedControl() {
  const dispatch = useAppDispatch();
  const wpm = useAppSelector(state => state.reader.wpm);
  
  return (
    <div className="space-y-2 mb-6">
      <div className="flex justify-between items-center">
        <Label>Reading Speed: {wpm} WPM</Label>
      </div>
      <Slider
        value={[wpm]}
        min={100}
        max={1000}
        step={10}
        onValueChange={([value]) => dispatch(setWpm(value))}
        aria-label="Adjust reading speed"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>100</span>
        <span>1000</span>
      </div>
    </div>
  );
}