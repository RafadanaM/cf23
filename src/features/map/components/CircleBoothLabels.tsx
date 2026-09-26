import { memo } from 'react';
import { SVGOverlay } from 'react-leaflet/SVGOverlay';

import { Circle } from '@/domain/circle/types';

import { bounds, MAP_HEIGHT, MAP_WIDTH } from '../constants/map';
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
