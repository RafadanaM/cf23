import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { useActiveCircle } from '../contexts/ActiveCircleProvider';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import BoothRectangle from './BoothRectangle';

function ActiveBooth() {
  const { activeCircleId } = useActiveCircle();
  const { getCircleDetail } = useCircle();
  const { attendingDay } = useCircleFilter();

  const circle = getCircleDetail(activeCircleId);

  const isInAttendingDay = circle?.attendingDays.includes(attendingDay);

  if (!circle || !isInAttendingDay) return null;

  return <BoothRectangle circle={circle} isActive />;
}

export default ActiveBooth;
