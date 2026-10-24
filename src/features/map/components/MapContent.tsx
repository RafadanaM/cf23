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
      <Background />
      <AllBooths />
      <BookmarkedBooths />
      <ActiveBooth />
      <BadAppleRenderer />
    </viewport>
  );
}

export default memo(MapContent);

function Background() {
  const [bg, setBg] = useState<Texture | null>(null);

  useEffect(() => {
    Assets.load('/floor_map_clean.webp')
      .then((texture) => {
        setBg(texture);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  if (!bg) return null;

  return <pixiSprite texture={bg} height={MAP_HEIGHT} width={MAP_WIDTH} />;
}
