import { HighlightPattern, WordParts } from '@/types';

/**
 * Calculate the optimal focus point for a word using the highlight pattern
 */
export function calculateFocusPoint(word: string, pattern: HighlightPattern): number {
  const length = word.length;
  
  // Find the appropriate rule from our pattern
  for (const rule of pattern) {
    if (length <= rule.maxLength) {
      return rule.highlightIndex;
    }
  }
  
  // Default for very long words
  return Math.min(
    pattern[pattern.length - 1]?.highlightIndex || 8,
    Math.floor(length / 2) - 1
  );
}

/**
 * Split a word at the calculated focus point
 */
export function splitWordAtFocusPoint(word: string, focusIndex: number): WordParts {
  return {
    before: word.slice(0, focusIndex),
    pivot: word[focusIndex] || '',
    after: word.slice(focusIndex + 1)
  };
}

/**
 * Process the text into an array of words
 */
export function processTextIntoWords(text: string): string[] {
  return text
    .trim()
    .replace(/\s{2,}/g, ' ')
    .split(' ')
    .filter(word => word.length > 0);
}