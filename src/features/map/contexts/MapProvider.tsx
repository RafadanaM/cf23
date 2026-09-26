import L from 'leaflet';

import {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react';

type MapRegistryContextValue = {
  map: RefObject<L.Map | null>;
  register: (target: L.Map | null) => void;
};

type MapControlContextValue = {
  zoomToPoint: (bounds: L.LatLngBoundsExpression) => Promise<unknown>;
};

const MapControlContext = createContext<MapControlContextValue>({
  zoomToPoint: async (_bounds: L.LatLngBoundsExpression) => {
    // noop
  }
});

const MapRegistryContext = createContext<MapRegistryContextValue>({
  map: {
    current: null
  },
  register: (_target: L.Map | null) => {
    // noop
  }
});

function MapProvider({ children }: PropsWithChildren<{}>) {
  const mapRef = useRef<L.Map | null>(null);

  const register = useCallback((map: L.Map | null) => {
    mapRef.current = map;
    map?.setZoom(-1, {
      animate: false
    });
  }, []);

  const zoomToPoint = useCallback((bounds: L.LatLngBoundsExpression) => {
    return new Promise((resolve) => {
      mapRef.current?.once('moveend', resolve);

      mapRef.current?.flyToBounds(bounds, {
        maxZoom: 0
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
