import { Circle } from '@/domain/circle/types';

import BoothRectangle from './BoothRectangle';

interface CircleBoothsProps {
  circles: Circle[];
}

function CircleBooths({ circles }: CircleBoothsProps) {
  return (
    <>
      {circles.map((circle) => (
        <BoothRectangle key={circle.id} circle={circle} />
      ))}
    </>
  );
}

export default CircleBooths;
