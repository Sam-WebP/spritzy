import { describe, it, expect, vi } from 'vitest';
import { persistMiddleware } from '../persistMiddleware';
import type { MiddlewareAPI } from 'redux';

vi.mock('../../../utils/storage-utils', () => ({
    saveToStorage: vi.fn(),
    // Define the structure directly within the mock factory
    STORAGE_KEYS: {
        APP_SETTINGS: 'spritzy_app_settings',
        QUIZ_SETTINGS: 'spritzy_quiz_settings',
        READER_SETTINGS: 'spritzy_reader_settings'
    }
}));

// Re-import saveToStorage AFTER mocking to get the mock function
import { saveToStorage } from '../../../utils/storage-utils';

describe('persistMiddleware', () => {
    const createMockStore = (settings: { colorScheme: string }): MiddlewareAPI => ({
        getState: () => ({ settings }),
        dispatch: vi.fn()
    });

    it('should not call saveToStorage for non-persisted actions', () => {
        const store = createMockStore({ colorScheme: 'Red' });
        const next = vi.fn();
        const action = { type: 'SOME_OTHER_ACTION' };

        const middleware = persistMiddleware(store);
        middleware(next)(action);

        expect(saveToStorage).not.toHaveBeenCalled();
    });

    it('should call saveToStorage for settings/updateCustomColor action', () => {
        const store = createMockStore({ colorScheme: 'Red' });
        const next = vi.fn();
        const action = { type: 'settings/updateCustomColor' };

        const middleware = persistMiddleware(store);
        middleware(next)(action);

        expect(saveToStorage).toHaveBeenCalledWith(
            'spritzy_app_settings',
            { colorScheme: 'Red' }
        );
    });

    it('should call saveToStorage for settings/setColorScheme action', () => {
        const store = createMockStore({ colorScheme: 'Blue' });
        const next = vi.fn();
        const action = { type: 'settings/setColorScheme' };

        const middleware = persistMiddleware(store);
        middleware(next)(action);

        expect(saveToStorage).toHaveBeenCalledWith(
            'spritzy_app_settings',
            { colorScheme: 'Blue' }
        );
    });

    it('should call saveToStorage for settings/resetSettings action', () => {
        const store = createMockStore({ colorScheme: 'Default' });
        const next = vi.fn();
        const action = { type: 'settings/resetSettings' };

        const middleware = persistMiddleware(store);
        middleware(next)(action);

        expect(saveToStorage).toHaveBeenCalledWith(
            'spritzy_app_settings',
            { colorScheme: 'Default' }
        );
    });
});
