import { ColorTheme, FontOption, HighlightPattern, ReaderSettings, MicroPauseSettings } from '@/types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Red',
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
  {
    name: 'Yellow',
    light: {
      background: '#fefce8',
      foreground: '#422006',
      primary: '#ca8a04',
      primaryForeground: '#000000',
    },
    dark: {
      background: '#1f2937',
      foreground: '#e5e7eb',
      primary: '#facc15',
      primaryForeground: '#000000',
    }
  },
  {
    name: 'Blue',
    light: {
      background: '#eff6ff',
      foreground: '#1e3a8a',
      primary: '#2563eb',
      primaryForeground: '#ffffff',
    },
    dark: {
      background: '#0f172a',
      foreground: '#e2e8f0',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
    }
  },
];

export const FONT_OPTIONS: FontOption[] = [
  { name: 'Mono', className: 'font-mono' },
  { name: 'Sans', className: 'font-sans' },
  { name: 'Serif', className: 'font-serif' },
  { name: 'Georgia', className: 'font-georgia' },
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

export const DEFAULT_MICRO_PAUSE_SETTINGS: MicroPauseSettings = {
  enableMicroPauses: true,
  stackPauses: false,
  largeNumbersPause: 0.5,
  sentenceEndPause: 1.1,
  otherPunctuationPause: 0.9,
  paragraphPause: 1.1,
  longWordPause: 0.5,
};

export const DEFAULT_SETTINGS: ReaderSettings = {
  font: FONT_OPTIONS[0],
  customThemeColors: {
    light: COLOR_THEMES[0].light,
    dark: COLOR_THEMES[0].dark
  },
  showFocusLetter: true,
  letterSpacing: 0,
  fontSize: 24,
  focusModeFont: FONT_OPTIONS[2],
  focusModeFontSize: 48,
  focusModeLetterSpacing: 0,
  showFocusBorder: true,
  colorScheme: 'Blue',
  microPauses: DEFAULT_MICRO_PAUSE_SETTINGS,
  focusModeActive: false,
  autoHideFocusControls: true,
};

export const DEFAULT_TEXT = `Welcome to Spritzy, your gateway to enhanced reading speed and comprehension! Spritzy utilises the innovative Spritz reading method, a scientifically backed technique designed to significantly boost your reading efficiency. Whether you're consuming articles, studying material, or reviewing documents, Spritzy can help you process information 2-4x faster than conventional reading while maintaining strong comprehension.

The highlighted character ensures optimal recognition of words of varying lengths. Paired with custom micro-pauses that automatically adjust pace for punctuation and complex terms, this creates a natural, fluid reading experience.

Everyone reads differently; Spritzy is highly customisable, allowing you to tweak every setting to your precise liking, from speed and word highlighting to font and theme colors.

Elevate your focus further with Focus Mode, an immersive full-screen experience that blocks distractions. After reading, challenge your retention with AI-generated quizzes based on your text, solidifying key concepts in seconds.

Get ready to experience reading in a whole new way - faster, more efficient, and more engaging with Spritzy!`;
