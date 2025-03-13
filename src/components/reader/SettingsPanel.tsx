import { useState } from 'react';
import { ReaderSettings, ColorTheme, HighlightPattern } from '@/types';
import { COLOR_THEMES, FONT_OPTIONS, DEFAULT_HIGHLIGHT_PATTERN } from '@/utils/constants';
import { parsePatternString } from '@/utils/color-utils';
import { getContrastColor } from '@/utils/color-utils';
import ColorPicker from '@/components/ui/ColorPicker';
import Toggle from '@/components/ui/Toggle';
import Slider from '@/components/ui/Slider';

interface SettingsPanelProps {
  settings: ReaderSettings;
  theme: ColorTheme;
  customTheme: ColorTheme;
  highlightPattern: HighlightPattern;
  onThemeChange: (themeName: string) => void;
  onUpdateCustomTheme: (property: keyof ColorTheme, value: string) => void;
  onApplyCustomTheme: () => void;
  onFontChange: (fontName: string) => void;
  onToggleSetting: (setting: keyof ReaderSettings) => void;
  onNumericSettingChange: (setting: keyof ReaderSettings, value: number) => void;
  onHighlightPatternChange: (pattern: HighlightPattern) => void; 
  onResetSettings: () => void;
}

export default function SettingsPanel({ 
  settings,
  theme,
  customTheme,
  highlightPattern,
  onThemeChange,
  onUpdateCustomTheme,
  onApplyCustomTheme,
  onFontChange,
  onToggleSetting,
  onNumericSettingChange,
  onHighlightPatternChange,
  onResetSettings
}: SettingsPanelProps) {
  const [isCustomThemeOpen, setIsCustomThemeOpen] = useState<boolean>(false);
  const [isPatternEditorOpen, setIsPatternEditorOpen] = useState<boolean>(false);
  const [newPattern, setNewPattern] = useState<string>('');

  // Open pattern editor with current pattern formatted
  const openPatternEditor = () => {
    const formattedPattern = highlightPattern
      .map(rule => `${rule.maxLength}:${rule.highlightIndex}`)
      .join(', ');
    setNewPattern(formattedPattern);
    setIsPatternEditorOpen(true);
  };

  // Handle applying a new highlight pattern
  const handleApplyPattern = () => {
    try {
      const patternRules = parsePatternString(newPattern);
      onHighlightPatternChange(patternRules);
      setIsPatternEditorOpen(false);
    } catch (error) {
      alert('Invalid pattern format. Please use the format "maxLength:highlightIndex" separated by commas.');
    }
  };

  // Reset to default pattern
  const handleResetPattern = () => {
    onHighlightPatternChange(DEFAULT_HIGHLIGHT_PATTERN);
    setIsPatternEditorOpen(false);
  };

  return (
    <div 
      className="mb-6 p-4 border rounded-lg"
      style={{ backgroundColor: theme.wordBackground }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium" style={{ color: theme.text }}>
          Reader Settings
        </h3>
        <button 
          onClick={onResetSettings}
          className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Color Theme */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
          Color Theme
        </label>
        <div className="flex flex-wrap gap-2">
          {[...COLOR_THEMES, { ...customTheme }].map(theme => (
            <button
              key={theme.name}
              className={`px-3 py-1 text-sm rounded-md transition ${
                settings.theme.name === theme.name 
                  ? 'ring-2 ring-blue-500' 
                  : ''
              }`}
              style={{ 
                backgroundColor: theme.background, 
                color: getContrastColor(theme.background)
              }}
              onClick={() => onThemeChange(theme.name)}
              aria-pressed={settings.theme.name === theme.name}
            >
              {theme.name}
            </button>
          ))}
          <button
            className="px-3 py-1 text-sm rounded-md transition bg-gray-200 text-gray-800"
            onClick={() => setIsCustomThemeOpen(!isCustomThemeOpen)}
            aria-expanded={isCustomThemeOpen}
          >
            {isCustomThemeOpen ? 'Hide Editor' : 'Create Custom Theme'}
          </button>
        </div>
      </div>

      {/* Custom Theme Builder */}
      {isCustomThemeOpen && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Custom Theme Builder</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(customTheme)
              .filter(([key]) => key !== 'name')
              .map(([key, value]) => (
                <ColorPicker
                  key={key}
                  propertyName={key}
                  displayName={key.replace(/([A-Z])/g, ' $1')}
                  color={value as string}
                  onChange={(newColor) => onUpdateCustomTheme(key as keyof ColorTheme, newColor)}
                />
              ))}
          </div>
          
          <div className="flex gap-2 mt-3">
            <button 
              onClick={onApplyCustomTheme}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Apply Custom Theme
            </button>
            <button 
              onClick={() => setIsCustomThemeOpen(false)}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Font Family */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
          Font Family
        </label>
        <div className="flex gap-2">
          {FONT_OPTIONS.map(font => (
            <button
              key={font.name}
              className={`px-3 py-1 text-sm rounded-md transition ${
                settings.font.name === font.name 
                  ? 'ring-2 ring-blue-500 bg-opacity-20' 
                  : 'bg-gray-200 text-gray-800'
              } ${font.className}`}
              onClick={() => onFontChange(font.name)}
              aria-pressed={settings.font.name === font.name}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <Slider 
        value={settings.fontSize}
        min={12}
        max={48}
        step={1}
        onChange={(value) => onNumericSettingChange('fontSize', value)}
        label={`Font Size: ${settings.fontSize}px`}
        textColor={theme.text}
      />

      {/* Letter Spacing */}
      <Slider
        value={settings.letterSpacing}
        min={0}
        max={10}
        step={0.5}
        onChange={(value) => onNumericSettingChange('letterSpacing', value)}
        label={`Letter Spacing: ${settings.letterSpacing}px`}
        textColor={theme.text}
      />

      {/* Toggle Options */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Toggle
          id="show-focus"
          checked={settings.showFocusLetter}
          onChange={() => onToggleSetting('showFocusLetter')}
          label="Highlight Focus Letter"
          textColor={theme.text}
        />
        <Toggle
          id="show-border"
          checked={settings.showFocusBorder}
          onChange={() => onToggleSetting('showFocusBorder')}
          label="Show Focus Border"
          textColor={theme.text}
        />
      </div>

      {/* Highlight Pattern Settings */}
      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium" style={{ color: theme.text }}>
            Highlight Pattern
          </span>
          <button 
            onClick={openPatternEditor}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Customize Pattern
          </button>
        </div>
        
        {isPatternEditorOpen && (
          <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">
              Format: "maxLength:highlightIndex" separated by commas<br/>
              Example: "4:0, 6:1, 8:2, 10:3" means:
              <br/>- Words up to 4 chars: highlight 1st letter (index 0)
              <br/>- Words 5-6 chars: highlight 2nd letter (index 1)
              <br/>- etc.
            </p>
            <input 
              type="text" 
              value={newPattern} 
              onChange={(e) => setNewPattern(e.target.value)}
              placeholder="4:0, 6:1, 8:2, 10:3, ..."
              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
              aria-label="Enter highlight pattern"
            />
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={handleApplyPattern}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Apply Pattern
              </button>
              <button 
                onClick={handleResetPattern}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Reset to Default
              </button>
              <button 
                onClick={() => setIsPatternEditorOpen(false)}
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}