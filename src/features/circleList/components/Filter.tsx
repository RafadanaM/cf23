import { RiFilterLine, RiFilterFill, RiCloseLine } from '@remixicon/react';

import { Button } from '@/core/ui/components/button';

import { memo, startTransition, useDeferredValue } from 'react';
import { useAppDrawer } from '@/layout/drawers/useAppDrawer';
import { useFilterAction, useFilterList } from '../contexts/FilterProvider';

interface FilterProps {
  resultCount: number;
}

function Filter({ resultCount }: FilterProps) {
  return (
    <div className="absolute top-0 left-0-0 w-full flex justify-between items-center gap-x-2 py-1 px-2 sm:px-4">
      {resultCount > 0 && (
        <span className="text-sm text-muted-foreground block font-medium py-1 px-2 bg-card rounded-md border border-border">{`Circles found: ${resultCount}`}</span>
      )}

      <ClearFilterButton />
      <FilterButton />
    </div>
  );
}

export default Filter;

const ClearFilterButton = memo(() => {
  const filters = useFilterList();
  const { reset } = useFilterAction();

  const isFiltered = useDeferredValue(
    filters.attendingDays.size ||
      filters.fandoms.size ||
      filters.workTypes.size ||
      filters.ratings.size
  );

  if (!isFiltered) return null;

  return (
    <Button variant="destructive" className="ml-auto" onClick={() => reset()}>
      <RiCloseLine />
      {'Clear'}
    </Button>
  );
});

const FilterButton = memo(() => {
  const { openDrawer } = useAppDrawer();
  const filters = useFilterList();
  const { update } = useFilterAction();

  const totalFiltered = useDeferredValue(
    Object.values(filters).reduce((acc, curr) => acc + curr.size, 0)
  );

  const handleClick = () => {
    openDrawer('CIRCLE_FILTER', {
      filterData: filters,
      onClose: (closeProps) => {
        startTransition(() => {
          if (closeProps?.filterData) {
            update(closeProps.filterData);
          }
        });
      }
    });
  };

  const label = totalFiltered > 0 ? `Filter (${totalFiltered})` : 'Filter';

  return (
    <Button className="shadow-xl" onClick={handleClick}>
      {totalFiltered > 0 ? <RiFilterFill /> : <RiFilterLine />}
      {label}
    </Button>
  );
});
