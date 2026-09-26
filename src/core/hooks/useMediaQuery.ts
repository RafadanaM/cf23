import { useCallback, useEffect, useState } from 'react';

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === 'undefined';

export function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = useCallback(
    (queryMatch: string): boolean => {
      if (IS_SERVER) {
        return defaultValue;
      }
      return window.matchMedia(queryMatch).matches;
    },
    [defaultValue]
  );

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    function handleChange() {
      setMatches(getMatches(query));
    }

    // Triggered at the first client-side load and if query changes
    handleChange();

    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query, getMatches]);

  return matches;
}
