'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setWpm } from '@/redux/slices/readerSlice';
import Slider from '@/components/ui/Slider';

export default function SpeedControl() {
  const dispatch = useAppDispatch();
  const wpm = useAppSelector(state => state.reader.wpm);
  const { theme } = useAppSelector(state => state.settings);
  
  return (
    <Slider
      value={wpm}
      min={100}
      max={1000}
      step={10}
      onChange={(value) => dispatch(setWpm(value))}
      label={`Reading Speed: ${wpm} WPM`}
      textColor={theme.text}
      showMinMax={true}
      accentColor={theme.highlightText}
    />
  );
}