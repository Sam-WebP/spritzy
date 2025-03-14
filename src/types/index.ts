export interface HighlightRule {
  maxLength: number;
  highlightIndex: number;
}

export type HighlightPattern = HighlightRule[];

export interface ThemeColors {
  background: string;
  text: string;
  highlightText: string;
  highlightBorder: string;
}

export interface ColorTheme {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface FontOption {
  name: string;
  className: string;
}

export interface WordParts {
  before: string;
  pivot: string;
  after: string;
}

export interface MicroPauseSettings {
  enableMicroPauses: boolean;
  largeNumbersPause: number;
  sentenceEndPause: number;
  otherPunctuationPause: number;
  paragraphPause: number;
  longWordPause: number;
}

export interface ReaderSettings {
  theme: ColorTheme;
  font: FontOption;
  showFocusLetter: boolean;
  letterSpacing: number;
  fontSize: number;
  showFocusBorder: boolean;
  colorScheme: string;
  microPauses: MicroPauseSettings;
}

export interface SpritzReaderProps {
  initialWpm?: number;
  initialText?: string;
  initialHighlightPattern?: HighlightPattern;
  onThemeChange?: (theme: ColorTheme) => void;
}