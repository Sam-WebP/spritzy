import { MicroPauseSettings } from '@/types';

// Constants for detecting conditions that need pauses
const LARGE_NUMBER_REGEX = /\d{4,}/;
const SENTENCE_END_REGEX = /[.!?][\s"']*$/;
const OTHER_PUNCTUATION_REGEX = /[,;:)][\s"']*$/;
const OPENING_PAREN_REGEX = /^\(/;
const LONG_WORD_THRESHOLD = 8;
const PARAGRAPH_START_REGEX = /^\s*[A-Z]/;

export function calculateMicroPauseFactor(
  currentWord: string,
  nextWord: string | null,
  text: string,
  currentWordIndex: number,
  words: string[],
  settings: MicroPauseSettings
): number {
  if (!settings.enableMicroPauses) return 1;
  
  let factor = 1;
  
  // Check for large numbers (4+ digits)
  if (LARGE_NUMBER_REGEX.test(currentWord)) {
    factor += settings.largeNumbersPause;
  }
  
  // Check for sentence end punctuation
  if (SENTENCE_END_REGEX.test(currentWord)) {
    factor += settings.sentenceEndPause;
  }
  
  // Check for other punctuation
  if (OTHER_PUNCTUATION_REGEX.test(currentWord) || 
      (nextWord && OPENING_PAREN_REGEX.test(nextWord))) {
    factor += settings.otherPunctuationPause;
  }
  
  // Check for paragraph break - if next word starts with capital after sentence end
  if (nextWord && SENTENCE_END_REGEX.test(currentWord) && 
      PARAGRAPH_START_REGEX.test(nextWord)) {
    factor += settings.paragraphPause;
  }
  
  // Check for long words
  if (currentWord.length >= LONG_WORD_THRESHOLD) {
    factor += settings.longWordPause;
  }
  
  return factor;
}