import { Viewport } from 'pixi-viewport';

import {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react';
import { MAP_HEIGHT, MAP_WIDTH } from '../constants/map';

type MapRegistryContextValue = {
  map: RefObject<Viewport | null>;
  register: (target: Viewport | null) => void;
};

type Position = {
  x: number;
  y: number;
};

type MapControlContextValue = {
  zoomToPoint: (position: Position) => Promise<unknown>;
};

const MapControlContext = createContext<MapControlContextValue>({
  zoomToPoint: async (_position: Position) => {
    // noop
  }
});

const MapRegistryContext = createContext<MapRegistryContextValue>({
  map: {
    current: null
  },
  register: (_target: Viewport | null) => {
    // noop
  }
});

function MapProvider({ children }: PropsWithChildren<{}>) {
  const mapRef = useRef<Viewport | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const register = useCallback((map: Viewport | null) => {
    // cleanup
    if (mapRef.current) {
      mapRef.current.removeAllListeners();
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!map) {
      mapRef.current = null;
      observerRef.current = null;

      return;
    }

    mapRef.current = map;

    map
      .drag({
        pressDrag: true,
        mouseButtons: 'all',
        wheel: false
      })
      .pinch()
      .wheel()
      .decelerate({
        friction: 0.92,
        bounce: 0.8
      })
      .clampZoom({
        maxScale: 3,
        minScale: 0.25
      })
      .clamp({
        direction: 'all'
      })
      .moveCenter(MAP_WIDTH / 2, MAP_HEIGHT / 2)
      .setZoom(1, true);

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      const { width, height } = entry.contentRect;

      if (width > 0 && height > 0) {
        mapRef.current?.resize(width, height);
      }
    });

    observer.observe(document.body);

    observerRef.current = observer;
  }, []);

  const zoomToPoint = useCallback((position: Position) => {
    return new Promise<void>((resolve) => {
      const map = mapRef.current;
      if (!map) return;
      const dx = position.x - map.center.x;
      const dy = position.y - map.center.y;
      const distance = Math.hypot(dx, dy);

      mapRef.current?.animate({
        position,
        scale: 1,
        time: Math.max(150, Math.min(1000, distance * 0.5)),
        callbackOnComplete: () => {
          resolve();
        }
      });
    });
  }, []);

  const controlValues = useMemo(
    () => ({
      zoomToPoint
    }),
    [zoomToPoint]
  );

  const registryValues = useMemo(
    () => ({
      register,
      map: mapRef
    }),
    [register]
  );

  return (
    <MapControlContext value={controlValues}>
      <MapRegistryContext value={registryValues}>{children}</MapRegistryContext>
    </MapControlContext>
  );
}

export default MapProvider;

export const useMapControl = () => {
  const ctx = useContext(MapControlContext);

  if (!ctx) {
    throw new Error('useMapControl must be used with Map Provider');
  }

  return ctx;
};

export const useMapRegistry = () => {
  const ctx = useContext(MapRegistryContext);

  if (!ctx) {
    throw new Error('useMapRegistry must be used with Map Provider');
  }

  return ctx;
};
