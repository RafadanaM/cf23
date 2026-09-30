import { Circle } from '@/domain/circle/types';

import { memo, useEffect } from 'react';
import { yieldToMain } from '@/core/utils/scheduler';
import { useMapRegistry } from '../contexts/MapProvider';
import BoothRectangle, { useBoothRectangle } from './BoothRectangle';

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

export const CircleBoothsFast = memo(function CircleBoothsFast({
  circles
}: CircleBoothsProps) {
  const { map } = useMapRegistry();

  const createRectangle = useBoothRectangle();

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    let rects: L.Rectangle[] = [];

    let startTime = performance.now();
    async function batchInsert(mapNode: L.Map, items: Circle[]) {
      for (let i = 0; i < items.length; i++) {
        const rect = createRectangle({ circle: items[i]! });
        rect.addTo(mapNode);
        rects.push(rect);

        // yield every 32ms
        if (performance.now() - startTime > 32) {
          performance.mark('yield');
          await yieldToMain();
          startTime = performance.now();
        }
      }
    }

    batchInsert(mapInstance, circles);

    return () => {
      rects.forEach((rect) => {
        rect.off();
        rect.remove();
      });
    };
  }, [map, circles, createRectangle]);

  return null;
});
