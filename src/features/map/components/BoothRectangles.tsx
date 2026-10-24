import { Text, Texture } from 'pixi.js';

import { Circle } from '@/domain/circle/types';

import { useDeferredValue } from 'react';
import BoothRectangle from './BoothRectangle';

interface BoothRectanglesProps {
  circles: Circle[];
  getRectangleTexture: (width: number, height: number) => Texture | undefined;
  isBookmarked?: boolean;
  registerTextRef?: (node: Text | null) => void;
}

function BoothRectangles({
  circles,
  isBookmarked,
  getRectangleTexture,
  registerTextRef
}: BoothRectanglesProps) {
  const deferredCircles = useDeferredValue(
    circles.filter((c) => !!getRectangleTexture(c.rect.width, c.rect.height))
  );

  return (
    <pixiContainer>
      {deferredCircles.map((circle) => (
        <BoothRectangle
          key={circle.id}
          circle={circle}
          registerTextRef={registerTextRef}
          texture={getRectangleTexture(circle.rect.width, circle.rect.height)!}
          isBookmarked={isBookmarked}
        />
      ))}
    </pixiContainer>
  );
}

export default BoothRectangles;
