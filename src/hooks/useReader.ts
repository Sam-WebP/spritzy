import { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_HIGHLIGHT_PATTERN } from '@/utils/constants';
import { WordParts, HighlightPattern } from '@/types';
import { calculateFocusPoint, splitWordAtFocusPoint, processTextIntoWords } from '@/lib/spritz-algorithm';

interface UseReaderReturn {
  text: string;
  setText: (text: string) => void;
  words: string[];
  wpm: number;
  setWpm: (wpm: number) => void;
  isPlaying: boolean;
  currentWordIndex: number;
  currentWord: WordParts;
  highlightPattern: HighlightPattern;
  setHighlightPattern: (pattern: HighlightPattern) => void;
  startReading: () => void;
  pauseReading: () => void;
  resetReading: () => void;
  processText: () => void;
  displayWord: (word: string) => void;
}

export function useReader(
  initialText: string,
  initialWpm: number
): UseReaderReturn {
  const [text, setText] = useState<string>(initialText);
  const [words, setWords] = useState<string[]>([]);
  const [wpm, setWpm] = useState<number>(initialWpm);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<WordParts>({ before: '', pivot: '', after: '' });
  const [highlightPattern, setHighlightPattern] = useState<HighlightPattern>(DEFAULT_HIGHLIGHT_PATTERN);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Display a word with its focus point
  const displayWord = useCallback((word: string) => {
    if (!word) return;
    
    const pivotIndex = calculateFocusPoint(word, highlightPattern);
    setCurrentWord(splitWordAtFocusPoint(word, pivotIndex));
  }, [highlightPattern]);

  // Process text into words
  const processText = useCallback(() => {
    const processedWords = processTextIntoWords(text);    
    setWords(processedWords);
    setCurrentWordIndex(0);
    
    if (processedWords.length > 0) {
      displayWord(processedWords[0]);
    }
  }, [text, displayWord]);

  // Start reading
  const startReading = useCallback(() => {
    if (words.length === 0 || currentWordIndex >= words.length) {
      processText();
    }
    
    setIsPlaying(true);
  }, [words, currentWordIndex, processText]);

  // Pause reading
  const pauseReading = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Reset reading
  const resetReading = useCallback(() => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
    if (words.length > 0) {
      displayWord(words[0]);
    }
  }, [words, displayWord]);

  // Process text when it changes
  useEffect(() => {
    processText();
  }, [processText]);

  // Handle interval for reading
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && words.length > 0) {
      const interval = 60000 / wpm;
      
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          const newIndex = prev + 1;
          
          if (newIndex >= words.length) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsPlaying(false);
            return prev;
          }
          
          displayWord(words[newIndex]);
          return newIndex;
        });
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, wpm, words, displayWord]);
  
  return {
    text,
    setText,
    words,
    wpm,
    setWpm,
    isPlaying,
    currentWordIndex,
    currentWord,
    highlightPattern,
    setHighlightPattern,
    startReading,
    pauseReading,
    resetReading,
    processText,
    displayWord
  };
}