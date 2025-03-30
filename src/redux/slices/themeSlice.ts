import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { COLOR_THEMES } from '@/utils/constants';
import { ColorTheme, ThemeColors } from '@/types';

interface ThemeState {
  theme: ColorTheme;
  customTheme: ColorTheme;
}

const initialState: ThemeState = {
  theme: COLOR_THEMES[0],
  customTheme: {
    name: 'Custom',
    light: {
      background: '#ffffff',
      foreground: '#374151',
      primary: '#dc2626',
      primaryForeground: '#ffffff',
    },
    dark: {
      background: '#111827',
      foreground: '#f3f4f6',
      primary: '#ef4444',
      primaryForeground: '#ffffff',
    }
  },
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.theme = action.payload;
    },
    handleThemeChange: (state, action: PayloadAction<string>) => {
      const themeName = action.payload;

      if (themeName === 'Custom') {
        state.theme = state.customTheme;
      } else {
        const newTheme = COLOR_THEMES.find(t => t.name === themeName) || COLOR_THEMES[0];
        state.theme = newTheme;
      }
    },
    updateCustomTheme: (
      state,
      action: PayloadAction<{ mode: 'light' | 'dark', property: keyof ThemeColors, value: string }>
    ) => {
      const { mode, property, value } = action.payload;

      // Type-safe way of updating properties
      switch (property) {
        case 'background':
          state.customTheme[mode].background = value;
          break;
        case 'foreground':
          state.customTheme[mode].foreground = value;
          break;
        case 'primary':
          state.customTheme[mode].primary = value;
          break;
        case 'primaryForeground':
          state.customTheme[mode].primaryForeground = value;
          break;
      }

      // If custom theme is active, update the current theme too
      if (state.theme.name === 'Custom') {
        switch (property) {
          case 'background':
            state.theme[mode].background = value;
            break;
          case 'foreground':
            state.theme[mode].foreground = value;
            break;
          case 'primary':
            state.theme[mode].primary = value;
            break;
          case 'primaryForeground':
            state.theme[mode].primaryForeground = value;
            break;
        }
      }
    },
    applyCustomTheme: (state) => {
      state.theme = state.customTheme;
    },
  },
});

export const {
  setTheme,
  handleThemeChange,
  updateCustomTheme,
  applyCustomTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
