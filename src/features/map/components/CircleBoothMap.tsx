import { Activity, memo, useDeferredValue, useEffect, useState } from 'react';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { interactionResponse } from '@/core/utils/scheduler';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import CircleBoothLabels from './CircleBoothLabels';
import CircleBooths from './CircleBooths';

function CircleMap() {
  // Always render circle booths that exists both days, switch that's either
  return (
    <>
      <BothDaysCircleBooths />
      <EitherDaysCircles />
    </>
  );
}

export default memo(CircleMap);

function EitherDaysCircles() {
  const { attendingDay } = useCircleFilter();

  return (
    <>
      <Activity mode={attendingDay === 'SAT' ? 'visible' : 'hidden'}>
        <DayOneCircleBooths />
      </Activity>

      <Activity mode={attendingDay === 'SUN' ? 'visible' : 'hidden'}>
        <DayTwoCircleBooths />
      </Activity>
    </>
  );
}

const BothDaysCircleBooths = memo(() => {
  const { bothDaysCircles } = useCircle();

  const renderedCount = useChunkRenderItems(bothDaysCircles);
  const chunkedCircles = useDeferredValue(bothDaysCircles.slice(0, renderedCount));

  return (
    <>
      <CircleBooths circles={chunkedCircles} />
      <CircleBoothLabels circles={chunkedCircles} />
    </>
  );
});

const DayOneCircleBooths = memo(() => {
  const { dayOneCircles } = useCircle();

  const renderedCount = useChunkRenderItems(dayOneCircles, 20);
  const chunkedCircles = useDeferredValue(dayOneCircles.slice(0, renderedCount));

  return (
    <>
      <CircleBooths circles={chunkedCircles} />
      <CircleBoothLabels circles={chunkedCircles} />
    </>
  );
});

const DayTwoCircleBooths = memo(() => {
  const { dayTwoCircles } = useCircle();

  const renderedCount = useChunkRenderItems(dayTwoCircles, 20);
  const chunkedCircles = useDeferredValue(dayTwoCircles.slice(0, renderedCount));

  return (
    <>
      <CircleBooths circles={chunkedCircles} />
      <CircleBoothLabels circles={chunkedCircles} />
    </>
  );
});

function useChunkRenderItems<T>(items: T[], chunkSize = 150) {
  const [renderedCount, setRenderedCount] = useState(0);

  useEffect(() => {
    let currentCount = 0;

    const batchCount = Math.ceil(items.length / chunkSize);

    async function processBatch() {
      for (let i = 0; i < batchCount; i++) {
        currentCount = Math.min(currentCount + chunkSize, items.length);
        setRenderedCount(currentCount);
        await interactionResponse();
      }
    }

    processBatch();
  }, [chunkSize, items.length]);

  return renderedCount;
}
