import { RiCloseLine } from '@remixicon/react';
import { memo, useCallback, useDeferredValue } from 'react';
import { Button } from '@/core/ui/components/button';
import Drawer from '@/core/ui/components/drawer/Drawer';
import { DrawerProps } from '@/core/ui/components/drawer/DrawerProvider';
import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import FilterProvider, {
  ExtractSetType,
  FilterData,
  useFilterAction,
  useFilterList
} from '@/features/circleList/contexts/FilterProvider';

interface CircleFilterDrawerProps extends DrawerProps<{
  filterData?: FilterData;
}> {
  filterData: FilterData;
}

function CircleFilterDrawer({ close }: CircleFilterDrawerProps) {
  const { submit } = useFilterAction();
  const onSubmit = async (data: FilterData) => {
    close({
      filterData: data
    });
  };

  return (
    <Drawer close={close}>
      <form onSubmit={submit(onSubmit)}>
        <Drawer.Header className="pb-3 border-b border-border">
          <h3 className="font-semibold text-xl">{'Circles Filter'}</h3>
        </Drawer.Header>

        <Drawer.Body className="flex flex-col gap-y-4">
          <ResetAllButton />
          <WorkTypesFilter />
          <RatingsFilter />
          <AttendingDaysFilter />
        </Drawer.Body>

        <Drawer.Footer className="flex flex-col gap-y-2">
          <Button type="submit" className="flex-1 py-2">
            {'Apply'}
          </Button>
          <Button variant="secondary" className="flex-1 py-2" onClick={() => close()}>
            {'Close'}
          </Button>
        </Drawer.Footer>
      </form>
    </Drawer>
  );
}

function ResetAllButton() {
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
    <Button className="self-end" variant="destructive" onClick={() => reset()}>
      {'Reset All Filters'}
    </Button>
  );
}

function WorkTypesFilter() {
  const {
    options: { workTypes }
  } = useCircle();

  return <FilterSection title="Work Type" fieldName="workTypes" options={workTypes} />;
}

function AttendingDaysFilter() {
  const {
    options: { attendingDays }
  } = useCircle();

  return (
    <FilterSection
      title="Attending Day"
      fieldName="attendingDays"
      options={attendingDays}
    />
  );
}

function RatingsFilter() {
  const {
    options: { ratings }
  } = useCircle();

  return <FilterSection title="Rating" fieldName="ratings" options={ratings} />;
}

interface FilterSectionProps<T extends keyof FilterData> {
  title: string;
  fieldName: T;
  options: ExtractSetType<FilterData[T]>[];
}

function FilterSection<T extends keyof FilterData>({
  title,
  fieldName,
  options
}: FilterSectionProps<T>) {
  const { toggle, reset } = useFilterAction();
  const activeFilters = useFilterList(fieldName);

  const isActive = (filter: ExtractSetType<FilterData[T]>) => {
    // @ts-expect-error
    return activeFilters.has(filter);
  };

  const handleToggle = useCallback(
    (filterName: ExtractSetType<FilterData[T]>) => {
      toggle(fieldName, filterName);
    },
    [fieldName, toggle]
  );

  return (
    <fieldset>
      <div className="flex items-center justify-between">
        <legend className="flex font-semibold pb-1 pr-4 border-b-2 border-b-primary">
          {title}
        </legend>

        {activeFilters.size > 0 && (
          <Button type="button" variant="ghost" onClick={() => reset(fieldName)}>
            {'Reset'}
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mt-3">
        {options.map((opt) => (
          <FilterPill
            key={opt}
            name={opt}
            isActive={isActive(opt)}
            // @ts-expect-error
            onPress={handleToggle}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface FilterPillProps<T extends keyof FilterData> {
  name: ExtractSetType<FilterData[T]>;
  isActive?: boolean;
  onPress: (filterName: ExtractSetType<FilterData[T]>) => void;
}

const FilterPill = memo(
  <T extends keyof FilterData>({ name, isActive, onPress }: FilterPillProps<T>) => {
    return (
      <Button asChild variant={isActive ? 'default' : 'outline'}>
        <label>
          <input
            type="checkbox"
            name={name}
            value={name}
            checked={isActive}
            onChange={() => onPress(name)}
            className="sr-only"
          />

          {name}
          {isActive && <RiCloseLine />}
        </label>
      </Button>
    );
  }
);

function CircleFilterDrawerContainer({ close, filterData }: CircleFilterDrawerProps) {
  return (
    <FilterProvider initialData={filterData}>
      <CircleFilterDrawer close={close} filterData={filterData} />
    </FilterProvider>
  );
}

export default CircleFilterDrawerContainer;
