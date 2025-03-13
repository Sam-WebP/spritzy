import { ColorTheme } from '@/types';
import Slider from '@/components/ui/Slider';

interface SpeedControlProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
  theme: ColorTheme;
}

export default function SpeedControl({ wpm, onWpmChange, theme }: SpeedControlProps) {
  return (
    <Slider
      value={wpm}
      min={100}
      max={1000}
      step={10}
      onChange={onWpmChange}
      label={`Reading Speed: ${wpm} WPM`}
      textColor={theme.text}
      showMinMax={true}
    />
  );
}