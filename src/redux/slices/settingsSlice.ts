import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReaderSettings } from '@/types';
import { DEFAULT_SETTINGS, FONT_OPTIONS } from '@/utils/constants';

const initialState: ReaderSettings = {
  ...DEFAULT_SETTINGS,
  colorScheme: 'Red', // Default color scheme
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateFont: (state, action: PayloadAction<string>) => {
      const font = FONT_OPTIONS.find(f => f.name === action.payload) || DEFAULT_SETTINGS.font;
      state.font = font;
    },
    toggleSetting: (state, action: PayloadAction<keyof ReaderSettings>) => {
      const setting = action.payload;
      if (typeof state[setting] === 'boolean') {
        // @ts-expect-error - We've already checked that this is a boolean
        state[setting] = !state[setting];
      }
    },
    updateNumericSetting: (
      state, 
      action: PayloadAction<{setting: keyof ReaderSettings, value: number}>
    ) => {
      const { setting, value } = action.payload;
      if (typeof state[setting] === 'number') {
        // @ts-expect-error - We've already checked that this is a number
        state[setting] = value;
      }
    },
    setColorScheme: (state, action: PayloadAction<string>) => {
      state.colorScheme = action.payload;
    },
    resetSettings: () => {
      return {
        ...DEFAULT_SETTINGS,
        colorScheme: 'Red',
      };
    }
  },
});

export const {
  updateFont,
  toggleSetting,
  updateNumericSetting,
  setColorScheme,
  resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;