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
  // I dont think it should be here but oh well
  options: {
    workTypes: Circle['workTypes'];
    attendingDays: Circle['attendingDays'];
    ratings: Circle['rating'][];
  };
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
    return undefined;
  },
  options: {
    workTypes: [],
    attendingDays: [],
    ratings: []
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
    searchableCircles,
    options
  } = useMemo(() => {
    const map = new Map<CircleId, Circle>();
    const dayOneCircleList: Circle[] = [];
    const dayTwoCircleList: Circle[] = [];
    const bothDaysCircleList: Circle[] = [];
    const searchableCircleList: string[] = [];
    const optionsObj: CircleContextValue['options'] = {
      workTypes: [],
      attendingDays: ['SAT', 'SUN'],
      ratings: ['M', 'PG', 'GA']
    };

    const workTypes = new Set<string>();

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

      circle.workTypes.forEach((wt) => {
        workTypes.add(wt);
      });
    });

    searchableCircleList.push('bad apple touhou');

    optionsObj.workTypes = [...workTypes];

    return {
      circleLookUp: map,
      bothDaysCircles: bothDaysCircleList,
      dayOneCircles: dayOneCircleList,
      dayTwoCircles: dayTwoCircleList,
      searchableCircles: searchableCircleList,
      options: optionsObj
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
      options,
      getCircleDetail,
      isFetching,
      status
    }),
    [
      getCircleDetail,
      isFetching,
      dayTwoCircles,
      dayOneCircles,
      bothDaysCircles,
      searchableCircles,
      options,
      status,
      data?.circles
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
