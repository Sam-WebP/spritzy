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
      text: '#374151',
      highlightText: '#dc2626',
      highlightBorder: '#dc2626',
    },
    dark: {
      background: '#111827',
      text: '#f3f4f6',
      highlightText: '#ef4444',
      highlightBorder: '#ef4444',
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
      action: PayloadAction<{mode: 'light' | 'dark', property: keyof ThemeColors, value: string}>
    ) => {
      const { mode, property, value } = action.payload;
      
      // Type-safe way of updating properties
      switch (property) {
        case 'background':
          state.customTheme[mode].background = value;
          break;
        case 'text':
          state.customTheme[mode].text = value;
          break;
        case 'highlightText':
          state.customTheme[mode].highlightText = value;
          break;
        case 'highlightBorder':
          state.customTheme[mode].highlightBorder = value;
          break;
      }
      
      // If custom theme is active, update the current theme too
      if (state.theme.name === 'Custom') {
        switch (property) {
          case 'background':
            state.theme[mode].background = value;
            break;
          case 'text':
            state.theme[mode].text = value;
            break;
          case 'highlightText':
            state.theme[mode].highlightText = value;
            break;
          case 'highlightBorder':
            state.theme[mode].highlightBorder = value;
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