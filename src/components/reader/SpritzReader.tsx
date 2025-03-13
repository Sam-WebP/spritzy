'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SpritzReaderProps } from '@/types';
import { DEFAULT_TEXT } from '@/utils/constants';
import { COLOR_THEMES } from '@/utils/constants';
import { updateTheme } from '@/redux/slices/settingsSlice';
import { setText, setWpm, processText, incrementWordIndex } from '@/redux/slices/readerSlice';

import WordDisplay from './WordDisplay';
import ReaderControls from './ReaderControls';
import SpeedControl from './SpeedControl';
import ProgressBar from './ProgressBar';
import TextInput from './TextInput';
import SettingsPanel from './SettingsPanel';
import { useInterval } from '@/hooks/useInterval';

export default function SpritzReader({
  initialWpm = 300,
  initialText = DEFAULT_TEXT,
  onThemeChange,
}: SpritzReaderProps) {
  const dispatch = useAppDispatch();
  const { isPlaying, wpm } = useAppSelector(state => state.reader);
  const { theme } = useAppSelector(state => state.settings);
  
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  
  // Initialize with props if provided
  useEffect(() => {
    dispatch(setText(initialText));
    dispatch(setWpm(initialWpm));
    dispatch(processText());
  }, [dispatch, initialText, initialWpm]);
  
  // Notify parent component about theme changes
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(theme);
    }
  }, [theme, onThemeChange]);

  // Reading interval
  useInterval(() => {
    if (isPlaying) {
      dispatch(incrementWordIndex());
    }
  }, isPlaying ? 60000 / wpm : null);
  
  return (
    <div 
      className="w-full max-w-2xl mx-auto p-4 rounded-lg shadow-md transition-colors duration-300"
      style={{ backgroundColor: theme.containerBackground }}
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div 
            className="text-center text-2xl font-semibold"
            style={{ color: theme.text }}
          >
            Spritz Reader
          </div>
          <button 
            onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
            className="px-3 py-1 rounded-md transition hover:opacity-80"
            style={{ color: theme.text }}
            aria-expanded={isSettingsPanelOpen}
          >
            ⚙️ Settings
          </button>
        </div>
        
        {/* Word Display */}
        <WordDisplay />
        
        {/* Settings Panel (conditionally rendered) */}
        {isSettingsPanelOpen && <SettingsPanel />}
        
        {/* Controls */}
        <ReaderControls />
        
        {/* WPM Slider */}
        <SpeedControl />
        
        {/* Progress indicator */}
        <ProgressBar />
      </div>
      
      {/* Text input */}
      <TextInput />
    </div>
  );
}