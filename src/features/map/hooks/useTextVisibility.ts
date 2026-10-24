import { Text } from 'pixi.js';
import { useRef, useCallback, useEffect, useMemo } from 'react';

import { useMapRegistry } from '../contexts/MapProvider';

function useTextVisibility() {
  const { map } = useMapRegistry();

  const texts = useRef<Text[]>([]);

  const registerRef = useCallback((textNode: Text | null) => {
    if (!textNode) return;
    texts.current.push(textNode);
  }, []);

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    handleZoom();
    function handleZoom() {
      const scale = mapInstance?.scaled || 0;

      if (scale > 0.6) {
        texts.current.forEach((text) => {
          if (!text.visible) {
            text.visible = true;
          }
        });
      } else {
        texts.current.forEach((text) => {
          if (text.visible) {
            text.visible = false;
          }
        });
      }
    }

    mapInstance.on('zoomed', handleZoom);

    return () => {
      mapInstance.off('zoomed', handleZoom);
    };
  }, [map]);

  return useMemo(
    () => ({
      registerRef
    }),
    [registerRef]
  );
}

export default useTextVisibility;
