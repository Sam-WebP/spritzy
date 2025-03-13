import { ChangeEvent } from 'react';
import { ColorTheme } from '@/types';

interface TextInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onProcess: () => void;
  theme: ColorTheme;
}

export default function TextInput({ text, onTextChange, onProcess, theme }: TextInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  return (
    <div>
      <label 
        htmlFor="text-input" 
        className="block text-sm font-medium mb-1" 
        style={{ color: theme.text }}
      >
        Text to Read
      </label>
      <textarea 
        id="text-input"
        value={text} 
        onChange={handleChange}
        rows={5} 
        style={{ 
          backgroundColor: theme.wordBackground, 
          color: theme.text,
          borderColor: 'rgba(0,0,0,0.2)' 
        }}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter or paste text to read..."
      />
      <button 
        onClick={onProcess}
        className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
      >
        Update Text
      </button>
    </div>
  );
}