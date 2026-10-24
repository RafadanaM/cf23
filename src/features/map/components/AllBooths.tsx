import { BitmapText, Texture } from 'pixi.js';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { memo } from 'react';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import useRectangleTextures from '../hooks/useRectangleTextures';
import useTextVisibility from '../hooks/useTextVisibility';
import BoothRectangles from './BoothRectangles';

interface BoothsProps {
  getRectangleTexture: (width: number, height: number) => Texture | undefined;
  registerTextRef?: (node: BitmapText | null) => void;
}

function AllBooths() {
  const { registerRef } = useTextVisibility();

  const { getTexture } = useRectangleTextures();

  return (
    <pixiContainer>
      <BoothDaysBooths registerTextRef={registerRef} getRectangleTexture={getTexture} />
      <EachDayBooths registerTextRef={registerRef} getRectangleTexture={getTexture} />
    </pixiContainer>
  );
}

export default AllBooths;

const BoothDaysBooths = memo(({ registerTextRef, getRectangleTexture }: BoothsProps) => {
  const { bothDaysCircles } = useCircle();

  return (
    <BoothRectangles
      circles={bothDaysCircles}
      getRectangleTexture={getRectangleTexture}
      registerTextRef={registerTextRef}
    />
  );
});

const EachDayBooths = memo(({ registerTextRef, getRectangleTexture }: BoothsProps) => {
  const { attendingDay } = useCircleFilter();

  return attendingDay === 'SAT' ? (
    <DayOneBooths
      registerTextRef={registerTextRef}
      getRectangleTexture={getRectangleTexture}
    />
  ) : (
    <DayTwoBooths
      registerTextRef={registerTextRef}
      getRectangleTexture={getRectangleTexture}
    />
  );
});

const DayOneBooths = memo(({ registerTextRef, getRectangleTexture }: BoothsProps) => {
  const { dayOneCircles } = useCircle();

  return (
    <BoothRectangles
      circles={dayOneCircles}
      getRectangleTexture={getRectangleTexture}
      registerTextRef={registerTextRef}
    />
  );
});

const DayTwoBooths = memo(({ registerTextRef, getRectangleTexture }: BoothsProps) => {
  const { dayTwoCircles } = useCircle();

  return (
    <BoothRectangles
      circles={dayTwoCircles}
      getRectangleTexture={getRectangleTexture}
      registerTextRef={registerTextRef}
    />
  );
});
