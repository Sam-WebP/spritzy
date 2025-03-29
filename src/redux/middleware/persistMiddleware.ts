import { Middleware, AnyAction } from 'redux'; // Redux types
import { saveToStorage, STORAGE_KEYS } from '@/utils/storage-utils'; // Storage utilities
// No need to import RootState if using the inferred Middleware type

/**
 * List of Redux action types that should trigger saving state to local storage.
 * Uses action type prefixes to determine which part of the state to save.
 */
const PERSISTED_ACTIONS: string[] = [
  // Actions related to general application settings
  'settings/updateFont',
  'settings/toggleSetting',
  'settings/updateNumericSetting',
  'settings/setColorScheme',
  'settings/updateCustomColor',
  'settings/toggleMicroPauses',
  'settings/updateMicroPause',
  'settings/toggleStackPauses',
  'settings/toggleFocusControlsHiding',
  'settings/resetSettings', // Save state even after resetting defaults

  // Actions related to quiz default settings
  'quiz/setQuizSettings', // Save whenever default quiz settings are updated
];

/**
 * The persistence middleware function.
 * Intercepts specified actions after they have been processed by the reducers
 * and saves the relevant part of the updated state to local storage.
 */
// Using the simpler `Middleware` type allows TypeScript to infer state/dispatch types
export const persistMiddleware: Middleware = store => next => action => {
  // IMPORTANT: Let the action pass through the reducers FIRST to update the state
  const result = next(action);

  // Type assertion for easier access to action properties
  const typedAction = action as AnyAction;

  // Check if the dispatched action type is in our list of actions to persist
  if (typedAction.type && PERSISTED_ACTIONS.includes(typedAction.type)) {
    // Get the *updated* state after the reducers have run
    // `store.getState()` will be correctly typed as `RootState` due to inference
    const state = store.getState();

    // Determine which slice of state to save based on the action type prefix
    if (typedAction.type.startsWith('settings/')) {
      // If it's a settings action, save the entire 'settings' slice
      console.log('Persisting App Settings:', state.settings);
      saveToStorage(STORAGE_KEYS.APP_SETTINGS, state.settings);
    } else if (typedAction.type.startsWith('quiz/')) {
      // If it's a quiz action (specifically setQuizSettings), save only the 'quizSettings' part
      console.log('Persisting Quiz Settings:', state.quiz.quizSettings);
      saveToStorage(STORAGE_KEYS.QUIZ_SETTINGS, state.quiz.quizSettings);
    }
    // Add more `else if` blocks here if persisting other state slices in the future
  }

  // Return the result of the `next(action)` call, allowing middleware chain to continue
  return result;
};
