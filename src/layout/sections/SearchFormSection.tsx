import {
  lazy,
  useCallback,
  useMemo,
  useState,
  useTransition,
  startTransition,
  Suspense
} from 'react';

import { useMediaQuery } from '@/core/hooks/useMediaQuery';
import { debounce, interactionResponse } from '@/core/utils/scheduler';
import DynamicSearchBar from '@/features/circleList/components/DynamicSearchBar';
import { useSearchForm } from '@/features/circleList/contexts/SearchFormProvider';
import { APP_DRAWER_ID, useAppDrawer } from '@/layout/drawers/useAppDrawer';

import { useNavigationTab } from '../navigation/navigation';

const SearchResult = lazy(() => import('@/features/circleList/components/SearchResult'));

function SearchFormSection() {
  const matches = useMediaQuery('(min-width: 48rem)');
  const [keyword, setKeyword] = useState('');
  const [autocompleteKeyword, setAutocompleteKeyword] = useState('');
  const [isPending, startKeywordTransition] = useTransition();
  const { setTab } = useNavigationTab();

  const { isOpen, setIsOpen } = useSearchForm();
  const { closeDrawer } = useAppDrawer();

  const handleClose = useCallback(() => {
    startTransition(() => {
      setIsOpen(false);
    });
    setKeyword('');
    setAutocompleteKeyword('');
  }, [setIsOpen]);

  const handleFocus = useCallback(async () => {
    startTransition(() => {
      setIsOpen(true);
    });

    await interactionResponse();

    startTransition(() => {
      setTab('MAP');
    });

    await interactionResponse();
    closeDrawer(APP_DRAWER_ID.CIRCLE_DETAIL);
  }, [closeDrawer, setIsOpen, setTab]);

  const handleAutocompleteKeywordChange = useMemo(() => {
    return debounce((inputStr: string) => {
      startKeywordTransition(() => {
        setAutocompleteKeyword(inputStr);
      });
    });
  }, []);

  const handleKeywordChange = useCallback(
    (inputStr: string) => {
      setKeyword(inputStr);
      handleAutocompleteKeywordChange(inputStr);
    },
    [handleAutocompleteKeywordChange]
  );

  return (
    <>
      {isOpen && matches && (
        <div
          className="pointer-events-auto fixed top-0 bottom-0 left-0 right-0 bg-card-foreground/20 backdrop-blur-lg hidden md:block cursor-pointer"
          onClick={handleClose}
        />
      )}
      <DynamicSearchBar
        keyword={keyword}
        onChange={handleKeywordChange}
        isFocused={isOpen}
        onFocus={handleFocus}
        onClose={handleClose}
      />
      {isOpen && (
        <Suspense fallback={<SearchResultLoader />}>
          <SearchResult
            key="search-result"
            keyword={autocompleteKeyword}
            isLoading={isPending}
          />
        </Suspense>
      )}
    </>
  );
}

export default SearchFormSection;

function SearchResultLoader() {
  return (
    <div
      className={
        'fixed flex flex-col top-20 content gap-y-2 left-0 px-2 py-1 right-0 bottom-0 md:bottom-auto overflow-hidden md:right-auto md:left-1/2 md:-translate-x-1/2  bg-secondary border-t border-boder origin-top md:w-full md:max-w-2xl md:h-4/5'
      }
    >
      <div className="h-8 w-20 ml-auto rounded-lg bg-size-[200%_100%] bg-linear-[100deg] from-muted-foreground/30 via-muted-foreground/10 via-background to-muted-foreground/30 animate-shimmer" />
      <div className="h-32 rounded-lg w-full bg-size-[200%_100%] bg-linear-[100deg] from-muted-foreground/30 via-muted-foreground/10 via-background to-muted-foreground/30 animate-shimmer" />
      <div className="h-32 rounded-lg w-full bg-size-[200%_100%] bg-linear-[100deg] from-muted-foreground/30 via-muted-foreground/10 via-background to-muted-foreground/30 animate-shimmer" />
      <div className="h-32 rounded-lg w-full bg-size-[200%_100%] bg-linear-[100deg] from-muted-foreground/30 via-muted-foreground/10 via-background to-muted-foreground/30 animate-shimmer" />
    </div>
  );
}
