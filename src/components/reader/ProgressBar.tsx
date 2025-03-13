import { ColorTheme } from '@/types';

interface ProgressBarProps {
  current: number;
  total: number;
  theme: ColorTheme;
}

export default function ProgressBar({ current, total, theme }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="mb-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-200" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        ></div>
      </div>
      <div className="text-xs text-right mt-1" style={{ color: theme.text }}>
        {current + 1}/{total} words
      </div>
    </div>
  );
}