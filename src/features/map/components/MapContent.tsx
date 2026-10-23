import { useApplication } from '@pixi/react';
import { Texture } from 'pixi.js';
import { memo } from 'react';

import { useMapRegistry } from '@/features/map/contexts/MapProvider';

import { MAP_HEIGHT, MAP_WIDTH } from '../constants/map';
import ActiveBooth from './ActiveBooth';
import AllBooths from './AllBooths';
import BadAppleRenderer from './BadAppleRenderer';
import BookmarkedBooths from './BookmarkedBooths';

interface MapContentProps {
  bg: Texture | null;
}

function MapContent({ bg }: MapContentProps) {
  const { app } = useApplication();
  const { register } = useMapRegistry();

  return (
    <viewport
      ref={register}
      worldHeight={MAP_HEIGHT}
      worldWidth={MAP_WIDTH}
      events={app.renderer.events}
    >
      <Background bg={bg} />
      <AllBooths />
      <ActiveBooth />
      <BookmarkedBooths />
      <BadAppleRenderer />
    </viewport>
  );
}

export default memo(MapContent);

interface BackgroundProps {
  bg: Texture | null;
}

function Background({ bg }: BackgroundProps) {
  if (!bg) return null;

  return <pixiSprite texture={bg} height={MAP_HEIGHT} width={MAP_WIDTH} />;
}
