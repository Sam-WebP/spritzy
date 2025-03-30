import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import settingsReducer from '@/redux/slices/settingsSlice';
import DisplaySettings from '@/components/reader/settings/DisplaySettings';
import * as ThemeUtils from '@/utils/theme-utils';
import * as NextThemes from 'next-themes';
import { DEFAULT_SETTINGS, COLOR_THEMES } from '@/utils/constants';

// Mock next-themes
vi.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: vi.fn(),
        resolvedTheme: 'light',
    }),
}));

// Mock COLOR_THEMES
vi.mock('@/utils/constants', () => ({
    DEFAULT_SETTINGS: {
        colorScheme: 'Default',
        // other default settings...
    },
    COLOR_THEMES: [
        {
            name: 'Red',
            light: { primary: '#dc2626' },
            dark: { primary: '#ef4444' }
        },
        {
            name: 'Yellow',
            light: { primary: '#d97706' },
            dark: { primary: '#f59e0b' }
        },
        {
            name: 'Blue',
            light: { primary: '#2563eb' },
            dark: { primary: '#3b82f6' }
        }
    ]
}));

const renderComponent = (initialSettings = {}) => {
    const store = configureStore({
        reducer: { settings: settingsReducer },
        preloadedState: {
            settings: {
                ...DEFAULT_SETTINGS,
                focusModeActive: false,
                autoHideFocusControls: true,
                customThemeColors: {
                    light: { background: '#ffffff', foreground: '#000000', primary: '#3b82f6', primaryForeground: '#ffffff' },
                    dark: { background: '#111827', foreground: '#f3f4f6', primary: '#60a5fa', primaryForeground: '#111827' }
                },
                ...initialSettings
            }
        },
    });
    return render(
        <Provider store={store}>
            <DisplaySettings />
        </Provider>
    );
};

describe('DisplaySettings Theme Switching', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.documentElement.removeAttribute('style');
        document.documentElement.classList.remove('theme-custom', 'using-accent-theme');
    });

    it('should remove custom background inline style when switching to a predefined theme', async () => {
        // Mock initial state with custom theme selected
        renderComponent({
            colorScheme: 'Custom',
            customThemeColors: {
                light: { background: '#ffffff', foreground: '#000000', primary: '#0000ff' },
                dark: { background: '#000000', foreground: '#ffffff', primary: '#ff0000' }
            }
        });

        const redThemeButton = screen.getByRole('button', { name: /Red/i });
        const customBgInputLight = screen.getByLabelText('Background', { selector: '#light-bg' });

        // Simulate changing custom background
        await fireEvent.change(customBgInputLight, { target: { value: '#ff0000' } });

        // Switch to Red theme
        await fireEvent.click(redThemeButton);

        // Verify inline background style was removed
        expect(document.documentElement.style.getPropertyValue('--background')).toBe('');
        expect(document.documentElement.classList.contains('theme-custom')).toBe(false);
    });

    it('should remove custom background inline style when switching to a non-custom theme', async () => {
        renderComponent({
            colorScheme: 'Custom',
            customThemeColors: {
                light: { background: '#ffffff', foreground: '#000000', primary: '#0000ff' },
                dark: { background: '#000000', foreground: '#ffffff', primary: '#ff0000' }
            }
        });

        const redThemeButton = screen.getByRole('button', { name: /Red/i });
        const customBgInputLight = screen.getByLabelText('Background', { selector: '#light-bg' });

        await fireEvent.change(customBgInputLight, { target: { value: '#00ff00' } });
        await fireEvent.click(redThemeButton);

        expect(document.documentElement.style.getPropertyValue('--background')).toBe('');
        expect(document.documentElement.style.getPropertyValue('--primary')).not.toBe('');
        expect(document.documentElement.classList.contains('using-accent-theme')).toBe(true);
    });
});
