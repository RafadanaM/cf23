import { Application, extend } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import {
  Assets,
  BitmapText,
  Container,
  Graphics,
  loadTextures,
  Sprite,
  Text,
  Texture
} from 'pixi.js';
import { startTransition, useCallback, useEffect, useState } from 'react';

import TooltipProvider from '../contexts/TooltipProvider';
import BadAppleAudio from './BadAppleAudio';
import BadAppleClose from './BadAppleClose';
import MapContent from './MapContent';
import MapLoader from './MapLoader';
import Tooltips from './Tooltips';

extend({ Viewport: PixiViewport, Sprite, Container, Graphics, Text, BitmapText });

loadTextures.config = {
  preferWorkers: false,
  crossOrigin: 'anonymous',
  preferCreateImageBitmap: true
};

function sleep() {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 100);
  });
}

function ExpoMap() {
  const [ready, setReady] = useState(false);

  const [bg, setBg] = useState<Texture | null>(null);

  // idk man, in prod sometimes the fetch failled
  useEffect(() => {
    let cancelled = false;

    async function loadBg() {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (cancelled) return;
        try {
          const texture = await Assets.load('/floor_map_clean.webp');
          if (cancelled) return;

          setBg(texture);

          return;
        } catch (err) {
          console.warn(`Fetching bg failed. Attempt ${attempt + 1}`, err);

          try {
            await Assets.unload('/floor_map_clean.webp');
          } catch {
            // noop
          }

          await sleep();
        }
      }
    }

    loadBg();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleInit = useCallback(() => {
    startTransition(() => {
      setReady(true);
    });
  }, []);

  return (
    <TooltipProvider>
      <section
        id="section-MAP"
        role="tabpanel"
        aria-labelledby="tab-MAP"
        className="relative w-screen h-screen overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {(!ready || !bg) && <MapLoader className="fixed top-0 left-0" />}
        <Application
          background={'#ffffff'}
          autoDensity
          resizeTo={window}
          onInit={handleInit}
          resolution={window.devicePixelRatio}
          antialias={false}
          backgroundAlpha={1}
        >
          {ready && <MapContent bg={bg} />}
        </Application>
        <BadAppleAudio />
        <BadAppleClose />
        <Tooltips />
      </section>
    </TooltipProvider>
  );
}

export default ExpoMap;
