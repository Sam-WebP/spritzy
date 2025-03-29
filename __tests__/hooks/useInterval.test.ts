import { renderHook } from '@testing-library/react';
import { useInterval } from '@/hooks/useInterval';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useInterval', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sets up interval when delay is provided', () => {
        const callback = vi.fn();
        renderHook(() => useInterval(callback, 1000));

        vi.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('does not set up interval when delay is null', () => {
        const callback = vi.fn();
        renderHook(() => useInterval(callback, null));

        vi.advanceTimersByTime(1000);
        expect(callback).not.toHaveBeenCalled();
    });

    it('cleans up interval on unmount', () => {
        const callback = vi.fn();
        const { unmount } = renderHook(() => useInterval(callback, 1000));

        vi.advanceTimersByTime(500);
        unmount();
        vi.advanceTimersByTime(1000);

        expect(callback).not.toHaveBeenCalled();
    });

    it('updates callback when it changes', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const { rerender } = renderHook(
            ({ callback, delay }) => useInterval(callback, delay),
            {
                initialProps: { callback: callback1, delay: 1000 }
            }
        );

        vi.advanceTimersByTime(500);
        rerender({ callback: callback2, delay: 1000 });
        vi.advanceTimersByTime(1000);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('adjusts interval when delay changes', () => {
        const callback = vi.fn();
        const { rerender } = renderHook(
            ({ delay }) => useInterval(callback, delay),
            {
                initialProps: { delay: 1000 }
            }
        );

        vi.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        rerender({ delay: 2000 });
        vi.advanceTimersByTime(2000);
        expect(callback).toHaveBeenCalledTimes(2);
    });
});
