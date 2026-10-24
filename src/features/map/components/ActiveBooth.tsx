import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { useActiveCircle } from '../contexts/ActiveCircleProvider';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import useRectangleTextures from '../hooks/useRectangleTextures';
import BoothRectangle from './BoothRectangle';

function ActiveBooth() {
  const { activeCircleId } = useActiveCircle();
  const { getCircleDetail } = useCircle();
  const { attendingDay } = useCircleFilter();

  const circle = getCircleDetail(activeCircleId);

  const isInAttendingDay = circle?.attendingDays.includes(attendingDay);

  const { getTexture } = useRectangleTextures({ isActive: true });

  if (!circle || !isInAttendingDay) return null;
  const texture = getTexture(circle.rect.width, circle.rect.height);

  if (!texture) return;

  return <BoothRectangle circle={circle} isActive texture={texture} zIndex={5} />;
}

export default ActiveBooth;
