import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { COLOR_THEMES } from '@/utils/constants';
import { ColorTheme } from '@/types';

interface ThemeState {
  theme: ColorTheme;
  customTheme: ColorTheme;
}

const initialState: ThemeState = {
  theme: COLOR_THEMES[0],
  customTheme: {
    name: 'Custom',
    background: '#ffffff',
    containerBackground: '#ffffff',
    text: '#374151',
    highlightText: '#dc2626',
    highlightBorder: '#dc2626',
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
      action: PayloadAction<{property: keyof ColorTheme, value: string}>
    ) => {
      const { property, value } = action.payload;
      state.customTheme = {
        ...state.customTheme,
        [property]: value
      };
      
      // If custom theme is active, update the current theme
      if (state.theme.name === 'Custom') {
        state.theme = {
          ...state.theme,
          [property]: value
        };
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