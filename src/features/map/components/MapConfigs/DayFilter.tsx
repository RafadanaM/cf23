import { motion } from 'motion/react';
import { startTransition, useEffect, useState } from 'react';

import { cn } from '@/core/ui/utils';

import { AttendingDay } from '@/domain/circle/types';

import { useCircleFilter } from '../../contexts/CircleFilterProvider';

function DayFilter() {
  const { attendingDay } = useCircleFilter();
  const [localValue, setLocalValue] = useState(() => attendingDay);

  /**
   * HACKKKK
   * When pressing circle detail, attendingDay might be changed, so we need to sync.
   * Honestly idk whether I still need local state or not. Previously, changing active circle
   * was quite expensive since we will rerender all the circle booth rectangles and labels
   * (even with memo since react still need to reconcile the whole thing, but commits the active one only).
   * Changing implementation to render a separate active rectangle and not touching the rest of rectangles is a lot faster but
   * just in case I will preserve the local state.
   *
   */
  useEffect(() => {
    setLocalValue((prev) => (attendingDay !== prev ? attendingDay : prev));
  }, [attendingDay]);

  return (
    <ul
      role="tablist"
      aria-label="Expo day filter"
      className="flex bg-card items-center gap-1.5 rounded-full border overflow-hidden shadow-xl"
    >
      <FilterButton value="SAT" localValue={localValue} setLocalValue={setLocalValue} />
      <FilterButton value="SUN" localValue={localValue} setLocalValue={setLocalValue} />
    </ul>
  );
}

export default DayFilter;

interface FilterButtonProps {
  value: AttendingDay;
  localValue: AttendingDay;
  setLocalValue: (newValue: AttendingDay) => void;
}

function FilterButton({ value, localValue, setLocalValue }: FilterButtonProps) {
  const { setAttendingDay } = useCircleFilter();

  const isActive = localValue === value;

  const handleChangeAttendingDay = () => {
    setLocalValue(value);

    startTransition(() => {
      setAttendingDay(value);
    });
  };

  return (
    <li role="group" className="relative">
      <button
        type="button"
        aria-label={value === 'SAT' ? 'Filter Saturday' : 'Filter Sunday'}
        aria-selected={isActive}
        className={cn(
          'relative text-sm font-semibold cursor-pointer px-3 py-1 bg-transparent z-10',
          isActive && 'text-white'
        )}
        onClick={handleChangeAttendingDay}
      >
        {value}
      </button>
      {isActive && (
        <motion.div
          className="inset-0 border border-primary absolute bg-primary"
          layoutId={`circle-filter-pill-highlighter`}
          transition={{ type: 'tween', duration: 0.15 }}
        />
      )}
    </li>
  );
}
