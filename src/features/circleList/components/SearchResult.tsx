import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useCallback, useDeferredValue, useRef } from 'react';

import { cn } from '@/core/ui/utils';

import { Circle } from '@/domain/circle/types';

import FilterProvider from '../contexts/FilterProvider';
import useFilteredResult from '../hooks/useFilteredResult';
import CircleCard from './CircleCard';
import Filter from './Filter';

interface SearchResultProps {
  keyword: string;
  isLoading: boolean;
}

function SearchResult({ keyword, isLoading }: SearchResultProps) {
  const deferredKeyword = useDeferredValue(keyword);

  const result = useDeferredValue(useFilteredResult({ keyword: deferredKeyword }));

  const showLoading = isLoading || deferredKeyword !== keyword;

  const hasResult = result.length > 0;

  return (
    <div
      className={
        'fixed top-20 left-0 right-0 bottom-0 md:bottom-auto overflow-hidden md:right-auto md:left-1/2 md:-translate-x-1/2  bg-secondary border-t border-boder origin-top md:w-full md:max-w-2xl md:h-4/5'
      }
    >
      <div
        className={cn(
          'relative h-full flex flex-col contain-strict overflow-y-auto',
          showLoading ? 'opacity-50' : 'opacity-100'
        )}
      >
        {!hasResult && (
          <div className="p-2">
            <div className={cn('p-2 rounded-lg gap-1.5')}>
              <p className="text-center text-primary font-medium text-md">
                {'Circle not found'}
              </p>
            </div>
          </div>
        )}
        {hasResult && <CircleCards circlesResult={result} />}
        <Filter resultCount={result.length} />
      </div>
    </div>
  );
}

function SearchResultContainer(props: SearchResultProps) {
  return (
    <FilterProvider>
      <SearchResult {...props} />
    </FilterProvider>
  );
}

export default memo(SearchResultContainer);

interface CircleCardsProps {
  circlesResult: Circle[];
}

const CircleCards = memo(({ circlesResult }: CircleCardsProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const getItemKey = useCallback(
    (index: number) => {
      const circle = circlesResult[index];
      if (!circle) return String(index);

      return `${circle.code}-${circle.name}`;
    },
    [circlesResult]
  );

  const estimateSize = useCallback(() => 128, []);

  // oxlint-disable-next-line react/incompatible-library
  const virtualizer = useVirtualizer({
    count: circlesResult.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize,
    directDomUpdates: true,
    gap: 8,
    paddingStart: 40,
    paddingEnd: 8
  });

  const virtualItems = virtualizer.getVirtualItems();
  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto scrollbar-thin">
      <ul ref={virtualizer.containerRef} className="relative">
        {virtualItems.map(({ key, index }) => (
          <li
            key={key}
            ref={virtualizer.measureElement}
            data-index={index}
            className="absolute w-full px-2"
          >
            <CircleCard circle={circlesResult[index]!} />
          </li>
        ))}
      </ul>
    </div>
  );
});
