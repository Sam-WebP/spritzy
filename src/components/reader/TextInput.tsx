'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setText, processText } from '@/redux/slices/readerSlice';
import { COLOR_THEMES } from '@/utils/constants';

export default function TextInput() {
  const dispatch = useAppDispatch();
  const text = useAppSelector(state => state.reader.text);
  const { theme } = useAppSelector(state => state.settings);
  
  // Use a fallback theme in case theme is undefined
  const safeTheme = theme || COLOR_THEMES[0];

  return (
    <div>
      <label 
        htmlFor="text-input" 
        className="block text-sm font-medium mb-1" 
        style={{ color: safeTheme.text }}
      >
        Text to Read
      </label>
      <textarea 
        id="text-input"
        value={text} 
        onChange={(e) => dispatch(setText(e.target.value))}
        rows={5} 
        style={{ 
          backgroundColor: safeTheme.wordBackground, 
          color: safeTheme.text,
          borderColor: 'rgba(0,0,0,0.2)' 
        }}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter or paste text to read..."
      />
      <button 
        onClick={() => dispatch(processText())}
        className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
      >
        Update Text
      </button>
    </div>
  );
}