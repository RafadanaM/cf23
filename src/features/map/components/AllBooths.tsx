import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { Text } from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import { useMapRegistry } from '../contexts/MapProvider';
import BoothRectangle from './BoothRectangle';

interface BoothsProps {
  registerTextRef?: (node: Text | null) => void;
}

function AllBooths() {
  const { map } = useMapRegistry();

  const texts = useRef<Text[]>([]);

  const registerRef = useCallback((textNode: Text | null) => {
    if (!textNode) return;
    texts.current.push(textNode);
  }, []);

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    handleZoom();
    function handleZoom() {
      const scale = mapInstance?.scaled || 0;

      if (scale > 0.6) {
        texts.current.forEach((text) => {
          if (!text.visible) {
            text.visible = true;
          }
        });
      } else {
        texts.current.forEach((text) => {
          if (text.visible) {
            text.visible = false;
          }
        });
      }
    }

    mapInstance.on('zoomed', handleZoom);

    return () => {
      mapInstance.off('zoomed', handleZoom);
    };
  }, [map]);

  return (
    <>
      <BoothDaysBooths registerTextRef={registerRef} />
      <EachDayBooths registerTextRef={registerRef} />
    </>
  );
}

export default AllBooths;

function BoothDaysBooths({ registerTextRef }: BoothsProps) {
  const { bothDaysCircles } = useCircle();

  return (
    <pixiContainer>
      {bothDaysCircles.map((circle) => (
        <BoothRectangle
          key={circle.id}
          circle={circle}
          registerTextRef={registerTextRef}
        />
      ))}
    </pixiContainer>
  );
}

function EachDayBooths({ registerTextRef }: BoothsProps) {
  const { attendingDay } = useCircleFilter();

  return attendingDay === 'SAT' ? (
    <DayOneBooths registerTextRef={registerTextRef} />
  ) : (
    <DayTwoBooths registerTextRef={registerTextRef} />
  );
}

function DayOneBooths({ registerTextRef }: BoothsProps) {
  const { dayOneCircles } = useCircle();

  return (
    <pixiContainer>
      {dayOneCircles.map((circle) => (
        <BoothRectangle
          key={circle.id}
          circle={circle}
          registerTextRef={registerTextRef}
        />
      ))}
    </pixiContainer>
  );
}

function DayTwoBooths({ registerTextRef }: BoothsProps) {
  const { dayTwoCircles } = useCircle();

  return (
    <pixiContainer>
      {dayTwoCircles.map((circle) => (
        <BoothRectangle
          key={circle.id}
          circle={circle}
          registerTextRef={registerTextRef}
        />
      ))}
    </pixiContainer>
  );
}
