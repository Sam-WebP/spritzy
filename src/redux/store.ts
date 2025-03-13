import { configureStore } from '@reduxjs/toolkit';
import readerReducer from './slices/readerSlice';
import settingsReducer from './slices/settingsSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    reader: readerReducer,
    settings: settingsReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;