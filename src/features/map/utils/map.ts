import L from 'leaflet';

import { Circle } from '@/domain/circle/types';
import { MAP_HEIGHT } from '../constants/map';

export function boothToBounds(
  rect: Circle['rect'],
  offset?: { x?: number; y?: number }
): L.LatLngBoundsExpression {
  const offsetY = offset?.y || 0;
  const offsetX = offset?.x || 0;

  return [
    [MAP_HEIGHT - rect.y - rect.height + offsetY, rect.x + offsetX],
    [MAP_HEIGHT - rect.y + offsetY, rect.x + rect.width + offsetX]
  ];
}

export function boothCenter(rec: Circle['rect']) {
  return [MAP_HEIGHT - (rec.y + rec.height / 2), rec.x + rec.width / 2];
}
