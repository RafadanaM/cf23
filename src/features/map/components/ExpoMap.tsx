import { RiCloseCircleLine } from '@remixicon/react';
import L from 'leaflet';
import { lazy, memo, Suspense, useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ImageOverlay } from 'react-leaflet/ImageOverlay';
import { MapContainer } from 'react-leaflet/MapContainer';
import { Pane } from 'react-leaflet/Pane';

import { Button } from '@/core/ui/components/button';
import { BAD_APPLE_ID } from '@/domain/circle/constants';

import { bounds } from '../constants/map';
import { useActiveCircle, useActiveCircleAction } from '../contexts/ActiveCircleProvider';
import { useMapRegistry } from '../contexts/MapProvider';
import ActiveCircleBooth from './ActiveCircleBooth';
import BookmarkedCircleBooths from './BookmarkedCircleBooths';
import CircleBoothMap from './CircleBoothMap';

const BadApple = lazy(() => import('./BadApple'));

const renderer = L.canvas({ padding: 0.5 });
export const crs = L.extend({}, L.CRS.Simple, {
  infinite: false
});

function ExpoMap() {
  const { register } = useMapRegistry();

  return (
    <section
      id="section-MAP"
      role="tabpanel"
      aria-labelledby="tab-MAP"
      className="w-screen h-screen overflow-hidden"
    >
      <div className="will-change-transform relative inline-block border border-black">
        <div className="relative">
          <MapContainer
            ref={register}
            crs={crs}
            maxBounds={bounds}
            bounds={bounds}
            style={{ width: '100vw', height: '100vh' }}
            minZoom={-2}
            maxZoom={2}
            zoomControl={false}
            preferCanvas
            renderer={renderer}
          >
            <ImageOverlay
              className="bg-white"
              url="/floor_map_clean.webp"
              alt="cf23 map"
              bounds={bounds}
            />
            <Pane name="bookmarks" className="pointer-events-none" />
            <Pane name="active" className="pointer-events-none" />
            <BadAppleContainer />
            <CircleBoothMap />
            <BookmarkedCircleBooths />
            <ActiveCircleBooth />
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

export default memo(ExpoMap);

function BadAppleContainer() {
  const { activeCircleId } = useActiveCircle();
  const { setActiveCircleId } = useActiveCircleAction();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (activeCircleId === BAD_APPLE_ID) {
      setShow(true);
    }
  }, [activeCircleId]);

  const handleEnd = useCallback(() => {
    setShow(false);
    setActiveCircleId('');
  }, [setActiveCircleId]);

  if (!show) return null;

  return (
    <>
      <ErrorBoundary fallback={null}>
        <Suspense>
          <BadApple onEnd={handleEnd} />
        </Suspense>
      </ErrorBoundary>

      <Button
        variant={'destructive'}
        size={'icon-lg'}
        className="z-400 fixed bottom-40 left-1/2 -translate-x-1/2 rounded-full"
        onClick={handleEnd}
      >
        <RiCloseCircleLine className="size-6" />
      </Button>
    </>
  );
}
