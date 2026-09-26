import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

type SearchFormContextValue = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const SearchFormContext = createContext<SearchFormContextValue>({
  isOpen: false,
  setIsOpen: (_value: boolean) => {
    // noop
  }
});

function SearchFormProvider({ children }: PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen
    }),
    [isOpen]
  );

  return (
    <SearchFormContext.Provider value={value}>{children}</SearchFormContext.Provider>
  );
}

export default SearchFormProvider;

export const useSearchForm = () => {
  const ctx = useContext(SearchFormContext);

  if (!ctx) {
    throw new Error('useSearchForm must be used within SearchFormProvider');
  }

  return ctx;
};
