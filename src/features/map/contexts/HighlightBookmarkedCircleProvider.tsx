import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState
} from 'react';

interface HighlightBookmarkedCirclesContextValue {
  highlightBookmarkedCircles: boolean;
  setHighlightBookmarkedCircles: Dispatch<SetStateAction<boolean>>;
}

const HighlightBookmarkedCirclesContext =
  createContext<HighlightBookmarkedCirclesContextValue>({
    highlightBookmarkedCircles: false,
    setHighlightBookmarkedCircles: () => {
      // noop
    }
  });

function HighlightBookmarkedCirclesProvider({ children }: PropsWithChildren<{}>) {
  const [highlightBookmarkedCircles, setHighlightBookmarkedCircles] = useState(false);

  const value = useMemo(
    () => ({
      highlightBookmarkedCircles,
      setHighlightBookmarkedCircles
    }),
    [highlightBookmarkedCircles]
  );

  return (
    <HighlightBookmarkedCirclesContext.Provider value={value}>
      {children}
    </HighlightBookmarkedCirclesContext.Provider>
  );
}

export default HighlightBookmarkedCirclesProvider;

export const useHighlightBookmarkedCircles = () =>
  useContext(HighlightBookmarkedCirclesContext);
