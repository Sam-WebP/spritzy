import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quiz, QuizState } from '@/types';
import { loadFromStorage, STORAGE_KEYS } from '@/utils/storage-utils';

// Load saved quiz settings
const savedSettings = loadFromStorage<{
  apiKey: string;
  selectedModel: string;
  numQuestions: number;
}>(
  STORAGE_KEYS.QUIZ_SETTINGS, 
  {
    apiKey: '',
    selectedModel: 'openai/gpt-3.5-turbo',
    numQuestions: 5
  }
);

const initialState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
  loading: false,
  error: null,
  // Use saved settings from localStorage
  apiKey: savedSettings.apiKey,
  selectedModel: savedSettings.selectedModel,
  numQuestions: savedSettings.numQuestions,
  showQuizDialog: false,
};

export const quizSlice = createSlice({
  // Rest of the slice remains the same
  name: 'quiz',
  initialState,
  reducers: {
    // Your existing reducers
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      state.userAnswers = new Array(action.payload.questions.length).fill(-1);
      state.isCompleted = false;
    },
    answerQuestion: (state, action: PayloadAction<{questionIndex: number, answerIndex: number}>) => {
      const { questionIndex, answerIndex } = action.payload;
      state.userAnswers[questionIndex] = answerIndex;
    },
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    completeQuiz: (state) => {
      state.isCompleted = true;
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      if (state.currentQuiz) {
        state.userAnswers = new Array(state.currentQuiz.questions.length).fill(-1);
      }
      state.isCompleted = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Settings actions - no need for manual saveToStorage calls anymore
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    setNumQuestions: (state, action: PayloadAction<number>) => {
      state.numQuestions = action.payload;
    },
    toggleQuizDialog: (state) => {
      state.showQuizDialog = !state.showQuizDialog;
      state.error = null;
    },
  },
});

export const {
  setCurrentQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  completeQuiz,
  resetQuiz,
  setLoading,
  setError,
  setApiKey,
  setSelectedModel,
  setNumQuestions,
  toggleQuizDialog,
} = quizSlice.actions;

export default quizSlice.reducer;