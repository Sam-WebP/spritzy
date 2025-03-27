import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// Ensure TypedAnswerQuestion is imported if used in evaluateAllAnswers
import { Quiz, QuizSettings, QuizOptionSelection, TypedAnswerQuestion } from '@/types';
import { judgeTypedAnswer } from '@/utils/answer-judge';
import { loadFromStorage, STORAGE_KEYS } from '@/utils/storage-utils';

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
  // Make generationOptions optional as it might not always be set
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

const defaultQuizSettings: QuizSettings = {
  apiKey: '',
  selectedModel: 'openai/gpt-3.5-turbo',
  defaultNumQuestions: 5,
  defaultMode: {
    multipleChoice: true,
    typedAnswer: true,
    aiGenerateCount: false,
  },
};

const savedQuizSettings = loadFromStorage<Partial<QuizSettings>>(
  STORAGE_KEYS.QUIZ_SETTINGS,
  {}
);

const initialState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
  loading: false,
  evaluating: false,
  error: null,
  quizSettings: {
    ...defaultQuizSettings,
    ...savedQuizSettings,
    defaultMode: {
        ...defaultQuizSettings.defaultMode,
        ...(savedQuizSettings.defaultMode || {}),
    }
  },
  // generationOptions start undefined
  generationOptions: undefined,
  showQuizDialog: false,
  showOptionsDialog: false,
  evaluationResults: {},
  showResults: false,
};

// --- evaluateAllAnswers thunk remains the same ---
export const evaluateAllAnswers = createAsyncThunk(
  'quiz/evaluateAllAnswers',
  async (_, { getState, dispatch }) => {
    const state = getState() as { quiz: QuizState };
    const { currentQuiz, userAnswers, quizSettings } = state.quiz;

    if (!currentQuiz) return;

    const answersToEvaluate = currentQuiz.questions
        .map((question, index) => ({ question, answer: userAnswers[index], index }))
        .filter(item => item.question.type === 'typed-answer' &&
                        item.answer !== undefined &&
                        item.answer !== -1 &&
                        typeof item.answer === 'string');

    if (answersToEvaluate.length === 0) {
        dispatch(showResults());
        return;
    }

    dispatch(setEvaluating(true));

    try {
      const evaluationPromises = answersToEvaluate.map(({ question, answer }) =>
        judgeTypedAnswer(
          question as TypedAnswerQuestion,
          answer as string,
          quizSettings.apiKey,
          quizSettings.selectedModel
        ).then(result => ({
          questionId: question.id,
          result
        }))
      );

      const results = await Promise.all(evaluationPromises);

      results.forEach(({ questionId, result }) => {
        dispatch(storeEvaluationResult({ questionId, result }));
      });

      dispatch(showResults());
    } catch (error: unknown) {
      console.error('Evaluation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to evaluate one or more answers.';
      dispatch(setError(errorMessage));
      dispatch(showResults());
    } finally {
      dispatch(setEvaluating(false));
    }
  }
);


const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // --- Other reducers remain the same (setCurrentQuiz, nextQuestion, etc.) ---
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
        state.currentQuiz = action.payload;
        state.currentQuestionIndex = 0;
        state.userAnswers = new Array(action.payload.questions.length).fill(-1);
        state.isCompleted = false;
        state.evaluationResults = {};
        state.showResults = false;
        state.showOptionsDialog = false;
        state.error = null;
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
      answerQuestion: (
        state,
        action: PayloadAction<{ questionIndex: number; answer: number | string }>
      ) => {
         if (action.payload.questionIndex < state.userAnswers.length) {
            state.userAnswers[action.payload.questionIndex] = action.payload.answer;
         }
      },
      completeQuiz: (state) => {
        const allAnswered = state.userAnswers.every(answer => answer !== undefined && answer !== -1);
        if (allAnswered) {
          state.isCompleted = true;
        } else {
          console.warn("Attempted to complete quiz before answering all questions.");
          state.error = "Please answer all questions before finishing.";
        }
      },
      resetQuiz: (state) => {
        state.currentQuiz = null;
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        state.isCompleted = false;
        state.evaluationResults = {};
        state.showResults = false;
        state.loading = false;
        state.evaluating = false;
        state.error = null;
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
        action: PayloadAction<QuizState['generationOptions']>
      ) => {
        state.generationOptions = {
            ...state.generationOptions,
            ...action.payload,
            questionTypes: action.payload?.questionTypes
                ? { ...(state.generationOptions?.questionTypes ?? defaultQuizSettings.defaultMode), ...action.payload.questionTypes }
                : state.generationOptions?.questionTypes ?? defaultQuizSettings.defaultMode,
        };
      },
      toggleQuizDialog: (state) => {
        state.showQuizDialog = !state.showQuizDialog;
        if (!state.showQuizDialog) {
            Object.assign(state, {
                ...initialState,
                quizSettings: state.quizSettings,
                showQuizDialog: false
            });
        }
      },

    // *** MODIFIED REDUCER ***
    toggleOptionsDialog: (state) => {
        const opening = !state.showOptionsDialog;
        state.showOptionsDialog = opening;

        // If opening the dialog, initialize/reset generationOptions from defaults
        if (opening) {
            state.generationOptions = {
                numQuestions: state.quizSettings.defaultNumQuestions,
                // Create a distinct copy of the defaultMode object
                questionTypes: { ...state.quizSettings.defaultMode }
            };
        }
        // When closing, we don't need to do anything, the temporary
        // generationOptions will be overwritten next time it's opened.
    },
    // *** END MODIFIED REDUCER ***

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
        state.error = null;
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
  toggleOptionsDialog, // Keep this export
  storeEvaluationResult,
  showResults,
} = quizSlice.actions;

export default quizSlice.reducer;