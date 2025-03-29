export interface HighlightRule {
  maxLength: number;
  highlightIndex: number;
}

export type HighlightPattern = HighlightRule[];

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
}

export interface CustomThemeColors {
  light: ThemeColors;
  dark: ThemeColors;
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
  font: FontOption;
  customThemeColors: CustomThemeColors;
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

export interface QuizOptionSelection {
  multipleChoice: boolean;
  typedAnswer: boolean;
  aiGenerateCount: boolean;
}

export interface QuizQuestionBase {
  id: string;
  question: string;
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: 'multiple-choice';
  options: string[];
  correctOptionIndex: number;
}

export interface TypedAnswerQuestion extends QuizQuestionBase {
  type: 'typed-answer';
  correctAnswer: string;
  context?: string;
}

export type QuizQuestion = MultipleChoiceQuestion | TypedAnswerQuestion;

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}


export interface QuizSettings {
  apiKey: string;
  selectedModel: string;
  defaultNumQuestions: number;
  defaultMode: QuizOptionSelection;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: (number | string)[];
  isCompleted: boolean;
  loading: boolean;
  error: string | null;
  quizSettings: QuizSettings;
  generationOptions?: {
    numQuestions?: number;
    questionTypes?: QuizOptionSelection;
  };
  showQuizDialog: boolean;
  showOptionsDialog: boolean;
}
