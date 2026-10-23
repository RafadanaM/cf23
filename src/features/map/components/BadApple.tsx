import { useApplication } from '@pixi/react';
import { Graphics, Ticker, TickerCallback } from 'pixi.js';
import { useEffect } from 'react';

import { MAP_HEIGHT, MAP_WIDTH } from '../constants/map';
import { useBadApple } from '../contexts/BadAppleProvider';
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

function BadApple() {
  const { setShow, setPlay } = useBadApple();
  const { map } = useMapRegistry();
  const { app } = useApplication();

  /*
   * this is fragile af, its better to setState the API response
   * then have another useEffect for starting the animation,
   * but ehhhhhhhhhh I'm too lazy
   *
   */
  useEffect(() => {
    const mapNode = map.current;
    let animate: TickerCallback<any>;

    let rectangles: Graphics[] = [];

    function cleanupFn() {
      if (animate) {
        app.ticker.remove(animate);
      }
      rectangles.forEach((rect) => {
        rect.destroy();
      });

      setPlay(false);
      setShow(false);
    }

    if (!mapNode) return;

    let isCancelled = false;
    fetch('/frames.json')
      .then(async (res) => {
        const data = (await res.json()) as FrameData;

        if (isCancelled) return;

        const metadata = data.meta;
        const frames = data.frames;

        const screenSize = metadata.height * metadata.width;
        if (screenSize === 0) return;

        const windowWidth = window.innerWidth;
        const padding = 16;

        const maxScreenWidth = windowWidth - padding * 2;
        const currentZoom = mapNode.scaled;

        const baseRectSize = maxScreenWidth / metadata.width;
        const rectSize = Math.floor(baseRectSize * currentZoom);

        rectangles = createRectangles(
          metadata.width,
          metadata.height,
          screenSize,
          rectSize
        );

        if (!rectangles.length || !frames.length) {
          return;
        }

        rectangles.forEach((rect) => {
          map.current?.addChild(rect);
        });

        setPlay(true);

        const frameInterval = 1000 / metadata.fps;
        let currentFrame = 0;
        let elapsed = 0;

        animate = (ticker: Ticker) => {
          elapsed += ticker.deltaMS;

          if (currentFrame >= metadata.frameCount) {
            cleanupFn();
            return;
          }

          if (elapsed >= frameInterval) {
            elapsed %= frameInterval;
            currentFrame++;
            rectangles.forEach((rectangle, i) => {
              const xOffset = i % metadata.width;
              const yOffset = Math.floor(i / metadata.width);

              drawRectangle({
                graphics: rectangle,
                height: metadata.height,
                width: metadata.width,
                rectSize,
                x: xOffset,
                y: yOffset,
                color: frames[currentFrame]?.[yOffset]?.[xOffset]
                  ? 'rgba(0,0,0,0)'
                  : 'rgba(0,0,0,1)'
              });
            });
          }
        };

        app.ticker.add(animate);
      })
      .catch(() => {
        console.error('Failed to load frames');
      });

    return () => {
      isCancelled = true;
      cleanupFn();
    };
  }, [app.ticker, map, setShow, setPlay]);

  return null;
}

export default BadApple;

function createRectangles(
  width: number,
  height: number,
  screenSize: number,
  rectSize: number
): Graphics[] {
  let newRectangles: Graphics[] = [];

  for (let i = 0; i < screenSize; i++) {
    const xOffset = i % width;
    const yOffset = Math.floor(i / width);

    const rectangle = new Graphics();

    drawRectangle({
      graphics: rectangle,
      height: height,
      width: width,
      rectSize,
      x: xOffset,
      y: yOffset,
      color: 'rgba(0,0,0,1)'
    });
    newRectangles.push(rectangle);
  }

  return newRectangles;
}

function drawRectangle({
  graphics,
  width,
  height,
  rectSize,
  x,
  y,
  color
}: {
  graphics: Graphics;
  x: number;
  y: number;
  rectSize: number;
  width: number;
  height: number;
  color: string;
}) {
  const startY = CENTER_Y - rectSize * (height / 2);
  const startX = CENTER_X - rectSize * (width / 2);

  const rectX = startX + x * rectSize;
  const rectY = startY + y * rectSize;

  graphics.clear();
  graphics.rect(rectX, rectY, rectSize, rectSize);
  graphics.fill(color);
}
