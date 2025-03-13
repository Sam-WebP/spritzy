'use client';

import { useState } from 'react';
import { SpritzReaderProps } from '@/types';
import { DEFAULT_TEXT } from '@/utils/constants';
import { useReader } from '@/hooks/useReader';
import { useTheme } from '@/hooks/useTheme';
import { useReaderSettings } from '@/hooks/useReaderSettings';

import WordDisplay from './WordDisplay';
import ReaderControls from './ReaderControls';
import SpeedControl from './SpeedControl';
import ProgressBar from './ProgressBar';
import TextInput from './TextInput';
import SettingsPanel from './SettingsPanel';

export default function SpritzReader({
  initialWpm = 300,
  initialText = DEFAULT_TEXT,
  onThemeChange,
}: SpritzReaderProps) {
  // Use custom hooks to separate logic
  const reader = useReader(initialText, initialWpm);
  const { 
    theme, 
    customTheme, 
    handleThemeChange, 
    updateCustomTheme,
    applyCustomTheme 
  } = useTheme(undefined, onThemeChange);
  const {
    settings,
    updateTheme,
    updateFont,
    toggleSetting,
    updateNumericSetting,
    resetSettings
  } = useReaderSettings(onThemeChange);

  // Local component state
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  // Handle applying theme changes
  const handleApplyTheme = (themeName: string) => {
    handleThemeChange(themeName);
    const selectedTheme = theme;
    updateTheme(selectedTheme);
  };
  
  return (
    <div 
      className="w-full max-w-2xl mx-auto p-4 rounded-lg shadow-md transition-colors duration-300"
      style={{ backgroundColor: settings.theme.containerBackground }}
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div 
            className="text-center text-2xl font-semibold"
            style={{ color: settings.theme.text }}
          >
            Spritz Reader
          </div>
          <button 
            onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
            className="px-3 py-1 rounded-md transition hover:opacity-80"
            style={{ color: settings.theme.text }}
            aria-expanded={isSettingsPanelOpen}
          >
            ⚙️ Settings
          </button>
        </div>
        
        {/* Word Display */}
        <WordDisplay currentWord={reader.currentWord} settings={settings} />
        
        {/* Settings Panel (conditionally rendered) */}
        {isSettingsPanelOpen && (
          <SettingsPanel
            settings={settings}
            theme={settings.theme}
            customTheme={customTheme}
            highlightPattern={reader.highlightPattern}
            onThemeChange={handleApplyTheme}
            onUpdateCustomTheme={updateCustomTheme}
            onApplyCustomTheme={applyCustomTheme}
            onFontChange={updateFont}
            onToggleSetting={toggleSetting}
            onNumericSettingChange={updateNumericSetting}
            onHighlightPatternChange={reader.setHighlightPattern}
            onResetSettings={resetSettings}
          />
        )}
        
        {/* Controls */}
        <ReaderControls
          isPlaying={reader.isPlaying}
          onStart={reader.startReading}
          onPause={reader.pauseReading}
          onReset={reader.resetReading}
        />
        
        {/* WPM Slider */}
        <SpeedControl
          wpm={reader.wpm}
          onWpmChange={reader.setWpm}
          theme={settings.theme}
        />
        
        {/* Progress indicator */}
        <ProgressBar
          current={reader.currentWordIndex}
          total={reader.words.length}
          theme={settings.theme}
        />
      </div>
      
      {/* Text input */}
      <TextInput
        text={reader.text}
        onTextChange={reader.setText}
        onProcess={reader.processText}
        theme={settings.theme}
      />
    </div>
  );
}