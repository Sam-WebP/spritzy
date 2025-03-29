import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReaderSettings, MicroPauseSettings, CustomThemeColors } from '@/types';
import { DEFAULT_SETTINGS, FONT_OPTIONS, DEFAULT_MICRO_PAUSE_SETTINGS } from '@/utils/constants';
import { loadFromStorage, STORAGE_KEYS } from '@/utils/storage-utils';
import { getContrastColor } from '@/utils/theme-utils';

// Define default custom colors
const defaultCustomColors: CustomThemeColors = {
  light: {
    background: '#ffffff',
    foreground: '#111827',
    primary: '#3b82f6',
    primaryForeground: getContrastColor('#3b82f6'),
  },
  dark: {
    background: '#111827',
    foreground: '#f3f4f6',
    primary: '#60a5fa',
    primaryForeground: getContrastColor('#60a5fa'),
  }
};

// Load saved settings
const savedSettings = loadFromStorage<Partial<ReaderSettings>>(
  STORAGE_KEYS.APP_SETTINGS,
  {}
);

const initialState: ReaderSettings = {
  ...DEFAULT_SETTINGS,
  focusModeActive: false,
  autoHideFocusControls: true,
  // Override with any saved settings
  ...savedSettings,
  // Merge saved custom colors with defaults
  customThemeColors: {
    light: {
      ...defaultCustomColors.light,
      ...(savedSettings.customThemeColors?.light || {}),
    },
    dark: {
      ...defaultCustomColors.dark,
      ...(savedSettings.customThemeColors?.dark || {}),
    },
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateFont: (
      state,
      action: PayloadAction<{ type: 'normal' | 'focus', name: string }>
    ) => {
      const { type, name } = action.payload;
      const font = FONT_OPTIONS.find(f => f.name === name) || DEFAULT_SETTINGS.font;

      if (type === 'normal') {
        state.font = font;
      } else {
        state.focusModeFont = font;
      }
    },
    toggleSetting: (state, action: PayloadAction<keyof ReaderSettings>) => {
      const setting = action.payload;
      if (setting === 'focusModeActive' || setting === 'autoHideFocusControls') {
        state[setting] = !state[setting];
      }
    },
    updateNumericSetting: (
      state,
      action: PayloadAction<{ setting: 'fontSize' | 'letterSpacing', value: number }>
    ) => {
      const { setting, value } = action.payload;
      state[setting] = value;
    },
    setColorScheme: (state, action: PayloadAction<string>) => {
      state.colorScheme = action.payload;
    },
    toggleMicroPauses: (state) => {
      state.microPauses.enableMicroPauses = !state.microPauses.enableMicroPauses;
    },
    updateMicroPause: (
      state,
      action: PayloadAction<{ setting: keyof Omit<MicroPauseSettings, 'enableMicroPauses' | 'stackPauses'>, value: number }>
    ) => {
      const { setting, value } = action.payload;
      state.microPauses[setting] = value;
    },
    toggleStackPauses: (state) => {
      state.microPauses.stackPauses = !state.microPauses.stackPauses;
    },
    toggleFocusMode: (state) => {
      state.focusModeActive = !state.focusModeActive;
    },
    toggleFocusControlsHiding: (state) => {
      state.autoHideFocusControls = !state.autoHideFocusControls;
    },
    updateCustomColor: (
      state,
      action: PayloadAction<{
        mode: 'light' | 'dark';
        property: 'background' | 'foreground' | 'primary';
        value: string;
      }>
    ) => {
      const { mode, property, value } = action.payload;
      if (state.customThemeColors[mode]) {
        state.customThemeColors[mode][property] = value;
        if (property === 'primary') {
          state.customThemeColors[mode].primaryForeground = getContrastColor(value);
        }
      }
    },
    resetSettings: () => {
      return {
        ...DEFAULT_SETTINGS,
        microPauses: DEFAULT_MICRO_PAUSE_SETTINGS,
        customThemeColors: {
          light: { ...defaultCustomColors.light },
          dark: { ...defaultCustomColors.dark }
        },
      };
    },
  },
});

export const {
  updateFont,
  toggleSetting,
  updateNumericSetting,
  setColorScheme,
  resetSettings,
  toggleMicroPauses,
  toggleStackPauses,
  updateMicroPause,
  toggleFocusMode,
  toggleFocusControlsHiding,
  updateCustomColor,
} = settingsSlice.actions;

export default settingsSlice.reducer;
