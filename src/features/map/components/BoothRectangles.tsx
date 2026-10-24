import { BitmapText, Container, Texture } from 'pixi.js';
import { memo, useEffect } from 'react';

import { Circle } from '@/domain/circle/types';

import { useMapRegistry } from '../contexts/MapProvider';
import { useBoothRectangle } from './BoothRectangle';

interface BoothRectanglesProps {
  circles: Circle[];
  getRectangleTexture: (width: number, height: number) => Texture | undefined;
  isBookmarked?: boolean;
  registerTextRef?: (node: BitmapText | null) => void;
}

function BoothRectangles({
  circles,
  isBookmarked,
  getRectangleTexture,
  registerTextRef
}: BoothRectanglesProps) {
  const { map } = useMapRegistry();

  const { createBoothRectangle } = useBoothRectangle();

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    performance.mark('START_RECT');
    const boothRectangles = circles
      .filter((c) => !!getRectangleTexture(c.rect.width, c.rect.height))
      .map((circle) => {
        return createBoothRectangle({
          circle,
          texture: getRectangleTexture(circle.rect.width, circle.rect.height)!,
          registerTextRef,
          isBookmarked
        });
      });

    if (boothRectangles.length === 0) return;

    const container = new Container();
    for (const rect of boothRectangles) {
      container.addChild(rect);
    }
    mapInstance.addChild(container);
    performance.mark('END_RECT');

    return () => {
      container.parent?.removeChild(container);
      container.destroy({ children: true });
    };
  }, [
    getRectangleTexture,
    createBoothRectangle,
    circles,
    isBookmarked,
    registerTextRef,
    map
  ]);

  return null;
}

export default memo(BoothRectangles);
