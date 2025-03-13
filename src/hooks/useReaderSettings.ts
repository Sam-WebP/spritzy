import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_SETTINGS, FONT_OPTIONS } from '@/utils/constants';
import { ReaderSettings, ColorTheme, FontOption } from '@/types';

interface UseReaderSettingsReturn {
  settings: ReaderSettings;
  updateTheme: (theme: ColorTheme) => void;
  updateFont: (fontName: string) => void;
  toggleSetting: (setting: keyof ReaderSettings) => void;
  updateNumericSetting: (setting: keyof ReaderSettings, value: number) => void;
  resetSettings: () => void;
}

export function useReaderSettings(
  onThemeChange?: (theme: ColorTheme) => void
): UseReaderSettingsReturn {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);

  const updateTheme = useCallback((theme: ColorTheme) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  // Notify parent component about theme changes
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(settings.theme);
    }
  }, [settings.theme, onThemeChange]);

  const updateFont = useCallback((fontName: string) => {
    const font = FONT_OPTIONS.find(f => f.name === fontName) || DEFAULT_SETTINGS.font;
    setSettings(prev => ({ ...prev, font }));
  }, []);

  const toggleSetting = useCallback((setting: keyof ReaderSettings) => {
    if (typeof settings[setting] === 'boolean') {
      setSettings(prev => ({ 
        ...prev, 
        [setting]: !prev[setting as keyof ReaderSettings] 
      }));
    }
  }, []);

  const updateNumericSetting = useCallback((setting: keyof ReaderSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateTheme,
    updateFont,
    toggleSetting,
    updateNumericSetting,
    resetSettings
  };
}