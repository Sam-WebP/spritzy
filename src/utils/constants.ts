import { ColorTheme, FontOption, HighlightPattern, ReaderSettings } from '@/types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Red',
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
  {
    name: 'Yellow',
    light: {
      background: '#fefce8',
      text: '#422006',
      highlightText: '#ca8a04',
      highlightBorder: '#ca8a04',
    },
    dark: {
      background: '#1f2937', 
      text: '#e5e7eb',
      highlightText: '#facc15',
      highlightBorder: '#facc15',
    }
  },
  {
    name: 'Blue',
    light: {
      background: '#eff6ff',
      text: '#1e3a8a',
      highlightText: '#2563eb',
      highlightBorder: '#2563eb',
    },
    dark: {
      background: '#0f172a',
      text: '#e2e8f0',
      highlightText: '#3b82f6',
      highlightBorder: '#3b82f6',
    }
  },
];

export const FONT_OPTIONS: FontOption[] = [
  { name: 'Mono', className: 'font-mono' },
  { name: 'Sans', className: 'font-sans' },
  { name: 'Serif', className: 'font-serif' },
];

export const DEFAULT_HIGHLIGHT_PATTERN: HighlightPattern = [
  { maxLength: 4, highlightIndex: 0 },
  { maxLength: 6, highlightIndex: 1 },
  { maxLength: 8, highlightIndex: 2 },
  { maxLength: 10, highlightIndex: 3 },
  { maxLength: 12, highlightIndex: 4 },
  { maxLength: 14, highlightIndex: 5 },
  { maxLength: 16, highlightIndex: 6 },
  { maxLength: 18, highlightIndex: 7 },
  { maxLength: 20, highlightIndex: 8 },
];

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: COLOR_THEMES[0],
  font: FONT_OPTIONS[0],
  showFocusLetter: true,
  letterSpacing: 0,
  fontSize: 24,
  showFocusBorder: true,
  colorScheme: 'Red',
};

export const DEFAULT_TEXT = "Welcome to the Spritz reader. This text will be displayed one word at a time with the focus point highlighted to help you read faster. Adjust the speed using the slider below.";