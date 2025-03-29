import readerReducer, {
    setText,
    setWpm,
    setIsPlaying,
    setCurrentWordIndex,
    incrementWordIndex,
    setHighlightPattern,
    processText,
    setWordsAtTime
} from '@/redux/slices/readerSlice';
import { DEFAULT_HIGHLIGHT_PATTERN, DEFAULT_TEXT } from '@/utils/constants';
import { describe, it, expect } from 'vitest';

describe('readerSlice', () => {
    const initialState = readerReducer(undefined, { type: 'unknown' });

    it('should have correct initial state', () => {
        expect(initialState).toMatchObject({
            text: DEFAULT_TEXT,
            wpm: 300,
            isPlaying: false,
            currentWordIndex: 0,
            wordsAtTime: 1
        });
    });

    it('should handle setText', () => {
        const newState = readerReducer(initialState, setText('New text'));
        expect(newState.text).toBe('New text');
    });

    it('should handle setWpm', () => {
        const newState = readerReducer(initialState, setWpm(400));
        expect(newState.wpm).toBe(400);
    });

    it('should handle setIsPlaying', () => {
        const newState = readerReducer(initialState, setIsPlaying(true));
        expect(newState.isPlaying).toBe(true);
    });

    it('should handle setCurrentWordIndex', () => {
        const stateWithWords = readerReducer(initialState, setText('one two three'));
        const newState = readerReducer(stateWithWords, setCurrentWordIndex(1));
        expect(newState.currentWordIndex).toBe(1);
    });

    it('should handle negative index in setCurrentWordIndex', () => {
        const stateWithWords = readerReducer(initialState, setText('one two three'));
        const newState = readerReducer(stateWithWords, setCurrentWordIndex(-1));
        expect(newState.currentWordIndex).toBe(-1);
    });

    it('should handle out-of-bounds index in setCurrentWordIndex', () => {
        const stateWithWords = readerReducer(initialState, setText('one two three'));
        const newState = readerReducer(stateWithWords, setCurrentWordIndex(10));
        expect(newState.currentWordIndex).toBe(10);
    });

    it('should handle incrementWordIndex', () => {
        const stateWithWords = readerReducer(initialState, setText('one two three four'));
        const newState = readerReducer(stateWithWords, incrementWordIndex());
        expect(newState.currentWordIndex).toBe(1);
    });

    it('should handle empty words array in incrementWordIndex', () => {
        const stateWithEmptyWords = readerReducer(initialState, {
            ...setText(''),
            words: [],
            isPlaying: true
        });
        const newState = readerReducer(stateWithEmptyWords, incrementWordIndex());
        expect(newState.currentWordIndex).toBe(1); // Still increments index
        expect(newState.isPlaying).toBe(false); // But stops playing
    });

    it('should stop playing when incrementing past end of text', () => {
        const stateWithWords = readerReducer(initialState, {
            ...setText('one two'),
            isPlaying: true
        });
        const stateAfterFirst = readerReducer(stateWithWords, incrementWordIndex());
        const finalState = readerReducer(stateAfterFirst, incrementWordIndex());
        expect(finalState.isPlaying).toBe(false);
    });

    it('should handle setHighlightPattern', () => {
        const newPattern = [...DEFAULT_HIGHLIGHT_PATTERN, { maxLength: 30, highlightIndex: 10 }];
        const newState = readerReducer(initialState, setHighlightPattern(newPattern));
        expect(newState.highlightPattern).toEqual(newPattern);
    });

    it('should handle processText', () => {
        const newState = readerReducer(initialState, processText());
        expect(newState.words).toEqual(expect.arrayContaining(['Welcome', 'to', 'Spritzy']));
        expect(newState.currentWordIndex).toBe(0);
    });

    it('should handle empty string in processText', () => {
        const stateWithEmptyText = readerReducer(initialState, setText(''));
        const newState = readerReducer(stateWithEmptyText, processText());
        expect(newState.words).toEqual([]);
        expect(newState.currentWordIndex).toBe(0);
    });

    it('should handle whitespace-only string in processText', () => {
        const stateWithWhitespace = readerReducer(initialState, setText('   \n\t  '));
        const newState = readerReducer(stateWithWhitespace, processText());
        expect(newState.words).toEqual([]);
        expect(newState.currentWordIndex).toBe(0);
    });

    it('should handle setWordsAtTime', () => {
        const newState = readerReducer(initialState, setWordsAtTime(2));
        expect(newState.wordsAtTime).toBe(2);
    });

    it('should update words and index when setText is followed by processText', () => {
        const stateAfterSetText = readerReducer(initialState, setText('new test content'));
        const finalState = readerReducer(stateAfterSetText, processText());
        expect(finalState.words).toEqual(['new', 'test', 'content']);
        expect(finalState.currentWordIndex).toBe(0);
    });
});
