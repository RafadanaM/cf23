import { BitmapText, Container, Texture } from 'pixi.js';
import { memo, useEffect } from 'react';

import { Circle } from '@/domain/circle/types';

import { Viewport } from 'pixi-viewport';
import { yieldToMain } from '@/core/utils/scheduler';
import { useMapRegistry } from '../contexts/MapProvider';
import { useBoothRectangle } from './BoothRectangle';

interface BoothRectanglesProps {
  zIndex?: number;
  circles: Circle[];
  getRectangleTexture: (width: number, height: number) => Texture | undefined;
  isBookmarked?: boolean;
  registerTextRef?: (node: BitmapText | null) => void;
}

const MAX_TIME_MS = 10;

function BoothRectangles({
  circles,
  isBookmarked,
  zIndex = 1,
  getRectangleTexture,
  registerTextRef
}: BoothRectanglesProps) {
  const { map } = useMapRegistry();

  const { createBoothRectangle } = useBoothRectangle();

  useEffect(() => {
    let cancelled = false;
    const mapInstance = map.current;
    if (!mapInstance) return;

    const container = new Container();

    container.zIndex = zIndex;

    async function chunkInsert(mapNode: Viewport) {
      let start = performance.now();

      for (const circle of circles) {
        if (cancelled) return;

        const texture = getRectangleTexture(circle.rect.width, circle.rect.height);

        if (!texture) continue;

        container.addChild(
          createBoothRectangle({
            circle,
            texture: texture,
            registerTextRef,
            isBookmarked
          })
        );

        if (performance.now() - start > MAX_TIME_MS) {
          performance.mark('YIELD');
          await yieldToMain();
          start = performance.now();
        }
      }
      mapNode.addChild(container);
    }

    chunkInsert(mapInstance);

    return () => {
      cancelled = true;
      container.parent?.removeChild(container);
      container.destroy({ children: true });
    };
  }, [
    getRectangleTexture,
    createBoothRectangle,
    circles,
    isBookmarked,
    registerTextRef,
    map,
    zIndex
  ]);

  return null;
}

export default memo(BoothRectangles);
