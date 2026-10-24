import { BitmapText } from 'pixi.js';
import { useRef, useCallback, useEffect, useMemo } from 'react';

import { useCircleFilter } from '../contexts/CircleFilterProvider';
import { useMapRegistry } from '../contexts/MapProvider';

function useTextVisibility() {
  const { map } = useMapRegistry();
  const { attendingDay } = useCircleFilter();

  const texts = useRef<BitmapText[]>([]);

  const registerRef = useCallback((textNode: BitmapText | null) => {
    if (!textNode) return;
    texts.current.push(textNode);
  }, []);

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;
    const scale = mapInstance.scaled || 0;

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
    // the fact that I have to do this means the architecture is wrong but it what it is
  }, [map, attendingDay]);

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
