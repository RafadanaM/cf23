import L from 'leaflet';
import { memo, useCallback, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SVGOverlay } from 'react-leaflet/SVGOverlay';

import { interactionResponse, yieldToMain } from '@/core/utils/scheduler';
import { Circle } from '@/domain/circle/types';

import { bounds, MAP_HEIGHT, MAP_WIDTH } from '../constants/map';
import { useMapRegistry } from '../contexts/MapProvider';
import CircleCodeText from './CircleCodeText';

interface CircleBoothLabelsProps {
  circles: Circle[];
}

function CircleBoothLabels({ circles }: CircleBoothLabelsProps) {
  return (
    <SVGOverlay
      bounds={bounds}
      attributes={{ viewBox: `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}` }}
    >
      {circles.map((circle) => (
        <CircleCodeText key={circle.id} circle={circle} />
      ))}
    </SVGOverlay>
  );
}

export default memo(CircleBoothLabels);

function useCircleCodeText() {
  const create = useCallback((circles: Circle[]) => {
    const res = renderToStaticMarkup(
      circles.map((circle) => <CircleCodeText key={circle.id} circle={circle} />)
    );

    return res;
  }, []);

  return create;
}

export const CircleBoothLabelsFast = memo(({ circles }: CircleBoothLabelsProps) => {
  const { map } = useMapRegistry();

  const createCircleCodeText = useCircleCodeText();

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    let isCancelled = false;
    let overlay: L.SVGOverlay | undefined;

    async function createBoothLabels(mapNode: L.Map, batchSize = 50) {
      const batchCount = Math.ceil(circles.length / batchSize);
      let circlesStr = '';

      let startTime = performance.now();
      for (let i = 0; i < batchCount; i++) {
        if (isCancelled) return;
        const start = i * batchSize;
        const end = Math.min(start + batchSize, circles.length);

        // console.log({ start, end, total: circles.length });
        circlesStr += createCircleCodeText(circles.slice(start, end));

        // yield every 16ms
        if (performance.now() - startTime > 16) {
          await yieldToMain();
          startTime = performance.now();
        }
      }

      if (isCancelled) return;
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgElement.setAttribute('viewBox', `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`);
      svgElement.innerHTML = circlesStr;

      overlay = L.svgOverlay(svgElement, bounds);
      overlay.addTo(mapNode);
    }

    interactionResponse().then(() => {
      createBoothLabels(mapInstance);
    });

    return () => {
      isCancelled = true;
      if (overlay) {
        overlay.remove();
      }
    };
  }, [map, circles, createCircleCodeText]);

  return null;
});
