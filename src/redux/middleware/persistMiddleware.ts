import { Middleware, AnyAction } from 'redux';
import { saveToStorage, STORAGE_KEYS } from '@/utils/storage-utils';

// Actions that should trigger persistence
const PERSISTED_ACTIONS: string[] = [ // Use string[] type
  // Settings actions
  'settings/updateFont',
  'settings/toggleSetting',
  'settings/updateNumericSetting',
  'settings/setColorScheme',
  'settings/toggleMicroPauses',
  'settings/updateMicroPause',
  'settings/toggleStackPauses',
  'settings/toggleFocusControlsHiding',
  'settings/resetSettings', // Persist after reset too

  // Quiz settings actions
  'quiz/setQuizSettings', // Listen for the main settings update action
];

export const persistMiddleware: Middleware = store => next => action => {
  // Call next first to update the state
  const result = next(action);
  const typedAction = action as AnyAction;

  if (typedAction.type && PERSISTED_ACTIONS.includes(typedAction.type)) {
    const state = store.getState();

    if (typedAction.type.startsWith('settings/')) {
      console.log('Persisting App Settings:', state.settings);
      saveToStorage(STORAGE_KEYS.APP_SETTINGS, state.settings);
    } else if (typedAction.type.startsWith('quiz/')) {
        console.log('Persisting Quiz Settings:', state.quiz.quizSettings);
        saveToStorage(STORAGE_KEYS.QUIZ_SETTINGS, state.quiz.quizSettings);
    }
  }

  return result;
};