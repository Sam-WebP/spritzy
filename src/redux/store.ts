import { configureStore } from '@reduxjs/toolkit';
import readerReducer from './slices/readerSlice';
import settingsReducer from './slices/settingsSlice';
import themeReducer from './slices/themeSlice';
import quizReducer from './slices/quizSlice';
import { persistMiddleware } from './middleware/persistMiddleware';

export const store = configureStore({
  reducer: {
    reader: readerReducer,
    settings: settingsReducer,
    theme: themeReducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;