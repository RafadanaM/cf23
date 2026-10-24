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
import { useCallback, useEffect, useState } from 'react';

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

function ExpoMap() {
  const [ready, setReady] = useState(false);

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

  const handleInit = useCallback(() => {
    setReady(true);
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
          roundPixels
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
