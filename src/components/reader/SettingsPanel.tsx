import { useState } from 'react';
import { ReaderSettings, ColorTheme, HighlightPattern } from '@/types';
import { COLOR_THEMES, FONT_OPTIONS, DEFAULT_HIGHLIGHT_PATTERN } from '@/utils/constants';
import { parsePatternString, getContrastColor, hexToRgba } from '@/utils/color-utils';
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
  onFontChange,
  onToggleSetting,
  onNumericSettingChange,
  onHighlightPatternChange,
  onResetSettings
}: SettingsPanelProps) {
  const [isPatternEditorOpen, setIsPatternEditorOpen] = useState<boolean>(false);
  const [newPattern, setNewPattern] = useState<string>('');

  const openPatternEditor = () => {
    const formattedPattern = highlightPattern
      .map(rule => `${rule.maxLength}:${rule.highlightIndex}`)
      .join(', ');
    setNewPattern(formattedPattern);
    setIsPatternEditorOpen(true);
  };

  const handleApplyPattern = () => {
    try {
      const patternRules = parsePatternString(newPattern);
      onHighlightPatternChange(patternRules);
      setIsPatternEditorOpen(false);
    } catch (error) {
      alert('Invalid pattern format. Please use the format "maxLength:highlightIndex" separated by commas.');
    }
  };

  const handleResetPattern = () => {
    onHighlightPatternChange(DEFAULT_HIGHLIGHT_PATTERN);
    setIsPatternEditorOpen(false);
  };

  return (
    <div 
      className="mb-6 p-4 rounded-lg"
      style={{ 
        backgroundColor: theme.wordBackground,
        border: `1px solid ${hexToRgba(theme.text, 0.1)}`
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium" style={{ color: theme.text }}>
          Reader Settings
        </h3>
        <button 
          onClick={onResetSettings}
          className="text-sm px-2 py-1 rounded transition"
          style={{
            backgroundColor: theme.background,
            color: getContrastColor(theme.background),
            border: `1px solid ${hexToRgba(theme.text, 0.1)}`
          }}
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
          {[...COLOR_THEMES, { ...customTheme }].map(themeOption => (
            <button
              key={themeOption.name}
              className={`px-3 py-1 text-sm rounded-md transition ${
                settings.theme.name === themeOption.name 
                  ? 'ring-2 ring-offset-2' 
                  : ''
              }`}
              style={{ 
                backgroundColor: themeOption.background,
                color: getContrastColor(themeOption.background),
                border: `1px solid ${hexToRgba(getContrastColor(themeOption.background), 0.1)}`,
                ringColor: theme.highlightText,
                boxShadow: settings.theme.name === themeOption.name ? `0 0 0 2px ${theme.highlightText}` : 'none'
              }}
              onClick={() => onThemeChange(themeOption.name)}
              aria-pressed={settings.theme.name === themeOption.name}
            >
              {themeOption.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme Editor - Visible automatically when Custom theme is selected */}
      {settings.theme.name === 'Custom' && (
        <div 
          className="mb-4 p-3 rounded-lg"
          style={{ 
            backgroundColor: theme.wordBackground,
            border: `1px solid ${hexToRgba(theme.text, 0.1)}`
          }}
        >
          <h4 className="text-sm font-medium mb-2" style={{ color: theme.text }}>
            Custom Theme Editor
          </h4>
          
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
                  ? 'ring-2 ring-offset-2' 
                  : ''
              } ${font.className}`}
              style={{
                backgroundColor: theme.background,
                color: getContrastColor(theme.background),
                border: `1px solid ${hexToRgba(theme.text, 0.1)}`,
                ringColor: theme.highlightText,
                boxShadow: settings.font.name === font.name ? `0 0 0 2px ${theme.highlightText}` : 'none'
              }}
              onClick={() => onFontChange(font.name)}
              aria-pressed={settings.font.name === font.name}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rest of the settings components remain the same */}
      {/* Font Size */}
      <Slider 
        value={settings.fontSize}
        min={12}
        max={48}
        step={1}
        onChange={(value) => onNumericSettingChange('fontSize', value)}
        label={`Font Size: ${settings.fontSize}px`}
        textColor={theme.text}
        accentColor={theme.highlightText}
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
        accentColor={theme.highlightText}
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
            className="px-3 py-1 text-xs rounded transition"
            style={{
              backgroundColor: theme.background,
              color: getContrastColor(theme.background),
              border: `1px solid ${hexToRgba(theme.text, 0.1)}`
            }}
          >
            Customize Pattern
          </button>
        </div>
        
        {isPatternEditorOpen && (
          <div 
            className="mt-3 p-3 rounded-lg"
            style={{ 
              backgroundColor: theme.wordBackground,
              border: `1px solid ${hexToRgba(theme.text, 0.1)}`
            }}
          >
            <p className="text-sm mb-2" style={{ color: theme.text }}>
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
              className="w-full px-3 py-2 mb-2 rounded-md"
              style={{
                backgroundColor: theme.background,
                color: getContrastColor(theme.background),
                border: `1px solid ${hexToRgba(theme.text, 0.1)}`
              }}
              aria-label="Enter highlight pattern"
            />
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={handleApplyPattern}
                className="px-3 py-1 rounded transition"
                style={{
                  backgroundColor: theme.highlightText,
                  color: getContrastColor(theme.highlightText)
                }}
              >
                Apply Pattern
              </button>
              <button 
                onClick={handleResetPattern}
                className="px-3 py-1 rounded transition"
                style={{
                  backgroundColor: theme.background,
                  color: getContrastColor(theme.background),
                  border: `1px solid ${hexToRgba(theme.text, 0.1)}`
                }}
              >
                Reset to Default
              </button>
              <button 
                onClick={() => setIsPatternEditorOpen(false)}
                className="px-3 py-1 rounded transition"
                style={{
                  backgroundColor: theme.background,
                  color: getContrastColor(theme.background),
                  border: `1px solid ${hexToRgba(theme.text, 0.1)}`
                }}
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