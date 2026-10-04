import {
  createContext,
  PropsWithChildren,
  startTransition,
  useContext,
  useMemo
} from 'react';
import { useForm, UseFormHandleSubmit, UseFormReturn, useWatch } from 'react-hook-form';
import { Circle } from '@/domain/circle/types';

export type ExtractSetType<T> = T extends Set<infer U> ? U : never;

export type FilterData = {
  fandoms: Set<Circle['fandoms'][number]>;
  workTypes: Set<Circle['workTypes'][number]>;
  attendingDays: Set<Circle['attendingDays'][number]>;
  ratings: Set<Circle['rating']>;
};

type FilterAction = {
  reset: (fieldName?: keyof FilterData) => void;
  toggle: <T extends keyof FilterData>(
    fieldName: T,
    value: ExtractSetType<FilterData[T]>
  ) => void;
  submit: UseFormHandleSubmit<FilterData, FilterData>;
  update: (filterData: FilterData) => void;
};

// not being able to nest RHF FormProvider is moronic, it uses ReactContext anyway like wtf!!
const FilterFormContext = createContext<UseFormReturn<FilterData> | null>(null);

interface FilterProviderProps {
  initialData?: FilterData;
}

function FilterProvider({
  initialData,
  children
}: PropsWithChildren<FilterProviderProps>) {
  const methods = useForm<FilterData>({
    defaultValues: initialData
      ? initialData
      : {
          fandoms: new Set(),
          workTypes: new Set(),
          attendingDays: new Set(),
          ratings: new Set()
        }
  });

  return (
    <FilterFormContext.Provider value={methods}>{children}</FilterFormContext.Provider>
  );
}

export default FilterProvider;

function useFilter() {
  const ctx = useContext(FilterFormContext);

  if (!ctx) {
    throw new Error('useFilterList must be used within FilterProvider!');
  }

  return ctx;
}

export function useFilterList<T extends keyof FilterData>(fieldName: T): FilterData[T];
export function useFilterList(): FilterData;
export function useFilterList<T extends keyof FilterData>(
  fieldName?: T
): FilterData[T] | FilterData {
  const { control } = useFilter();

  const result = useWatch({
    control,
    name: fieldName!
  });

  return result;
}

export function useFilterAction(): FilterAction {
  const { reset, setValue, getValues, handleSubmit } = useFilter();

  return useMemo(
    () => ({
      reset: (fieldName) => {
        if (!fieldName) {
          startTransition(() => {
            reset({
              attendingDays: new Set(),
              fandoms: new Set(),
              workTypes: new Set(),
              ratings: new Set()
            });
          });
        } else {
          setValue(fieldName, new Set(), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
          });
        }
      },

      toggle: (fieldName, nextVal) => {
        const values = getValues(fieldName);

        // @ts-expect-error
        if (values.has(nextVal)) {
          // @ts-expect-error
          values.delete(nextVal);
        } else {
          // @ts-expect-error
          values.add(nextVal);
        }

        // @ts-expect-error dumbass type
        setValue(fieldName, new Set(values), {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        });
      },
      // its a pain too abstract handleSubmit
      submit: handleSubmit,

      update: (filterData: FilterData) => {
        reset(filterData);
      }
    }),
    [getValues, setValue, reset, handleSubmit]
  );
}
