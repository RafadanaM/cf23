import { QueryStatus, useQuery } from '@tanstack/react-query';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo
} from 'react';

import getCircleAPI from '../api/getCircleAPI';
import { Circle, CircleId } from '../types';

interface CircleContextValue {
  circles: Circle[];
  dayOneCircles: Circle[];
  dayTwoCircles: Circle[];
  bothDaysCircles: Circle[];
  searchableCircles: string[];
  status: QueryStatus;
  getCircleDetail: (circleId: CircleId) => Circle | undefined;
}

const CircleContext = createContext<CircleContextValue>({
  circles: [],
  dayOneCircles: [],
  dayTwoCircles: [],
  bothDaysCircles: [],
  searchableCircles: [],
  status: 'pending',
  getCircleDetail: (_circleId: CircleId) => {
    // noop
  }
});

function CircleProvider({ children }: PropsWithChildren<{}>) {
  const queryFn = useCallback(async () => {
    const res = await getCircleAPI();

    if (!res.ok) {
      throw new Error('failed to fetch circle data');
    }

    return res.data;
  }, []);

  const { data, isFetching, status } = useQuery({
    queryKey: ['circles'],
    queryFn
  });

  const {
    circleLookUp,
    dayOneCircles,
    dayTwoCircles,
    bothDaysCircles,
    searchableCircles
  } = useMemo(() => {
    const map = new Map<CircleId, Circle>();
    const dayOneCircleList: Circle[] = [];
    const dayTwoCircleList: Circle[] = [];
    const bothDaysCircleList: Circle[] = [];
    const searchableCircleList: string[] = [];

    data?.circles.forEach((circle) => {
      map.set(circle.id, circle);

      searchableCircleList.push(
        `${circle.name} ${circle.code} ${circle.fandoms.join(' ')}`
      );

      // both days
      if (circle.attendingDays.length === 2) {
        bothDaysCircleList.push(circle);
      } else if (circle.attendingDays.includes('SAT')) {
        dayOneCircleList.push(circle);
      } else if (circle.attendingDays.includes('SUN')) {
        dayTwoCircleList.push(circle);
      }
    });

    return {
      circleLookUp: map,
      bothDaysCircles: bothDaysCircleList,
      dayOneCircles: dayOneCircleList,
      dayTwoCircles: dayTwoCircleList,
      searchableCircles: searchableCircleList
    };
  }, [data?.circles]);

  const getCircleDetail = useCallback(
    (circleId: CircleId) => {
      return circleLookUp.get(circleId);
    },
    [circleLookUp]
  );
  const memoedValue = useMemo(
    () => ({
      circles: data?.circles ?? [],
      bothDaysCircles,
      dayOneCircles,
      dayTwoCircles,
      searchableCircles,
      getCircleDetail,
      isFetching,
      status
    }),
    [
      getCircleDetail,
      data?.circles,
      isFetching,
      dayTwoCircles,
      dayOneCircles,
      bothDaysCircles,
      searchableCircles,
      status
    ]
  );

  return <CircleContext.Provider value={memoedValue}>{children}</CircleContext.Provider>;
}

export default CircleProvider;

export function useCircle() {
  const circleCtx = useContext(CircleContext);

  if (!circleCtx) {
    throw new Error('useCircle must be used with CircleProvider!');
  }

  return circleCtx;
}
