import { ColorTheme, FontOption, HighlightPattern, ReaderSettings } from '@/types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Red',
    background: '#ffffff',
    containerBackground: '#ffffff',
    text: '#374151',
    highlightText: '#dc2626',
    highlightBorder: '#dc2626',
    wordBackground: '#f9fafb',
  },
  {
    name: 'Yellow',
    background: '#1f2937',
    containerBackground: '#1f2937',
    text: '#e5e7eb',
    highlightText: '#facc15',
    highlightBorder: '#facc15',
    wordBackground: '#374151',
  },
  {
    name: 'Sepia',
    background: '#fffbeb',
    containerBackground: '#fffbeb',
    text: '#78350f',
    highlightText: '#9a3412',
    highlightBorder: '#9a3412',
    wordBackground: '#fef3c7',
  },
  {
    name: 'Blue',
    background: '#eff6ff',
    containerBackground: '#eff6ff',
    text: '#1e3a8a',
    highlightText: '#2563eb',
    highlightBorder: '#2563eb',
    wordBackground: '#dbeafe',
  },
  {
    name: 'Green',
    background: '#ecfdf5',
    containerBackground: '#ecfdf5',
    text: '#065f46',
    highlightText: '#10b981',
    highlightBorder: '#10b981',
    wordBackground: '#d1fae5',
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
};

export const DEFAULT_TEXT = "Welcome to the Spritz reader. This text will be displayed one word at a time with the focus point highlighted to help you read faster. Adjust the speed using the slider below.";