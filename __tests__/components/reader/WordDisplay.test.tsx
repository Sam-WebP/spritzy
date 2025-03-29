import { render, screen } from '@testing-library/react';
import WordDisplay from '@/components/reader/WordDisplay';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import readerReducer from '@/redux/slices/readerSlice';
import settingsReducer from '@/redux/slices/settingsSlice';

const createTestStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            reader: readerReducer,
            settings: settingsReducer
        },
        preloadedState: initialState
    });
};

describe('WordDisplay', () => {
    it('renders word parts correctly', () => {
        const store = createTestStore({
            reader: {
                currentWord: { before: 'he', pivot: 'l', after: 'lo' }
            },
            settings: {
                font: { className: 'font-mono' },
                fontSize: 24,
                letterSpacing: 0,
                showFocusLetter: true,
                showFocusBorder: true
            }
        });

        render(
            <Provider store={store}>
                <WordDisplay />
            </Provider>
        );

        expect(screen.getByText('he')).toBeInTheDocument();
        expect(screen.getByText('l')).toBeInTheDocument();
        expect(screen.getByText('lo')).toBeInTheDocument();
    });

    it('applies font settings correctly', () => {
        const store = createTestStore({
            reader: {
                currentWord: { before: 'h', pivot: 'e', after: 'llo' }
            },
            settings: {
                font: { className: 'font-sans' },
                fontSize: 32,
                letterSpacing: 1,
                showFocusLetter: true,
                showFocusBorder: true
            }
        });

        const { container } = render(
            <Provider store={store}>
                <WordDisplay />
            </Provider>
        );

        const wrapper = container.firstChild?.firstChild?.firstChild;
        expect(wrapper).toHaveClass('font-sans');
        expect(wrapper).toHaveStyle({ fontSize: '32px', letterSpacing: '1px' });
    });

    it('highlights pivot letter when showFocusLetter is true', () => {
        const store = createTestStore({
            reader: {
                currentWord: { before: 'h', pivot: 'e', after: 'llo' }
            },
            settings: {
                font: { className: 'font-mono' },
                fontSize: 24,
                letterSpacing: 0,
                showFocusLetter: true,
                showFocusBorder: false
            }
        });

        render(
            <Provider store={store}>
                <WordDisplay />
            </Provider>
        );

        const pivot = screen.getByText('e');
        expect(pivot).toHaveClass('text-primary');
    });

    it('shows focus border when showFocusBorder is true', () => {
        const store = createTestStore({
            reader: {
                currentWord: { before: 'h', pivot: 'e', after: 'llo' }
            },
            settings: {
                font: { className: 'font-mono' },
                fontSize: 24,
                letterSpacing: 0,
                showFocusLetter: false,
                showFocusBorder: true
            }
        });

        render(
            <Provider store={store}>
                <WordDisplay />
            </Provider>
        );

        const pivot = screen.getByText('e');
        expect(pivot).toHaveClass('border-b-2');
    });
});
