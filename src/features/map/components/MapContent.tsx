import { useApplication } from '@pixi/react';
import { Assets, Texture } from 'pixi.js';
import { memo, useEffect, useState } from 'react';

import { useMapRegistry } from '@/features/map/contexts/MapProvider';

import { MAP_HEIGHT, MAP_WIDTH } from '../constants/map';
import ActiveBooth from './ActiveBooth';
import AllBooths from './AllBooths';
import BadAppleRenderer from './BadAppleRenderer';
import BookmarkedBooths from './BookmarkedBooths';

function MapContent() {
  const { app } = useApplication();
  const { register } = useMapRegistry();

  return (
    <viewport
      ref={register}
      worldHeight={MAP_HEIGHT}
      worldWidth={MAP_WIDTH}
      events={app.renderer.events}
      threshold={10}
    >
      <Background tileNum={0} />
      <Background tileNum={1} />
      <Background tileNum={2} />
      <Background tileNum={3} />
      <AllBooths />
      <BookmarkedBooths />
      <ActiveBooth />
      <BadAppleRenderer />
    </viewport>
  );
}

export default memo(MapContent);

interface BackgroundProps {
  tileNum: number;
}

const TILE_HEIGHT = MAP_HEIGHT / 2;
const TILE_WIDTH = MAP_WIDTH / 2;

function Background({ tileNum }: BackgroundProps) {
  const [bg, setBg] = useState<Texture | undefined>();

  useEffect(() => {
    let cancelled = false;
    const url = `/tile_${tileNum}_clean.webp`;

    retry(() => Assets.load(url), {
      isCancelled: () => cancelled,
      onError: async (err, attempt) => {
        console.warn(`Fetching bg tile ${tileNum} failed. Attempt ${attempt}`, err);
        await Assets.unload(url).catch(() => {});
      }
    }).then((texture) => {
      if (texture && !cancelled) setBg(texture);
    });

    return () => {
      cancelled = true;
    };
  }, [tileNum]);

  if (!bg) return null;

  return (
    <pixiSprite
      texture={bg}
      height={TILE_HEIGHT}
      width={TILE_WIDTH}
      x={TILE_WIDTH * (tileNum % 2)}
      y={TILE_HEIGHT * Math.floor(tileNum / 2)}
    />
  );
}
async function retry<T>(
  fn: () => Promise<T>,
  {
    attempts = 3,
    onError,
    isCancelled
  }: {
    attempts?: number;
    delayMs?: number;
    onError?: (err: unknown, attempt: number) => void | Promise<void>;
    isCancelled?: () => boolean;
  } = {}
): Promise<T | undefined> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (isCancelled?.()) return;
    try {
      return await fn();
    } catch (err) {
      if (isCancelled?.()) return;
      await onError?.(err, attempt);
      if (attempt < attempts) await sleep();
    }
  }
}

function sleep() {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 100);
  });
}
