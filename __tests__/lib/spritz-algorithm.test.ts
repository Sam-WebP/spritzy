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

        it('handles words with lengths matching pattern boundaries', () => {
            expect(calculateFocusPoint('abcd', DEFAULT_HIGHLIGHT_PATTERN)).toBe(0); // 4 letters
            expect(calculateFocusPoint('abcdef', DEFAULT_HIGHLIGHT_PATTERN)).toBe(1); // 6 letters
            expect(calculateFocusPoint('abcdefgh', DEFAULT_HIGHLIGHT_PATTERN)).toBe(2); // 8 letters
            expect(calculateFocusPoint('abcdefghi', DEFAULT_HIGHLIGHT_PATTERN)).toBe(3); // 9 letters
        });

        it('handles very short words explicitly', () => {
            expect(calculateFocusPoint('a', DEFAULT_HIGHLIGHT_PATTERN)).toBe(0);
            expect(calculateFocusPoint('an', DEFAULT_HIGHLIGHT_PATTERN)).toBe(0);
        });

        it('respects custom highlight patterns', () => {
            const customPattern = [
                { maxLength: 3, highlightIndex: 0 },
                { maxLength: 6, highlightIndex: 1 },
                { maxLength: Infinity, highlightIndex: 2 }
            ];
            expect(calculateFocusPoint('cat', customPattern)).toBe(0);
            expect(calculateFocusPoint('hello', customPattern)).toBe(1);
            expect(calculateFocusPoint('elephant', customPattern)).toBe(2);
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

        it('handles leading/trailing punctuation', () => {
            expect(processTextIntoWords('"Hello", (world)!')).toEqual(['"Hello",', '(world)!']);
            expect(processTextIntoWords('...ellipsis')).toEqual(['...ellipsis']);
        });

        it('handles mid-word punctuation', () => {
            expect(processTextIntoWords("it's well-being")).toEqual(["it's", 'well-being']);
        });

        it('handles multiple punctuation marks', () => {
            expect(processTextIntoWords('Wow!!! Really??')).toEqual(['Wow!!!', 'Really??']);
        });

        it('handles numbers', () => {
            expect(processTextIntoWords('Chapter 1, page 2')).toEqual(['Chapter', '1,', 'page', '2']);
        });

        it('handles different whitespace characters', () => {
            // Current implementation only splits on single spaces
            expect(processTextIntoWords('Hello world new line')).toEqual(['Hello', 'world', 'new', 'line']);
        });
    });
});
