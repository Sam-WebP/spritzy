import { calculateMaxCharacters, calculateOptimalFontSize } from '@/utils/text-utils';
import { describe, it, expect } from 'vitest';

describe('text-utils', () => {
    describe('calculateMaxCharacters', () => {
        it('calculates max characters for small font', () => {
            expect(calculateMaxCharacters(12, 0, 500)).toBeGreaterThan(20);
        });

        it('calculates max characters for large font', () => {
            expect(calculateMaxCharacters(48, 0, 500)).toBeLessThan(20);
        });

        it('accounts for letter spacing', () => {
            const withoutSpacing = calculateMaxCharacters(24, 0, 500);
            const withSpacing = calculateMaxCharacters(24, 5, 500);
            expect(withSpacing).toBeLessThan(withoutSpacing);
        });

        it('handles very small screen width', () => {
            expect(calculateMaxCharacters(12, 0, 100)).toBeGreaterThan(0);
        });
    });

    describe('calculateOptimalFontSize', () => {
        it('returns current size when text fits', () => {
            expect(calculateOptimalFontSize(10, 10, 20, 24)).toBe(24);
        });

        it('reduces size when before text is too long', () => {
            const newSize = calculateOptimalFontSize(30, 10, 20, 24);
            expect(newSize).toBeLessThan(24);
            expect(newSize).toBeGreaterThan(0);
        });

        it('reduces size when after text is too long', () => {
            const newSize = calculateOptimalFontSize(10, 30, 20, 24);
            expect(newSize).toBeLessThan(24);
            expect(newSize).toBeGreaterThan(0);
        });

        it('handles zero maxChars by returning 0', () => {
            // When maxChars is 0, return 0 as a safe default
            expect(calculateOptimalFontSize(10, 10, 0, 24)).toBe(0);
        });

        it('handles zero current size', () => {
            expect(calculateOptimalFontSize(10, 10, 20, 0)).toBe(0);
        });
    });
});
