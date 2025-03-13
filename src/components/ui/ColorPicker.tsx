import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  propertyName: string;
  displayName: string;
  onChange: (newColor: string) => void;
}

export default function ColorPicker({ color, propertyName, displayName, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-medium text-gray-700 capitalize">
          {displayName || propertyName.replace(/([A-Z])/g, ' $1')}
        </label>
        <div className="flex items-center">
          <div 
            className="w-6 h-6 rounded-md inline-block mr-2 cursor-pointer border border-gray-300"
            style={{ backgroundColor: color }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={`Select color for ${displayName || propertyName}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsOpen(!isOpen);
              }
            }}
          ></div>
          <span className="text-xs font-mono">{color}</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-2 p-2 bg-white rounded-md shadow-lg z-10">
          <HexColorPicker 
            color={color} 
            onChange={(newColor) => onChange(newColor)}
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="mt-2 px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 w-full"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}