import { cn } from '@/lib/utils';
import { describe, it, expect } from 'vitest';

describe('cn utility function', () => {
    it('merges class names with no conflicts', () => {
        expect(cn('text-red-500', 'font-bold')).toBe('text-red-500 font-bold');
    });

    it('handles tailwind merge conflicts correctly', () => {
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('handles conditional class names', () => {
        expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
        expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
    });

    it('handles undefined/null values', () => {
        expect(cn('base-class', undefined, null)).toBe('base-class');
    });

    it('handles empty strings', () => {
        expect(cn('', 'active', '')).toBe('active');
    });

    it('handles object syntax', () => {
        expect(cn({ 'bg-red-500': true, 'text-white': false })).toBe('bg-red-500');
    });

    it('handles mixed inputs', () => {
        expect(cn('base', ['array-item'], { 'object-class': true })).toBe('base array-item object-class');
    });
});
