import { Text, Texture } from 'pixi.js';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { useCircleFilter } from '../contexts/CircleFilterProvider';
import useRectangleTextures from '../hooks/useRectangleTextures';
import useTextVisibility from '../hooks/useTextVisibility';
import BoothRectangles from './BoothRectangles';

interface BoothsProps {
  getRectangleTexture: (width: number, height: number) => Texture | undefined;
  registerTextRef?: (node: Text | null) => void;
}

function AllBooths() {
  const { registerRef } = useTextVisibility();

  const { getTexture } = useRectangleTextures();

  return (
    <>
      <BoothDaysBooths registerTextRef={registerRef} getRectangleTexture={getTexture} />
      <EachDayBooths registerTextRef={registerRef} getRectangleTexture={getTexture} />
    </>
  );
}

export default AllBooths;

function BoothDaysBooths({ registerTextRef, getRectangleTexture }: BoothsProps) {
  const { bothDaysCircles } = useCircle();

  return (
    <BoothRectangles
      circles={bothDaysCircles}
      getRectangleTexture={getRectangleTexture}
      registerTextRef={registerTextRef}
    />
  );
}

function EachDayBooths({ registerTextRef, getRectangleTexture }: BoothsProps) {
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
}

function DayOneBooths({ registerTextRef, getRectangleTexture }: BoothsProps) {
  const { dayOneCircles } = useCircle();

  return (
    <BoothRectangles
      circles={dayOneCircles}
      getRectangleTexture={getRectangleTexture}
      registerTextRef={registerTextRef}
    />
  );
}

function DayTwoBooths({ registerTextRef, getRectangleTexture }: BoothsProps) {
  const { dayTwoCircles } = useCircle();

  return (
    <BoothRectangles
      circles={dayTwoCircles}
      getRectangleTexture={getRectangleTexture}
      registerTextRef={registerTextRef}
    />
  );
}
