import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { useCircleFilter } from '../contexts/CircleFilterProvider';
import BoothRectangle from './BoothRectangle';

function AllBooths() {
  return (
    <>
      <BoothDaysBooths />
      <EachDayBooths />
    </>
  );
}

export default AllBooths;

function BoothDaysBooths() {
  const { bothDaysCircles } = useCircle();

  return (
    <pixiContainer>
      {bothDaysCircles.map((circle) => (
        <BoothRectangle key={circle.id} circle={circle} />
      ))}
    </pixiContainer>
  );
}

function EachDayBooths() {
  const { attendingDay } = useCircleFilter();

  return attendingDay === 'SAT' ? <DayOneBooths /> : <DayTwoBooths />;
}

function DayOneBooths() {
  const { dayOneCircles } = useCircle();

  return (
    <pixiContainer>
      {dayOneCircles.map((circle) => (
        <BoothRectangle key={circle.id} circle={circle} />
      ))}
    </pixiContainer>
  );
}

function DayTwoBooths() {
  const { dayTwoCircles } = useCircle();

  return (
    <pixiContainer>
      {dayTwoCircles.map((circle) => (
        <BoothRectangle key={circle.id} circle={circle} />
      ))}
    </pixiContainer>
  );
}
