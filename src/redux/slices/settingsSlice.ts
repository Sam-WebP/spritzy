import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReaderSettings, ColorTheme, FontOption } from '@/types';
import { DEFAULT_SETTINGS, FONT_OPTIONS, COLOR_THEMES } from '@/utils/constants';

const initialState: ReaderSettings = DEFAULT_SETTINGS;

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.theme = action.payload;
    },
    updateFont: (state, action: PayloadAction<string>) => {
      const font = FONT_OPTIONS.find(f => f.name === action.payload) || DEFAULT_SETTINGS.font;
      state.font = font;
    },
    toggleSetting: (state, action: PayloadAction<keyof ReaderSettings>) => {
      const setting = action.payload;
      if (typeof state[setting] === 'boolean') {
        // @ts-ignore - We've already checked that this is a boolean
        state[setting] = !state[setting];
      }
    },
    updateNumericSetting: (
      state, 
      action: PayloadAction<{setting: keyof ReaderSettings, value: number}>
    ) => {
      const { setting, value } = action.payload;
      if (typeof state[setting] === 'number') {
        // @ts-ignore - We've already checked that this is a number
        state[setting] = value;
      }
    },
    resetSettings: () => {
      return DEFAULT_SETTINGS;
    }
  },
});

export const {
  updateTheme,
  updateFont,
  toggleSetting,
  updateNumericSetting,
  resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;