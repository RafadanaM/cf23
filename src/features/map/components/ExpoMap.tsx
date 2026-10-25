import { Application, extend } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import { BitmapText, Container, Graphics, loadTextures, Sprite, Text } from 'pixi.js';
import { startTransition, useCallback, useState } from 'react';

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
        {!ready && <MapLoader className="fixed top-0 left-0" />}
        <Application
          background={'#ffffff'}
          autoDensity
          resizeTo={window}
          onInit={handleInit}
          resolution={window.devicePixelRatio}
          antialias={false}
          backgroundAlpha={1}
        >
          {ready && <MapContent />}
        </Application>
        <BadAppleAudio />
        <BadAppleClose />
        <Tooltips />
      </section>
    </TooltipProvider>
  );
}

export default ExpoMap;
