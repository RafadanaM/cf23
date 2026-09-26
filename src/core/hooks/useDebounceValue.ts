import { useEffect, useState } from 'react';

function useDebounceValue<T>(value: T, delayMs: number = 200): [T, boolean] {
  const [state, setState] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setState(value);
      setIsLoading(false);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delayMs]);

  return [state, isLoading];
}

export default useDebounceValue;
