import { useEffect, useRef } from 'react';

/**
 * Custom hook for setting intervals that handles cleanup
 * and updates properly with React's lifecycle
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();
  
  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}