import { ChangeEvent } from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
  textColor?: string;
  showMinMax?: boolean;
}

export default function Slider({
  value,
  min,
  max,
  step,
  onChange,
  label,
  textColor = '#374151',
  showMinMax = false
}: SliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <label className="block text-sm font-medium" style={{ color: textColor }}>
          {label}: {value}
        </label>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        aria-label={label}
      />
      
      {showMinMax && (
        <div className="flex justify-between text-xs" style={{ color: textColor }}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}