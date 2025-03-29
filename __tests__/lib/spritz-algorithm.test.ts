import { calculateFocusPoint, splitWordAtFocusPoint, processTextIntoWords } from '@/lib/spritz-algorithm';
import { DEFAULT_HIGHLIGHT_PATTERN } from '@/utils/constants';
import { describe, it, expect } from 'vitest';

describe('spritz-algorithm', () => {
    describe('calculateFocusPoint', () => {
        it('returns correct focus index for short words', () => {
            expect(calculateFocusPoint('a', DEFAULT_HIGHLIGHT_PATTERN)).toBe(0);
            expect(calculateFocusPoint('cat', DEFAULT_HIGHLIGHT_PATTERN)).toBe(0);
            expect(calculateFocusPoint('hello', DEFAULT_HIGHLIGHT_PATTERN)).toBe(1);
        });

        it('returns correct focus index for medium words', () => {
            // "development" has 9 letters -> returns highlightIndex 4 in current implementation
            expect(calculateFocusPoint('development', DEFAULT_HIGHLIGHT_PATTERN)).toBe(4);
            // "extraordinary" has 12 letters -> returns highlightIndex 5 in current implementation
            expect(calculateFocusPoint('extraordinary', DEFAULT_HIGHLIGHT_PATTERN)).toBe(5);
        });

        it('returns correct focus index for long words', () => {
            expect(calculateFocusPoint('supercalifragilisticexpialidocious', DEFAULT_HIGHLIGHT_PATTERN)).toBe(8);
        });

        it('handles empty string', () => {
            expect(calculateFocusPoint('', DEFAULT_HIGHLIGHT_PATTERN)).toBe(0);
        });
    });

    describe('splitWordAtFocusPoint', () => {
        it('correctly splits word at focus point', () => {
            expect(splitWordAtFocusPoint('hello', 1)).toEqual({
                before: 'h',
                pivot: 'e',
                after: 'llo'
            });
        });

        it('handles focus point at start of word', () => {
            expect(splitWordAtFocusPoint('hello', 0)).toEqual({
                before: '',
                pivot: 'h',
                after: 'ello'
            });
        });

        it('handles focus point at end of word', () => {
            expect(splitWordAtFocusPoint('hello', 4)).toEqual({
                before: 'hell',
                pivot: 'o',
                after: ''
            });
        });

        it('handles empty string', () => {
            expect(splitWordAtFocusPoint('', 0)).toEqual({
                before: '',
                pivot: '',
                after: ''
            });
        });
    });

    describe('processTextIntoWords', () => {
        it('splits text into words', () => {
            expect(processTextIntoWords('Hello world')).toEqual(['Hello', 'world']);
        });

        it('handles extra whitespace', () => {
            expect(processTextIntoWords('  Hello   world  ')).toEqual(['Hello', 'world']);
        });

        it('returns empty array for empty string', () => {
            expect(processTextIntoWords('')).toEqual([]);
        });

        it('handles punctuation', () => {
            expect(processTextIntoWords('Hello, world!')).toEqual(['Hello,', 'world!']);
        });
    });
});
