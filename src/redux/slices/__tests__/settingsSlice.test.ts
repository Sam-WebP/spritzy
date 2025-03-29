import { describe, it, expect, vi } from 'vitest';
import {
    updateCustomColor,
    setColorScheme,
    resetSettings
} from '../settingsSlice';
import { getContrastColor } from '../../../utils/theme-utils';
import {
    COLOR_THEMES,
    DEFAULT_SETTINGS,
    DEFAULT_MICRO_PAUSE_SETTINGS
} from '../../../utils/constants';
import settingsSlice from '../settingsSlice';

// Mock storage utils with all required exports
vi.mock('../../../utils/storage-utils', () => ({
    loadFromStorage: vi.fn().mockReturnValue({
        // Return a *complete* plausible saved state for initial state tests
        colorScheme: 'Blue', // Saved scheme
        fontSize: 22,       // Saved size
        customThemeColors: { // Saved custom colors
            light: { background: '#eee', foreground: '#111', primary: '#ff0000', primaryForeground: '#ffffff' },
            dark: { background: '#222', foreground: '#ddd', primary: '#00ff00', primaryForeground: '#000000' }
        },
        // ... other potentially saved settings
    }),
    saveToStorage: vi.fn(),
    // Define the structure directly
    STORAGE_KEYS: {
        APP_SETTINGS: 'spritzy_app_settings',
        QUIZ_SETTINGS: 'spritzy_quiz_settings',
        READER_SETTINGS: 'spritzy_reader_settings'
    }
}));

describe('settingsSlice', () => {
    describe('initial state', () => {
        it('should initialize with default values merged with storage', () => {
            const state = settingsSlice(undefined, { type: 'unknown' });
            // Assert against the mocked values from loadFromStorage
            expect(state.colorScheme).toBe('Blue');
            expect(state.fontSize).toBe(22);
            expect(state.customThemeColors.light.background).toBe('#eee');
            expect(state.customThemeColors.dark.primary).toBe('#00ff00');
            // Assert that settings *not* in the mock return value fall back to defaults
            expect(state.letterSpacing).toBe(DEFAULT_SETTINGS.letterSpacing);
            expect(state.showFocusLetter).toBe(DEFAULT_SETTINGS.showFocusLetter);
        });
    });

    describe('updateCustomColor', () => {
        it('should update light mode background color', () => {
            const initialState = settingsSlice(undefined, { type: 'unknown' });
            const state = settingsSlice(
                initialState,
                updateCustomColor({ mode: 'light', property: 'background', value: '#ffffff' })
            );
            expect(state.customThemeColors.light.background).toBe('#ffffff');
        });

        it('should update dark mode foreground color', () => {
            const initialState = settingsSlice(undefined, { type: 'unknown' });
            const state = settingsSlice(
                initialState,
                updateCustomColor({ mode: 'dark', property: 'foreground', value: '#e5e7eb' })
            );
            expect(state.customThemeColors.dark.foreground).toBe('#e5e7eb');
        });

        it('should update primary and primaryForeground for light mode', () => {
            const initialState = settingsSlice(undefined, { type: 'unknown' });
            const state = settingsSlice(
                initialState,
                updateCustomColor({ mode: 'light', property: 'primary', value: '#1e40af' })
            );
            expect(state.customThemeColors.light.primary).toBe('#1e40af');
            expect(state.customThemeColors.light.primaryForeground).toBe(
                getContrastColor('#1e40af')
            );
        });

        it('should update state with invalid value and default contrast', () => {
            const initialState = settingsSlice(undefined, { type: '@@INIT' });
            const action = updateCustomColor({ mode: 'light', property: 'primary', value: 'invalid-color' });
            const state = settingsSlice(initialState, action);

            expect(state.customThemeColors.light.primary).toBe('invalid-color');
            // Assuming getContrastColor returns white for invalid input
            expect(state.customThemeColors.light.primaryForeground).toBe(getContrastColor('invalid-color'));
        });
    });

    describe('setColorScheme', () => {
        it('should update colorScheme to Red', () => {
            const initialState = settingsSlice(undefined, { type: 'unknown' });
            const state = settingsSlice(
                initialState,
                setColorScheme('Red')
            );
            expect(state.colorScheme).toBe('Red');
        });

        it('should update colorScheme to Custom', () => {
            const initialState = settingsSlice(undefined, { type: 'unknown' });
            const state = settingsSlice(
                initialState,
                setColorScheme('Custom')
            );
            expect(state.colorScheme).toBe('Custom');
        });
    });

    describe('resetSettings', () => {
        it('should reset settings, including custom colors, to defaults', () => {
            const initialState = settingsSlice(undefined, { type: '@@INIT' });
            // Create a modified state using the reducer
            const changedState1 = settingsSlice(initialState, setColorScheme('Custom'));
            const changedState2 = settingsSlice(changedState1, updateCustomColor({ mode: 'light', property: 'background', value: '#000' }));

            // Dispatch the reset action
            const finalState = settingsSlice(changedState2, resetSettings());

            // Assert against known defaults (DEFAULT_SETTINGS and defaultCustomColorsForTest)
            expect(finalState.colorScheme).toBe(DEFAULT_SETTINGS.colorScheme);
            expect(finalState.fontSize).toBe(DEFAULT_SETTINGS.fontSize);
            expect(finalState.customThemeColors).toEqual({
                light: {
                    background: '#ffffff',
                    foreground: '#111827',
                    primary: '#3b82f6',
                    primaryForeground: getContrastColor('#3b82f6'),
                },
                dark: {
                    background: '#111827',
                    foreground: '#f3f4f6',
                    primary: '#60a5fa',
                    primaryForeground: getContrastColor('#60a5fa'),
                }
            });
            expect(finalState.microPauses).toEqual(DEFAULT_MICRO_PAUSE_SETTINGS);
            expect(finalState.focusModeActive).toBe(false);
        });
    });
});
