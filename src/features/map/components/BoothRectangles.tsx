import { Viewport } from 'pixi-viewport';
import { BitmapText, Container, Sprite, Texture } from 'pixi.js';
import { memo, startTransition, useCallback, useEffect } from 'react';

import { yieldToMain } from '@/core/utils/scheduler';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';
import { APP_DRAWER_ID } from '@/layout/drawers/constants';
import { useAppDrawer } from '@/layout/drawers/useAppDrawer';

import { useActiveCircleAction } from '../contexts/ActiveCircleProvider';
import { useMapRegistry } from '../contexts/MapProvider';
import { getColorConfig, useBoothRectangle } from './BoothRectangle';

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
  isBookmarked = false,
  zIndex = 1,
  getRectangleTexture,
  registerTextRef
}: BoothRectanglesProps) {
  const { map } = useMapRegistry();
  const { openDrawer } = useAppDrawer();
  const { getCircleDetail } = useCircle();
  const { setActiveCircleId } = useActiveCircleAction();

  const { createBoothRectangle } = useBoothRectangle();

  const handleClick = useCallback(
    (id: string) => {
      const circle = getCircleDetail(id);
      if (!circle) return;
      setActiveCircleId(circle.id);
      startTransition(() => {
        openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, {
          circle,
          hideOverlay: true,
          onClose: () => {
            setActiveCircleId('');
          }
        });
      });
    },
    [setActiveCircleId, getCircleDetail, openDrawer]
  );

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

    container.eventMode = 'static';

    container.on('pointertap', (event) => {
      const child = event.target;

      if (!child || mapInstance.moving) return;

      handleClick(child.label);
    });

    container.on('pointerover', (event) => {
      const child = event.target;

      if (!child) return;

      child.children.forEach((x) => {
        if (x instanceof Sprite) {
          x.tint = getColorConfig(false, isBookmarked);
        }
      });

      // child.tint = getColorConfig(false, isBookmarked);
    });

    container.on('pointerout', (event) => {
      const child = event.target;

      if (!child) return;

      child.children.forEach((x) => {
        if (x instanceof Sprite) {
          x.tint = '#FFFFFF';
        }
      });
    });

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
    zIndex,
    handleClick
  ]);

  return null;
}

export default memo(BoothRectangles);
