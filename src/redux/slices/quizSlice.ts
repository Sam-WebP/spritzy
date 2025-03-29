import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Quiz, QuizSettings, QuizOptionSelection, TypedAnswerQuestion } from '@/types';
import { judgeTypedAnswer } from '@/utils/answer-judge'; // For evaluating typed answers
import { loadFromStorage, STORAGE_KEYS } from '@/utils/storage-utils'; // For persistence

/** Interface for the result of evaluating a single typed answer. */
interface EvaluationResult {
  isCorrect: boolean;
  feedback: string; // Explanation from the AI about why the answer is correct/incorrect
}

/** Interface defining the structure of the quiz state managed by this slice. */
interface QuizState {
  currentQuiz: Quiz | null; // The currently active quiz object, or null if none
  currentQuestionIndex: number; // 0-based index of the question being displayed
  userAnswers: (number | string)[]; // Array storing user's answer for each question (index matches question index)
  isCompleted: boolean; // Flag indicating if the user has finished answering all questions
  loading: boolean; // Flag indicating if a quiz is currently being generated
  evaluating: boolean; // Flag indicating if typed answers are being evaluated by the AI
  error: string | null; // Stores error messages related to quiz generation or evaluation
  quizSettings: QuizSettings; // User's default quiz settings (persisted)
  // Temporary options for the *next* quiz generation, overriding defaults
  generationOptions?: {
    numQuestions?: number;
    questionTypes?: QuizOptionSelection;
  };
  showQuizDialog: boolean; // Controls the visibility of the main quiz dialog
  showOptionsDialog: boolean; // Controls the visibility of the quiz generation options dialog
  // Stores AI evaluation results for typed answers, keyed by question ID
  evaluationResults: {
    [questionId: string]: EvaluationResult;
  };
  showResults: boolean; // Flag indicating if the results view should be displayed
}

// Default quiz settings used if none are found in local storage
const defaultQuizSettings: QuizSettings = {
  apiKey: '',
  selectedModel: 'openai/gpt-3.5-turbo', // A common default model
  defaultNumQuestions: 5,
  defaultMode: {
    multipleChoice: true,
    typedAnswer: true,
    aiGenerateCount: false,
  },
};

// Load saved quiz settings from local storage, providing an empty object as fallback
const savedQuizSettings = loadFromStorage<Partial<QuizSettings>>(
  STORAGE_KEYS.QUIZ_SETTINGS,
  {}
);

// Define and export the initial state for the quiz slice
export const quizInitialState: QuizState = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
  loading: false,
  evaluating: false,
  error: null,
  // Merge default settings with any saved settings to ensure all properties exist
  quizSettings: {
    ...defaultQuizSettings,
    ...savedQuizSettings,
    // Deep merge defaultMode to handle potentially partial saves
    defaultMode: {
      ...defaultQuizSettings.defaultMode,
      ...(savedQuizSettings.defaultMode || {}),
    }
  },
  generationOptions: undefined, // Start with no temporary overrides
  showQuizDialog: false,
  showOptionsDialog: false,
  evaluationResults: {},
  showResults: false,
};

/**
 * Async thunk to evaluate all *answered* typed questions in the current quiz using an AI model.
 * Dispatches actions to update evaluation results and show the results view upon completion.
 */
export const evaluateAllAnswers = createAsyncThunk(
  'quiz/evaluateAllAnswers',
  async (_, { getState, dispatch }) => {
    const state = getState() as { quiz: QuizState }; // Get current state
    const { currentQuiz, userAnswers, quizSettings } = state.quiz;

    // Exit if no quiz is active
    if (!currentQuiz) return;

    // Identify only the typed-answer questions that have been answered by the user
    const answersToEvaluate = currentQuiz.questions
      .map((question, index) => ({ question, answer: userAnswers[index], index }))
      .filter(item => item.question.type === 'typed-answer' && // Check type
        item.answer !== undefined &&             // Ensure answer exists
        item.answer !== -1 &&                   // Ensure it's not the initial state
        typeof item.answer === 'string');        // Ensure it's a string

    // If there are no typed answers to evaluate, just show results immediately
    if (answersToEvaluate.length === 0) {
      dispatch(showResults());
      return;
    }

    // Set evaluating flag and clear previous errors
    dispatch(setEvaluating(true));
    dispatch(setError(null)); // Clear errors before starting evaluation

    try {
      // Create promises for evaluating each typed answer concurrently
      const evaluationPromises = answersToEvaluate.map(({ question, answer }) =>
        // Call the AI judge utility function
        judgeTypedAnswer(
          question as TypedAnswerQuestion, // Safe cast due to prior filtering
          answer as string,               // Safe cast due to prior filtering
          quizSettings.apiKey,
          quizSettings.selectedModel
        ).then(result => ({ // Structure the result with question ID
          questionId: question.id,
          result
        }))
      );

      // Wait for all evaluations to complete
      const results = await Promise.all(evaluationPromises);

      // Dispatch action to store each evaluation result in the state
      results.forEach(({ questionId, result }) => {
        dispatch(storeEvaluationResult({ questionId, result }));
      });

      // Dispatch action to show the results view
      dispatch(showResults());
    } catch (error: unknown) { // Catch any errors during evaluation
      console.error('Evaluation error:', error);
      // Extract error message safely
      const errorMessage = error instanceof Error ? error.message : 'Failed to evaluate one or more answers.';
      // Dispatch error state update
      dispatch(setError(errorMessage));
      // Still show results even if evaluation failed (users can see MC results)
      dispatch(showResults());
    } finally {
      // Ensure evaluating flag is turned off regardless of success or failure
      dispatch(setEvaluating(false));
    }
  }
);

// Create the Redux slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState: quizInitialState,
  reducers: {
    /** Sets the currently active quiz, resetting progress state. Handles null payload to reset state. */
    setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
      if (action.payload === null) {
        state.currentQuiz = null;
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        state.isCompleted = false;
        state.evaluationResults = {};
        state.showResults = false;
        state.error = null;
        return;
      }

      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      // Initialize user answers array with -1 (unanswered) for each question
      state.userAnswers = new Array(action.payload.questions.length).fill(-1);
      state.isCompleted = false;
      state.evaluationResults = {};
      state.showResults = false;
      state.showOptionsDialog = false; // Close options dialog if open
      state.error = null; // Clear any previous errors
      state.loading = false; // Ensure loading is off
      state.evaluating = false; // Ensure evaluating is off
    },
    /** Moves to the next question if possible. */
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    /** Moves to the previous question if possible. */
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    /** Records the user's answer for a specific question. */
    answerQuestion: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: number | string }>
    ) => {
      // Ensure index is valid before updating
      if (action.payload.questionIndex >= 0 && action.payload.questionIndex < state.userAnswers.length) {
        state.userAnswers[action.payload.questionIndex] = action.payload.answer;
      } else {
        console.warn("Attempted to answer invalid question index:", action.payload.questionIndex);
      }
    },
    /** Marks the quiz as completed, triggering evaluation if necessary. Checks if all questions are answered first. */
    completeQuiz: (state) => {
      // Verify all questions have received an answer (not -1)
      const allAnswered = state.userAnswers.every((answer: number | string | undefined) => answer !== undefined && answer !== -1);
      if (allAnswered) {
        state.isCompleted = true; // Mark as completed, which might trigger evaluation via useEffect
      } else {
        // Log a warning and set an error state if not all questions are answered
        console.warn("Attempted to complete quiz before answering all questions.");
        state.error = "Please answer all questions before finishing.";
      }
    },
    /** Resets the entire quiz state, except for persisted settings. */
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.isCompleted = false;
      state.evaluationResults = {};
      state.showResults = false;
      state.loading = false; // Reset loading flags
      state.evaluating = false;
      state.error = null; // Clear errors
      // Note: Does not close the main quiz dialog automatically, handled elsewhere if needed.
    },
    /** Sets the loading state, typically during quiz generation. */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    /** Sets the evaluating state, during AI evaluation of typed answers. */
    setEvaluating: (state, action: PayloadAction<boolean>) => {
      state.evaluating = action.payload;
    },
    /** Sets an error message in the state. */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    /** Updates the persisted quiz settings. Triggers middleware to save. */
    setQuizSettings: (state, action: PayloadAction<Partial<QuizSettings>>) => {
      state.quizSettings = { ...state.quizSettings, ...action.payload };
      // Middleware `persistMiddleware` will handle saving this to localStorage
    },
    /** Sets temporary options for the next quiz generation. */
    setGenerationOptions: (
      state,
      action: PayloadAction<QuizState['generationOptions']> // Use type from state definition
    ) => {
      // Merge payload with existing options, ensuring deep merge for questionTypes
      state.generationOptions = {
        ...state.generationOptions, // Keep existing temp options not in payload
        ...action.payload,         // Overwrite with payload options
        // Handle questionTypes specifically: merge payload types with existing/default types
        questionTypes: action.payload?.questionTypes
          ? { ...(state.generationOptions?.questionTypes ?? defaultQuizSettings.defaultMode), ...action.payload.questionTypes }
          : state.generationOptions?.questionTypes ?? defaultQuizSettings.defaultMode, // Fallback if not in payload
      };
    },
    /** Toggles the visibility of the main quiz dialog. Resets quiz state if closing. */
    toggleQuizDialog: (state) => {
      state.showQuizDialog = !state.showQuizDialog;
      // If dialog is being closed, reset the quiz state to initial values (keeping settings)
      if (!state.showQuizDialog) {
        Object.assign(state, {
          ...quizInitialState, // Reset all fields to initial state
          quizSettings: state.quizSettings, // Explicitly retain current settings
          showQuizDialog: false // Ensure dialog is marked closed
        });
      }
    },
    /** Toggles the visibility of the quiz generation options dialog. Resets temp options if opening. */
    toggleOptionsDialog: (state) => {
      const opening = !state.showOptionsDialog; // Is the dialog about to open?
      state.showOptionsDialog = opening; // Update visibility state

      // If opening the dialog, reset the temporary generationOptions based on current defaults
      if (opening) {
        state.generationOptions = {
          numQuestions: state.quizSettings.defaultNumQuestions,
          // Create a *new* object copy of defaultMode to avoid modifying defaults directly
          questionTypes: { ...state.quizSettings.defaultMode }
        };
      }
      // No action needed when closing, temp options are inherently temporary
    },
    /** Stores the evaluation result for a specific typed question. */
    storeEvaluationResult: (
      state,
      action: PayloadAction<{ questionId: string; result: EvaluationResult }>
    ) => {
      state.evaluationResults[action.payload.questionId] = action.payload.result;
    },
    /** Sets the flag to display the quiz results view. */
    showResults: (state) => {
      state.showResults = true;
    },
  },
  // Handle async actions from `evaluateAllAnswers` thunk
  extraReducers: (builder) => {
    builder
      // When evaluation starts
      .addCase(evaluateAllAnswers.pending, (state) => {
        state.evaluating = true;
        state.error = null; // Clear previous errors
      })
      // When evaluation finishes successfully
      .addCase(evaluateAllAnswers.fulfilled, (state) => {
        state.evaluating = false;
        // `showResults` is typically dispatched within the thunk logic
      })
      // When evaluation fails
      .addCase(evaluateAllAnswers.rejected, (state, action) => {
        state.evaluating = false;
        // Store the error message from the rejected action
        state.error = action.error.message || 'Failed to evaluate answers';
        // Note: Results might still be shown depending on thunk logic
      });
  },
});

// Export actions for use in components
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

// Export the reducer function
export default quizSlice.reducer;
