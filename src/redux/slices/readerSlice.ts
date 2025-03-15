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
  wordsAtTime: number;
}

const initialState: ReaderState = {
  text: DEFAULT_TEXT,
  words: processTextIntoWords(DEFAULT_TEXT),
  wpm: 300,
  isPlaying: false,
  currentWordIndex: 0,
  currentWord: { before: '', pivot: '', after: '' },
  highlightPattern: DEFAULT_HIGHLIGHT_PATTERN,
  wordsAtTime: 1,
};

// Initialize the first word
const firstWord = initialState.words[0] || '';
if (firstWord) {
  const pivotIndex = calculateFocusPoint(firstWord, initialState.highlightPattern);
  initialState.currentWord = splitWordAtFocusPoint(firstWord, pivotIndex);
}

const getCombinedWords = (words: string[], startIndex: number, wordsAtTime: number): string => {
  const endIndex = Math.min(startIndex + wordsAtTime, words.length);
  return words.slice(startIndex, endIndex).join(' ');
};

const calculateMultiWordFocusPoint = (combinedText: string, pattern: HighlightPattern): number => {
  const length = combinedText.length;
  
  // Find the appropriate rule from our pattern
  for (const rule of pattern) {
    if (length <= rule.maxLength) {
      return rule.highlightIndex;
    }
  }
  
  // Default for very long texts
  return Math.min(
    pattern[pattern.length - 1]?.highlightIndex || 8,
    Math.floor(length / 3) // Use a more reasonable default for long text
  );
};

const splitCombinedTextAtFocusPoint = (text: string, focusIndex: number): WordParts => {
  if (focusIndex < 0 || focusIndex >= text.length) {
    return { before: text, pivot: '', after: '' };
  }
  
  // Handle case where focus index points to a space
  if (text[focusIndex] === ' ') {
    // Try to use the next character, or previous if we're at the end
    if (focusIndex < text.length - 1) {
      focusIndex += 1;
    } else if (focusIndex > 0) {
      focusIndex -= 1;
    }
  }
  
  let before = text.slice(0, focusIndex);
  const pivot = text[focusIndex] || '';
  let after = text.slice(focusIndex + 1);
  
  // Replace trailing spaces in "before" with non-breaking spaces
  if (before.endsWith(' ')) {
    before = before.replace(/\s+$/, (match) => '\u00A0'.repeat(match.length));
  }
  
  // Replace leading spaces in "after" with non-breaking spaces
  if (after.startsWith(' ')) {
    after = after.replace(/^\s+/, (match) => '\u00A0'.repeat(match.length));
  }
  
  return { before, pivot, after };
};

export const readerSlice = createSlice({
  name: 'reader',
  initialState,
  reducers: {
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setWordsAtTime: (state, action: PayloadAction<number>) => {
      state.wordsAtTime = action.payload;
      
      // Update the current display when changing words at time setting
      if (state.words.length > 0 && state.currentWordIndex < state.words.length) {
        const combinedText = getCombinedWords(state.words, state.currentWordIndex, action.payload);
        const pivotIndex = calculateMultiWordFocusPoint(combinedText, state.highlightPattern);
        state.currentWord = splitCombinedTextAtFocusPoint(combinedText, pivotIndex);
      }
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
        const combinedText = getCombinedWords(state.words, action.payload, state.wordsAtTime);
        const pivotIndex = calculateMultiWordFocusPoint(combinedText, state.highlightPattern);
        state.currentWord = splitCombinedTextAtFocusPoint(combinedText, pivotIndex);
      }
    },
    incrementWordIndex: (state) => {
      const newIndex = state.currentWordIndex + state.wordsAtTime;
      
      if (newIndex < state.words.length) {
        state.currentWordIndex = newIndex;
        const combinedText = getCombinedWords(state.words, newIndex, state.wordsAtTime);
        const pivotIndex = calculateMultiWordFocusPoint(combinedText, state.highlightPattern);
        state.currentWord = splitCombinedTextAtFocusPoint(combinedText, pivotIndex);
      } else {
        // End of text reached
        state.isPlaying = false;
      }
    },
    setHighlightPattern: (state, action: PayloadAction<HighlightPattern>) => {
      state.highlightPattern = action.payload;
      
      // Update current word display with new pattern
      if (state.words.length > 0 && state.currentWordIndex < state.words.length) {
        const combinedText = getCombinedWords(state.words, state.currentWordIndex, state.wordsAtTime);
        const pivotIndex = calculateMultiWordFocusPoint(combinedText, action.payload);
        state.currentWord = splitCombinedTextAtFocusPoint(combinedText, pivotIndex);
      }
    },
    processText: (state) => {
      const processedWords = processTextIntoWords(state.text);
      state.words = processedWords;
      state.currentWordIndex = 0;
      
      if (processedWords.length > 0) {
        const combinedText = getCombinedWords(processedWords, 0, state.wordsAtTime);
        const pivotIndex = calculateMultiWordFocusPoint(combinedText, state.highlightPattern);
        state.currentWord = splitCombinedTextAtFocusPoint(combinedText, pivotIndex);
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
        const combinedText = getCombinedWords(state.words, 0, state.wordsAtTime);
        const pivotIndex = calculateMultiWordFocusPoint(combinedText, state.highlightPattern);
        state.currentWord = splitCombinedTextAtFocusPoint(combinedText, pivotIndex);
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
  setWordsAtTime,
} = readerSlice.actions;

export default readerSlice.reducer;