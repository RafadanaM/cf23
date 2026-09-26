import { Activity, memo, useDeferredValue } from 'react';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { useCircleFilter } from '../contexts/CircleFilterProvider';
import CircleBoothLabels from './CircleBoothLabels';
import CircleBooths from './CircleBooths';

function CircleMap() {
  // Always render circle booths that exists both days, switch that's either
  return (
    <>
      <BothDaysCircleBooths />
      <BothDaysCircleBoothsLables />
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
        <DayOneCircleBoothLabels />
      </Activity>

      <Activity mode={attendingDay === 'SUN' ? 'visible' : 'hidden'}>
        <DayTwoCircleBooths />
        <DayTwoCircleBoothLabels />
      </Activity>
    </>
  );
}

const BothDaysCircleBooths = memo(() => {
  const { bothDaysCircles } = useCircle();
  const deferredCircles = useDeferredValue(bothDaysCircles);

  return <CircleBooths circles={deferredCircles} />;
});

const BothDaysCircleBoothsLables = memo(() => {
  const { bothDaysCircles } = useCircle();

  const deferredCircles = useDeferredValue(bothDaysCircles);

  return <CircleBoothLabels circles={deferredCircles} />;
});

const DayOneCircleBooths = memo(() => {
  const { dayOneCircles } = useCircle();

  const deferredCircles = useDeferredValue(dayOneCircles);

  return <CircleBooths circles={deferredCircles} />;
});

const DayTwoCircleBooths = memo(() => {
  const { dayTwoCircles } = useCircle();

  const deferredCircles = useDeferredValue(dayTwoCircles);

  return <CircleBooths circles={deferredCircles} />;
});

const DayOneCircleBoothLabels = memo(() => {
  const { dayOneCircles } = useCircle();

  const deferredCircles = useDeferredValue(dayOneCircles);

  return <CircleBoothLabels circles={deferredCircles} />;
});

const DayTwoCircleBoothLabels = memo(() => {
  const { dayTwoCircles } = useCircle();

  const deferredCircles = useDeferredValue(dayTwoCircles);

  return <CircleBoothLabels circles={deferredCircles} />;
});
