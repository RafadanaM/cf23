import L from 'leaflet';
import { memo } from 'react';
import { ImageOverlay } from 'react-leaflet/ImageOverlay';
import { MapContainer } from 'react-leaflet/MapContainer';
import { Pane } from 'react-leaflet/Pane';

import { bounds } from '../constants/map';
import { useMapRegistry } from '../contexts/MapProvider';
import ActiveCircleBooth from './ActiveCircleBooth';
import BookmarkedCircleBooths from './BookmarkedCircleBooths';
import CircleBoothMap from './CircleBoothMap';

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
              url="/floor_map.webp"
              alt="cf23 map"
              bounds={bounds}
            />
            <Pane name="bookmarks" className="pointer-events-none" />
            <Pane name="active" className="pointer-events-none" />

            <CircleBoothMap />
            <BookmarkedCircleBooths />
            <ActiveCircleBooth />
            {/* <BadApple /> */}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

export default memo(ExpoMap);

// function BadApple() {
//   const { map } = useMapRegistry();
//
//   useEffect(() => {
//     if (!map.current) return;
//
//     const rectangle = L.rectangle(
//       [
//         [MAP_HEIGHT / 2, MAP_WIDTH / 2],
//         [MAP_HEIGHT / 2 + 50, MAP_WIDTH / 2 + 50]
//       ],
//       {
//         fillColor: '#000000',
//         color: '#000000',
//         fillOpacity: 1,
//         pane: 'active'
//       }
//     ).addTo(map.current);
//
//     const FPS = 24;
//     // 33.3ms
//     const frameInterval = 1000 / FPS;
//
//     let lastFrameFiredTime = performance.now();
//     let rafId: ReturnType<typeof requestAnimationFrame>;
//     let isBlack = true;
//     function animate(currentTime: number) {
//       rafId = requestAnimationFrame(animate);
//
//       const elapsed = currentTime - lastFrameFiredTime;
//
//       if (elapsed >= frameInterval) {
//         console.log('frame, current: ', isBlack);
//         rectangle.setStyle({
//           fillColor: isBlack ? '#FFF' : '#000',
//           color: isBlack ? '#FFF' : '#000'
//         });
//         isBlack = !isBlack;
//         lastFrameFiredTime += frameInterval;
//
//         if (currentTime - lastFrameFiredTime > frameInterval * 2) {
//           lastFrameFiredTime = currentTime;
//         }
//
//         // lastFrameFiredTime = currentTime - (elapsed % frameInterval);
//       }
//     }
//
//     rafId = requestAnimationFrame(animate);
//
//     return () => {
//       cancelAnimationFrame(rafId);
//     };
//   }, [map]);
//
//   return null;
// }
