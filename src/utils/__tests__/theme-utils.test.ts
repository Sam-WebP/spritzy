import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getThemeColors,
    applyThemeColors,
    removeCustomTheme,
    getContrastColor
} from '../theme-utils';
import { COLOR_THEMES } from '../constants';

describe('theme-utils', () => {
    let mockSetProperty: ReturnType<typeof vi.fn>;
    let mockRemoveProperty: ReturnType<typeof vi.fn>;
    let mockClassList: {
        add: ReturnType<typeof vi.fn>;
        remove: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        mockSetProperty = vi.fn();
        mockRemoveProperty = vi.fn();
        mockClassList = {
            add: vi.fn(),
            remove: vi.fn()
        };

        // Mock document.documentElement
        global.document = {
            documentElement: {
                style: {
                    setProperty: mockSetProperty,
                    removeProperty: mockRemoveProperty
                },
                classList: mockClassList
            }
        } as unknown as Document;
    });

    describe('getThemeColors', () => {
        it('should return light colors for known theme when isDarkMode is false', () => {
            const result = getThemeColors('Red', false);
            expect(result).toEqual(COLOR_THEMES[0].light);
        });

        it('should return dark colors for known theme when isDarkMode is true', () => {
            const result = getThemeColors('Red', true);
            expect(result).toEqual(COLOR_THEMES[0].dark);
        });

        it('should return default theme colors for unknown theme name', () => {
            const result = getThemeColors('Unknown', false);
            expect(result).toEqual(COLOR_THEMES[0].light);
        });
    });

    describe('applyThemeColors', () => {
        it('should apply custom theme colors and classes when isCustomTheme is true', () => {
            const colors = {
                background: '#ffffff',
                foreground: '#000000',
                primary: '#3b82f6',
                primaryForeground: '#ffffff'
            };

            applyThemeColors(colors, true);

            expect(mockSetProperty).toHaveBeenCalledWith('--background', '#ffffff');
            expect(mockSetProperty).toHaveBeenCalledWith('--foreground', '#000000');
            expect(mockSetProperty).toHaveBeenCalledWith('--primary', '#3b82f6');
            expect(mockSetProperty).toHaveBeenCalledWith('--primary-foreground', '#ffffff');
            expect(mockClassList.add).toHaveBeenCalledWith('theme-custom');
            expect(mockClassList.remove).toHaveBeenCalledWith('using-accent-theme');
        });

        it('should apply only primary colors and classes when isCustomTheme is false', () => {
            const colors = {
                background: '#ffffff',
                foreground: '#000000',
                primary: '#3b82f6',
                primaryForeground: '#ffffff'
            };

            applyThemeColors(colors, false);

            expect(mockSetProperty).toHaveBeenCalledWith('--primary', '#3b82f6');
            expect(mockSetProperty).toHaveBeenCalledWith('--primary-foreground', '#ffffff');
            expect(mockSetProperty).not.toHaveBeenCalledWith('--background', expect.anything());
            expect(mockSetProperty).not.toHaveBeenCalledWith('--foreground', expect.anything());
            expect(mockClassList.add).toHaveBeenCalledWith('using-accent-theme');
            expect(mockClassList.remove).toHaveBeenCalledWith('theme-custom');
        });
    });

    describe('removeCustomTheme', () => {
        it('should remove all custom theme properties and classes', () => {
            removeCustomTheme();

            expect(mockRemoveProperty).toHaveBeenCalledWith('--background');
            expect(mockRemoveProperty).toHaveBeenCalledWith('--foreground');
            expect(mockRemoveProperty).toHaveBeenCalledWith('--primary');
            expect(mockRemoveProperty).toHaveBeenCalledWith('--primary-foreground');
            expect(mockClassList.remove).toHaveBeenCalledWith('theme-custom');
            expect(mockClassList.remove).toHaveBeenCalledWith('using-accent-theme');
        });
    });

    describe('getContrastColor', () => {
        it('should return #ffffff for dark colors', () => {
            expect(getContrastColor('#000000')).toBe('#ffffff');
            expect(getContrastColor('#111827')).toBe('#ffffff');
        });

        it('should return #000000 for light colors', () => {
            expect(getContrastColor('#ffffff')).toBe('#000000');
            expect(getContrastColor('#eff6ff')).toBe('#000000');
        });

        it('should return #ffffff for invalid input', () => {
            expect(getContrastColor('invalid')).toBe('#ffffff');
            expect(getContrastColor('#abc')).toBe('#ffffff');
        });
    });
});
