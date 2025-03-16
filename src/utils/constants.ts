import { ColorTheme, FontOption, HighlightPattern, ReaderSettings, MicroPauseSettings } from '@/types';

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
  theme: COLOR_THEMES[0],
  font: FONT_OPTIONS[0],
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