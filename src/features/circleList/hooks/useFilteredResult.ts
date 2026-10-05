import uFuzzy from '@leeoniya/ufuzzy';
import { useMemo } from 'react';

import { BAD_APPLE_ID } from '@/domain/circle/constants';
import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';
import { MAP_HEIGHT, MAP_WIDTH } from '@/features/map/constants/map';

import { useFilterList } from '../contexts/FilterProvider';

const uf = new uFuzzy({
  intraMode: 1
});

interface Props {
  keyword: string;
}

function useFilteredResult({ keyword }: Props) {
  const { circles, options } = useCircle();
  const { attendingDays, ratings, workTypes, fandoms } = useFilterList();

  const circlesInitialResult: Circle[] = useMemo(
    () => [
      ...circles,
      {
        code: 'Gensokyo',
        attendingDays: ['SAT', 'SUN'],
        circleType: 'BOOTH_B',
        displayConfig: {
          backgroundColor: '',
          backgroundColorHover: '',
          borderColor: ''
        },
        fandoms: ['Touhou', 'Bad Apple', 'Zun'],
        id: BAD_APPLE_ID,
        imageUrl: '/bad_apple.webp',
        name: 'Bad Apple',
        rating: 'PG',
        sampleWorks: [],
        socialMedias: [],
        workTypes: ['Bad Apple'],
        rect: {
          height: 0,
          width: 0,
          direction: 'VERTICAL',
          x: MAP_WIDTH / 2,
          y: MAP_HEIGHT / 2
        }
      }
    ],
    [circles]
  );

  const filteredResult = useMemo(() => {
    performance.mark('FILTER START');
    const isAttendingDaysFiltered =
      attendingDays.size > 0 && attendingDays.size < options.attendingDays.length;
    const isWorkTypesFiltered =
      workTypes.size > 0 && workTypes.size < options.workTypes.length;

    const isRatingFiltered = ratings.size > 0 && ratings.size < options.ratings.length;

    const isFandomFiltered = fandoms.size > 0;

    if (
      !isAttendingDaysFiltered &&
      !isWorkTypesFiltered &&
      !isRatingFiltered &&
      !isFandomFiltered
    ) {
      return circlesInitialResult;
    }

    let result: Circle[] = [];

    result = circlesInitialResult.filter((circle) => {
      const circleAttendingDays =
        !isAttendingDaysFiltered ||
        circle.attendingDays.some((day) => attendingDays.has(day));

      const circleWorkTypes =
        !isWorkTypesFiltered ||
        circle.workTypes.some((workType) => workTypes.has(workType));

      const circleRating = !isRatingFiltered || ratings.has(circle.rating);

      return circleAttendingDays && circleWorkTypes && circleRating;
    });

    if (isFandomFiltered) {
      let query = '';

      fandoms.forEach((fandom) => {
        query += fandom.toLowerCase() + ' ';
      });

      const fandomSearchables = result.map((circle) => circle.fandoms.join(' '));

      const idxs = uf.filter(fandomSearchables, query);

      if (!idxs || idxs.length == 0) return [];

      const info = uf.info(idxs, fandomSearchables, query);

      const order = uf.sort(info, fandomSearchables, query);

      result = order.map((i) => result[info.idx[i]!]!);
    }
    performance.mark('FILTER END');

    return result;
  }, [
    circlesInitialResult,
    attendingDays,
    options.attendingDays.length,
    options.ratings.length,
    workTypes,
    ratings,
    options.workTypes.length,
    fandoms
  ]);

  // holy shit ufuzzy is fkin fast
  const result: Circle[] = useMemo(() => {
    performance.mark('SEARCH START');
    const query = keyword.trim();

    if (!query) return filteredResult;
    const filterSearchables = filteredResult.map(
      (circle) => `${circle.name} ${circle.code} ${circle.fandoms.join(' ')}`
    );
    const idxs = uf.filter(filterSearchables, query);

    if (!idxs || idxs.length === 0) return [];

    const info = uf.info(idxs, filterSearchables, query);

    const order = uf.sort(info, filterSearchables, query);

    const orderedResult = order.map((i) => filteredResult[info.idx[i]!]!);
    performance.mark('SEARCH END');
    return orderedResult;
  }, [keyword, filteredResult]);

  return result;
}

export default useFilteredResult;
