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
  stackPauses: boolean;
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
  focusModeFont: FontOption;
  focusModeFontSize: number;
  focusModeLetterSpacing: number;
  showFocusBorder: boolean;
  colorScheme: string;
  microPauses: MicroPauseSettings;
  focusModeActive: boolean;
  autoHideFocusControls: boolean;
}

export interface SpritzReaderProps {
  initialWpm?: number;
  initialText?: string;
  initialHighlightPattern?: HighlightPattern;
  onThemeChange?: (theme: ColorTheme) => void;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: number[]; // Index of selected answers
  isCompleted: boolean;
  loading: boolean;
  error: string | null;
  // Settings
  apiKey: string;
  selectedModel: string;
  numQuestions: number;
  showQuizDialog: boolean;
}