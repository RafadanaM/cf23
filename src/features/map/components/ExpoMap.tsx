import { Application, extend } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { useCallback, useState } from 'react';

import TooltipProvider from '../contexts/TooltipProvider';
import BadAppleAudio from './BadAppleAudio';
import BadAppleClose from './BadAppleClose';
import MapContent from './MapContent';
import Tooltips from './Tooltips';

extend({ Viewport: PixiViewport, Sprite, Container, Graphics, Text });

function ExpoMap() {
  const [ready, setReady] = useState(false);

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
        <Application
          background={'#ffffff'}
          autoDensity
          resizeTo={window}
          onInit={handleInit}
          resolution={window.devicePixelRatio}
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
