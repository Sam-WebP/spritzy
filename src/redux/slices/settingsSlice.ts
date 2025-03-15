import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReaderSettings, MicroPauseSettings } from '@/types';
import { DEFAULT_SETTINGS, FONT_OPTIONS, DEFAULT_MICRO_PAUSE_SETTINGS } from '@/utils/constants';

const initialState: ReaderSettings = {
  ...DEFAULT_SETTINGS,
  focusModeActive: false,
  autoHideFocusControls: true,
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
    toggleMicroPauses: (state) => {
      state.microPauses.enableMicroPauses = !state.microPauses.enableMicroPauses;
    },
    updateMicroPause: (
      state,
      action: PayloadAction<{setting: keyof MicroPauseSettings, value: number}>
    ) => {
      const { setting, value } = action.payload;
      if (setting !== 'enableMicroPauses') {
        // @ts-expect-error - We know these are number settings
        state.microPauses[setting] = value;
      }
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
    resetSettings: () => {
      return {
        ...DEFAULT_SETTINGS,
        microPauses: DEFAULT_MICRO_PAUSE_SETTINGS,
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
} = settingsSlice.actions;

export default settingsSlice.reducer;