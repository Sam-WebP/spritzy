import { Middleware, AnyAction } from 'redux';
import { saveToStorage, STORAGE_KEYS } from '@/utils/storage-utils';

// Actions that should trigger persistence
const PERSISTED_ACTIONS = [
  // Settings actions
  'settings/updateFont',
  'settings/toggleSetting',
  'settings/updateNumericSetting',
  'settings/setColorScheme',
  'settings/toggleMicroPauses',
  'settings/updateMicroPause',
  'settings/toggleStackPauses',
  'settings/toggleFocusControlsHiding',
  
  // Quiz settings actions
  'quiz/setApiKey',
  'quiz/setSelectedModel',
  'quiz/setNumQuestions',
];

export const persistMiddleware: Middleware = store => next => action => {
  // Call next first to update the state
  const result = next(action);
  
  // After state is updated, check if we need to persist
  // Type assertion to handle the 'unknown' type of action
  const typedAction = action as AnyAction;
  
  if (typedAction.type && PERSISTED_ACTIONS.includes(typedAction.type)) {
    const state = store.getState();
    
    // Save app settings
    saveToStorage(STORAGE_KEYS.APP_SETTINGS, state.settings);
    
    // Save quiz settings
    saveToStorage(STORAGE_KEYS.QUIZ_SETTINGS, {
      apiKey: state.quiz.apiKey,
      selectedModel: state.quiz.selectedModel,
      numQuestions: state.quiz.numQuestions
    });
  }
  
  return result;
};