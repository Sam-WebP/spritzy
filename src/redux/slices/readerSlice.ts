import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WordParts, HighlightPattern } from '@/types';
import { DEFAULT_TEXT, DEFAULT_HIGHLIGHT_PATTERN } from '@/utils/constants';
import { calculateFocusPoint, splitWordAtFocusPoint, processTextIntoWords } from '@/lib/spritz-algorithm';

interface ReaderState {
  text: string;
  words: string[];
  wpm: number;
  isPlaying: boolean;
  currentWordIndex: number;
  currentWord: WordParts;
  highlightPattern: HighlightPattern;
}

const initialState: ReaderState = {
  text: DEFAULT_TEXT,
  words: processTextIntoWords(DEFAULT_TEXT),
  wpm: 300,
  isPlaying: false,
  currentWordIndex: 0,
  currentWord: { before: '', pivot: '', after: '' },
  highlightPattern: DEFAULT_HIGHLIGHT_PATTERN,
};

// Initialize the first word
const firstWord = initialState.words[0] || '';
if (firstWord) {
  const pivotIndex = calculateFocusPoint(firstWord, initialState.highlightPattern);
  initialState.currentWord = splitWordAtFocusPoint(firstWord, pivotIndex);
}

export const readerSlice = createSlice({
  name: 'reader',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setWpm: (state, action: PayloadAction<number>) => {
      state.wpm = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentWordIndex: (state, action: PayloadAction<number>) => {
      state.currentWordIndex = action.payload;
      
      // Update current word
      if (state.words.length > 0 && action.payload < state.words.length) {
        const word = state.words[action.payload];
        const pivotIndex = calculateFocusPoint(word, state.highlightPattern);
        state.currentWord = splitWordAtFocusPoint(word, pivotIndex);
      }
    },
    incrementWordIndex: (state) => {
      const newIndex = state.currentWordIndex + 1;
      
      if (newIndex < state.words.length) {
        state.currentWordIndex = newIndex;
        const word = state.words[newIndex];
        const pivotIndex = calculateFocusPoint(word, state.highlightPattern);
        state.currentWord = splitWordAtFocusPoint(word, pivotIndex);
      } else {
        // End of text reached
        state.isPlaying = false;
      }
    },
    setHighlightPattern: (state, action: PayloadAction<HighlightPattern>) => {
      state.highlightPattern = action.payload;
      
      // Update current word display with new pattern
      if (state.words.length > 0 && state.currentWordIndex < state.words.length) {
        const word = state.words[state.currentWordIndex];
        const pivotIndex = calculateFocusPoint(word, action.payload);
        state.currentWord = splitWordAtFocusPoint(word, pivotIndex);
      }
    },
    processText: (state) => {
      const processedWords = processTextIntoWords(state.text);
      state.words = processedWords;
      state.currentWordIndex = 0;
      
      if (processedWords.length > 0) {
        const word = processedWords[0];
        const pivotIndex = calculateFocusPoint(word, state.highlightPattern);
        state.currentWord = splitWordAtFocusPoint(word, pivotIndex);
      } else {
        state.currentWord = { before: '', pivot: '', after: '' };
      }
    },
    startReading: (state) => {
      if (state.words.length === 0 || state.currentWordIndex >= state.words.length) {
        const processedWords = processTextIntoWords(state.text);
        state.words = processedWords;
        state.currentWordIndex = 0;
        
        if (processedWords.length > 0) {
          const word = processedWords[0];
          const pivotIndex = calculateFocusPoint(word, state.highlightPattern);
          state.currentWord = splitWordAtFocusPoint(word, pivotIndex);
        }
      }
      
      state.isPlaying = true;
    },
    pauseReading: (state) => {
      state.isPlaying = false;
    },
    resetReading: (state) => {
      state.isPlaying = false;
      state.currentWordIndex = 0;
      
      if (state.words.length > 0) {
        const word = state.words[0];
        const pivotIndex = calculateFocusPoint(word, state.highlightPattern);
        state.currentWord = splitWordAtFocusPoint(word, pivotIndex);
      }
    },
  },
});

export const {
  setText,
  setWpm,
  setIsPlaying,
  setCurrentWordIndex,
  incrementWordIndex,
  setHighlightPattern,
  processText,
  startReading,
  pauseReading,
  resetReading,
} = readerSlice.actions;

export default readerSlice.reducer;