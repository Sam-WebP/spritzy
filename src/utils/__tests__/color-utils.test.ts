import { describe, it, expect } from 'vitest';
import { hexToRgba } from '../color-utils';

describe('color-utils', () => {
    describe('hexToRgba', () => {
        it('should convert 6-digit hex to rgba', () => {
            expect(hexToRgba('#3b82f6', 1)).toBe('rgba(59, 130, 246, 1)');
            expect(hexToRgba('#3b82f6', 0.5)).toBe('rgba(59, 130, 246, 0.5)');
        });

        it('should convert 3-digit hex to rgba', () => {
            expect(hexToRgba('#abc', 1)).toBe('rgba(170, 187, 204, 1)');
            expect(hexToRgba('#abc', 0.2)).toBe('rgba(170, 187, 204, 0.2)');
        });

        it('should handle undefined input with default rgba', () => {
            expect(hexToRgba(undefined, 1)).toBe('rgba(0, 0, 0, 1)');
            expect(hexToRgba(undefined, 0.8)).toBe('rgba(0, 0, 0, 0.8)');
        });

        it('should handle invalid string input with default rgba', () => {
            expect(hexToRgba('invalid', 1)).toBe('rgba(0, 0, 0, 1)');
            expect(hexToRgba('invalid', 0.3)).toBe('rgba(0, 0, 0, 0.3)');
        });
    });
});
