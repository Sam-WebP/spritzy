import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../src/redux/store';
import WordDisplay from '../../src/components/reader/WordDisplay';
import { setText, setWpm, setIsPlaying, incrementWordIndex, processText } from '../../src/redux/slices/readerSlice';

// Mock simple controls for testing
const MockControls = () => {
    return (
        <div>
            <input
                data-testid="wpm-input"
                onChange={(e) => store.dispatch(setWpm(Number(e.target.value)))}
            />
            <button
                data-testid="play-button"
                onClick={() => store.dispatch(setIsPlaying(true))}
            >
                Play
            </button>
            <button
                data-testid="pause-button"
                onClick={() => store.dispatch(setIsPlaying(false))}
            >
                Pause
            </button>
        </div>
    );
};

describe('Reader Flow Integration', () => {
    beforeEach(() => {
        store.dispatch(setText('first second third'));
    });

    it('should update WPM in store when changed', async () => {
        const user = userEvent.setup();
        render(
            <Provider store={store}>
                <MockControls />
            </Provider>
        );

        const input = screen.getByTestId('wpm-input');
        await user.type(input, '300');
        expect(store.getState().reader.wpm).toBe(300);
    });

    it('should toggle isPlaying when buttons clicked', async () => {
        const user = userEvent.setup();
        render(
            <Provider store={store}>
                <MockControls />
            </Provider>
        );

        const playButton = screen.getByTestId('play-button');
        const pauseButton = screen.getByTestId('pause-button');

        await user.click(playButton);
        expect(store.getState().reader.isPlaying).toBe(true);

        await user.click(pauseButton);
        expect(store.getState().reader.isPlaying).toBe(false);
    });

    it('should display correct word from store', async () => {
        store.dispatch(setText('first second third'));
        store.dispatch(processText());
        store.dispatch(incrementWordIndex());

        render(
            <Provider store={store}>
                <WordDisplay />
            </Provider>
        );

        // Wait for component to update
        await screen.findByText('s');

        // WordDisplay splits words into parts with focus character
        expect(screen.getByText('s')).toBeInTheDocument();
        expect(screen.getByText('e')).toBeInTheDocument();
        expect(screen.getByText('cond')).toBeInTheDocument();
    });
});
