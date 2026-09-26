import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState
} from 'react';
import { AttendingDay } from '@/domain/circle/types';

type CircleFilterContextValue = {
  attendingDay: AttendingDay;
  setAttendingDay: Dispatch<SetStateAction<AttendingDay>>;
};

const CircleFilterContext = createContext<CircleFilterContextValue>({
  attendingDay: 'SAT',
  setAttendingDay: () => {
    // noop
  }
});

function CircleFilterProvider({ children }: PropsWithChildren<{}>) {
  const [attendingDay, setAttendingDay] = useState<AttendingDay>('SAT');

  const value = useMemo(
    () => ({
      attendingDay,
      setAttendingDay
    }),
    [attendingDay]
  );

  return <CircleFilterContext value={value}>{children}</CircleFilterContext>;
}

export default CircleFilterProvider;

export const useCircleFilter = () => {
  const ctx = useContext(CircleFilterContext);

  if (!ctx) {
    throw new Error('useCircleFilter must be used with CircleFilterProvider');
  }

  return ctx;
};
