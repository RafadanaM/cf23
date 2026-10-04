import { RiCloseLine } from '@remixicon/react';
import { memo, useCallback, useDeferredValue } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/core/ui/components/button';
import Drawer from '@/core/ui/components/drawer/Drawer';
import { DrawerProps } from '@/core/ui/components/drawer/DrawerProvider';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/core/ui/components/input-group';
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

interface FandomForm {
  name: string;
}

// honestly I can use proper form and RHF here with field array and such, but I'm too lazy
function CircleFilterDrawer({ close }: CircleFilterDrawerProps) {
  const { getValues } = useFilterAction();
  const handleSubmit = () => {
    const filterData = getValues();
    close({
      filterData
    });
  };

  return (
    <Drawer close={close}>
      <Drawer.Header className="pb-2 border-b border-border">
        <h3 className="font-semibold text-xl">{'Circles Filter'}</h3>
      </Drawer.Header>

      <Drawer.Body>
        <ResetAllButton />
        <div className="flex flex-col gap-y-3">
          <FandomsFilter />
          <WorkTypesFilter />
          <RatingsFilter />
          <AttendingDaysFilter />
        </div>
      </Drawer.Body>

      <Drawer.Footer className="flex flex-col gap-y-2">
        <Button className="flex-1 py-2" onClick={handleSubmit}>
          {'Apply'}
        </Button>
        <Button variant="secondary" className="flex-1 py-2" onClick={() => close()}>
          {'Close'}
        </Button>
      </Drawer.Footer>
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

function FandomsFilter() {
  const { toggle, add, reset } = useFilterAction();

  const {
    register,
    reset: resetForm,
    handleSubmit
  } = useForm<FandomForm>({
    defaultValues: {
      name: ''
    }
  });
  const activeFilters = useFilterList('fandoms');

  const handleToggle = useCallback(
    (filterName: ExtractSetType<FilterData['fandoms']>) => {
      toggle('fandoms', filterName);
    },
    [toggle]
  );

  const onSubmit: SubmitHandler<FandomForm> = (data) => {
    resetForm();

    add('fandoms', data.name);
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <h4 className="flex font-semibold pb-1 pr-4 border-b-2 border-b-primary">
          {'Fandom'}
        </h4>

        {activeFilters.size > 0 && (
          <Button type="button" variant="ghost" onClick={() => reset('fandoms')}>
            {'Reset'}
          </Button>
        )}
      </div>

      <ul className="flex gap-2 flex-wrap mt-3">
        {[...activeFilters].map((opt) => (
          <FilterPill key={opt} name={opt} isActive onPress={handleToggle} />
        ))}
      </ul>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <InputGroup>
          <InputGroupInput
            placeholder="Add Fandom"
            {...register('name', { required: true })}
            autoComplete={'off'}
          />
          <InputGroupAddon align={'inline-end'}>
            <InputGroupButton type="submit" variant={'secondary'}>
              {'Add'}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </section>
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
    <section>
      <div className="flex items-center justify-between">
        <h4 className="flex font-semibold pb-1 pr-4 border-b-2 border-b-primary">
          {title}
        </h4>

        {activeFilters.size > 0 && (
          <Button type="button" variant="ghost" onClick={() => reset(fieldName)}>
            {'Reset'}
          </Button>
        )}
      </div>

      <ul className="flex gap-2 flex-wrap mt-3">
        {options.map((opt) => (
          <FilterPill
            key={opt}
            name={opt}
            isActive={isActive(opt)}
            // @ts-expect-error
            onPress={handleToggle}
          />
        ))}
      </ul>
    </section>
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
      <li>
        <Button
          className="capitalize"
          variant={isActive ? 'default' : 'outline'}
          onClick={() => onPress(name)}
        >
          {name}
          {isActive && <RiCloseLine />}
        </Button>
      </li>
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
