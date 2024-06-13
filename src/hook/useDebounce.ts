import { useCallback, useEffect, useRef } from 'react';

export function useDebounce(callback: any, delay: number) {
  const latestCallback = useRef(callback);
  const timeoutId = useRef<any>(null);
  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  return useCallback(
    (...args: any) => {
      const handleTimeout = () => {
        latestCallback.current(...args);
      };

      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(handleTimeout, delay);
    },
    [delay]
  );
}
