import { SVGOverlay } from 'react-leaflet/SVGOverlay';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';

import { MAP_HEIGHT } from '../constants/map';
import { useActiveCircle } from '../contexts/ActiveCircleProvider';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import BoothRectangle from './BoothRectangle';
import CircleCodeText from './CircleCodeText';

function ActiveCircleBooth() {
  const { activeCircleId } = useActiveCircle();
  const { getCircleDetail } = useCircle();
  const { attendingDay } = useCircleFilter();

  const circle = getCircleDetail(activeCircleId);

  const isInAttendingDay = circle?.attendingDays.includes(attendingDay);

  if (!circle || !isInAttendingDay) return null;

  return (
    <>
      <BoothRectangle circle={circle} isActive pane="active" />
      <SVGOverlay
        key={circle.id}
        // oxlint-disable-next-line react-perf/jsx-no-new-array-as-prop
        bounds={[
          [MAP_HEIGHT - circle.rect.y, circle.rect.x],
          [
            MAP_HEIGHT - circle.rect.y - circle.rect.height,
            circle.rect.x + circle.rect.width
          ]
        ]}
        attributes={{
          viewBox: `0 0 ${circle.rect.width} ${circle.rect.height}`
        }}
        pane="active"
      >
        <CircleCodeText
          circle={circle}
          isActive
          offsetX={-circle.rect.x}
          offsetY={-circle.rect.y}
        />
      </SVGOverlay>
    </>
  );
}

export default ActiveCircleBooth;
