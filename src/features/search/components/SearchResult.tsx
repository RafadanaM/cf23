import uFuzzy from '@leeoniya/ufuzzy';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useCallback, useDeferredValue, useMemo, useRef } from 'react';

import { cn } from '@/core/ui/utils';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';

import CircleCard from './CircleCard';

interface SearchResultProps {
  keyword: string;
  isLoading: boolean;
}

const uf = new uFuzzy({
  intraMode: 1
});

function SearchResult({ keyword, isLoading }: SearchResultProps) {
  const { circles, searchableCircles } = useCircle();

  const deferredKeyword = useDeferredValue(keyword);

  // holy shit ufuzzy is fkin fast
  const result: Circle[] = useMemo(() => {
    const query = deferredKeyword.trim();
    if (!query) return circles;

    const idxs = uf.filter(searchableCircles, query);

    if (!idxs || idxs.length === 0) return [];

    const info = uf.info(idxs, searchableCircles, query);

    const order = uf.sort(info, searchableCircles, query);

    return order.map((i) => circles[info.idx[i]!]!);
  }, [circles, deferredKeyword, searchableCircles]);

  const showLoading = isLoading || deferredKeyword !== keyword;

  const hasResult = result.length > 0;

  return (
    <div
      className={cn(
        'fixed top-20 left-0 right-0 bottom-0 md:bottom-auto overflow-hidden md:right-auto md:left-1/2 md:-translate-x-1/2  bg-secondary border-t border-boder origin-top md:w-full md:max-w-2xl md:h-4/5'
      )}
    >
      <div
        className={cn(
          'h-full flex flex-col contain-strict overflow-y-auto',
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
      </div>
    </div>
  );
}

export default memo(SearchResult);
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
    paddingStart: 8,
    paddingEnd: 8
  });

  const virtualItems = virtualizer.getVirtualItems();
  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto">
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
