import L from 'leaflet';
import { useRef, useEffect } from 'react';

import { MAP_HEIGHT, MAP_WIDTH } from '../constants/map';
import { useMapRegistry } from '../contexts/MapProvider';

interface FrameData {
  // [frame][height][width]
  frames: number[][][];
  meta: {
    width: number;
    height: number;
    fps: number;
    frameCount: number;
  };
}

const CENTER_Y = MAP_HEIGHT / 2;
const CENTER_X = MAP_WIDTH / 2;

interface Props {
  onEnd: () => void;
}

function BadApple({ onEnd }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { map } = useMapRegistry();

  useEffect(() => {
    const mapNode = map.current;
    if (!mapNode) return;

    let isCancelled = false;
    function createRectangles(
      mapInstance: L.Map,
      metadata: FrameData['meta']
    ): L.Rectangle[] {
      let rectangles: L.Rectangle[] = [];

      const screenSize = metadata.height * metadata.width;
      if (screenSize === 0) {
        return rectangles;
      }

      const windowWidth = window.innerWidth;
      const padding = 16;

      const maxScreenWidth = windowWidth - padding * 2;
      const currentZoom = mapInstance.getZoom();

      const rectSize = Math.floor(
        maxScreenWidth / (metadata.width * Math.pow(2, currentZoom))
      );

      function createRectangle(x: number, y: number) {
        const startY = CENTER_Y + rectSize * (metadata.height / 2);
        const startX = CENTER_X - rectSize * (metadata.width / 2);

        const rectY = rectSize * y;
        const rectX = rectSize * x;

        const rectangle = L.rectangle(
          [
            [startY - rectY, startX + rectX],
            [startY - rectY + rectSize, startX + rectX + rectSize]
          ],
          {
            fillColor: '#000000',
            color: '#000000',
            fillOpacity: 1,
            pane: 'active'
          }
        );
        return rectangle;
      }

      for (let i = 0; i < screenSize; i++) {
        const xOffset = i % metadata.width;
        const yOffset = Math.floor(i / metadata.width);

        const rectangle = createRectangle(xOffset, yOffset);

        rectangles.push(rectangle);
      }

      return rectangles;
    }

    let rafId: ReturnType<typeof requestAnimationFrame>;
    function startAnimation(
      rectangles: L.Rectangle[],
      frameData: FrameData,
      onAnimationEnd: () => void
    ) {
      const frames = frameData.frames;
      const metadata = frameData.meta;

      if (!rectangles.length || !frames.length) {
        return;
      }

      const frameInterval = 1000 / metadata.fps;
      let lastFrameFiredTime = performance.now();
      let currentFrame = 0;

      function animate(currentTime: number) {
        if (isCancelled) return;

        if (currentFrame >= metadata.frameCount) {
          onAnimationEnd();
          return;
        }
        rafId = requestAnimationFrame(animate);

        const elapsed = currentTime - lastFrameFiredTime;

        if (elapsed >= frameInterval) {
          rectangles.forEach((rectangle, i) => {
            const xOffset = i % metadata.width;
            const yOffset = Math.floor(i / metadata.width);

            rectangle.setStyle({
              fillColor: frames[currentFrame]?.[yOffset]?.[xOffset]
                ? 'transparent'
                : '#000',
              color: frames[currentFrame]?.[yOffset]?.[xOffset] ? 'transparent' : '#000'
            });
          });

          lastFrameFiredTime += frameInterval;
          currentFrame++;

          if (currentTime - lastFrameFiredTime > frameInterval * 2) {
            lastFrameFiredTime = currentTime;
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    }

    /*
     * this is fragile af, its better to setState the API response
     * then have another useEffect for starting the animation,
     * but ehhhhhhhhhh I'm too lazy
     *
     */
    const audio = audioRef.current;
    let rectangles: L.Rectangle[] = [];
    fetch('/frames.json')
      .then(async (res) => {
        const data = (await res.json()) as FrameData;

        if (isCancelled) return;

        rectangles = createRectangles(mapNode, data.meta);

        rectangles.forEach((rect) => {
          rect.addTo(mapNode);
        });

        audio?.play();
        startAnimation(rectangles, data, () => {
          audio?.pause();
          onEnd();
        });
      })
      .catch(() => {
        console.error('Failed to load frames');
      });

    return () => {
      isCancelled = true;
      cancelAnimationFrame(rafId);
      rectangles.forEach((rect) => {
        rect.remove();
      });
      audio?.pause();
    };
  }, [map, onEnd]);

  return <audio ref={audioRef} className="hidden" src="/bad_apple.webm" />;
}

export default BadApple;
