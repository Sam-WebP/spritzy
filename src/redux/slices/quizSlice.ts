import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Quiz, QuizSettings, QuizOptionSelection } from '@/types';
import { judgeTypedAnswer } from '@/utils/answer-judge';

interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
}

interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: (number | string)[];
  isCompleted: boolean;
  loading: boolean;
  evaluating: boolean;
  error: string | null;
  quizSettings: QuizSettings;
  generationOptions?: {
    numQuestions?: number;
    questionTypes?: QuizOptionSelection;
  };
  showQuizDialog: boolean;
  showOptionsDialog: boolean;
  evaluationResults: {
    [questionId: string]: EvaluationResult;
  };
  showResults: boolean;
}

const initialState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
  loading: false,
  evaluating: false,
  error: null,
  quizSettings: {
    apiKey: '',
    selectedModel: 'openai/gpt-3.5-turbo',
    defaultNumQuestions: 5,
    defaultMode: {
      multipleChoice: true,
      typedAnswer: true,
      aiGenerateCount: false,
    },
  },
  showQuizDialog: false,
  showOptionsDialog: false,
  evaluationResults: {},
  showResults: false,
};

export const evaluateAllAnswers = createAsyncThunk(
  'quiz/evaluateAllAnswers',
  async (_, { getState, dispatch }) => {
    const state = getState() as { quiz: QuizState };
    const { currentQuiz, userAnswers, quizSettings } = state.quiz;

    if (!currentQuiz) return;

    dispatch(setEvaluating(true));

    try {
      // Evaluate all typed answers
      const evaluationPromises = currentQuiz.questions
        .map((question, index) => {
          if (question.type === 'typed-answer' && userAnswers[index] !== undefined) {
            return judgeTypedAnswer(
              question,
              userAnswers[index] as string,
              quizSettings.apiKey,
              quizSettings.selectedModel
            ).then(result => ({
              questionId: question.id,
              result
            }));
          }
          return null;
        })
        .filter(Boolean);

      const results = await Promise.all(evaluationPromises) as Array<{
        questionId: string;
        result: {
          isCorrect: boolean;
          feedback: string;
        };
      }>;

      // Store all evaluation results
      results.forEach(({ questionId, result }) => {
        dispatch(storeEvaluationResult({ questionId, result }));
      });

      dispatch(showResults());
    } catch (error) {
      console.error('Evaluation error:', error);
      throw error;
    } finally {
      dispatch(setEvaluating(false));
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      state.userAnswers = new Array(action.payload.questions.length).fill(-1);
      state.isCompleted = false;
      state.evaluationResults = {};
      state.showResults = false;
      state.showOptionsDialog = false;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < (state.currentQuiz?.questions.length || 0) - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    answerQuestion: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: number | string }>
    ) => {
      state.userAnswers[action.payload.questionIndex] = action.payload.answer;
    },
    completeQuiz: (state) => {
      state.isCompleted = true;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.isCompleted = false;
      state.evaluationResults = {};
      state.showResults = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEvaluating: (state, action: PayloadAction<boolean>) => {
      state.evaluating = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setQuizSettings: (state, action: PayloadAction<Partial<QuizSettings>>) => {
      state.quizSettings = { ...state.quizSettings, ...action.payload };
    },
    setGenerationOptions: (
      state,
      action: PayloadAction<{
        numQuestions?: number;
        questionTypes?: QuizOptionSelection;
      }>
    ) => {
      state.generationOptions = action.payload;
    },
    toggleQuizDialog: (state) => {
      state.showQuizDialog = !state.showQuizDialog;
    },
    toggleOptionsDialog: (state) => {
      state.showOptionsDialog = !state.showOptionsDialog;
    },
    storeEvaluationResult: (
      state,
      action: PayloadAction<{ questionId: string; result: EvaluationResult }>
    ) => {
      state.evaluationResults[action.payload.questionId] = action.payload.result;
    },
    showResults: (state) => {
      state.showResults = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(evaluateAllAnswers.pending, (state) => {
        state.evaluating = true;
      })
      .addCase(evaluateAllAnswers.fulfilled, (state) => {
        state.evaluating = false;
      })
      .addCase(evaluateAllAnswers.rejected, (state, action) => {
        state.evaluating = false;
        state.error = action.error.message || 'Failed to evaluate answers';
      });
  },
});

export const {
  setCurrentQuiz,
  nextQuestion,
  previousQuestion,
  answerQuestion,
  completeQuiz,
  resetQuiz,
  setLoading,
  setEvaluating,
  setError,
  setQuizSettings,
  setGenerationOptions,
  toggleQuizDialog,
  toggleOptionsDialog,
  storeEvaluationResult,
  showResults,
} = quizSlice.actions;

export default quizSlice.reducer;
