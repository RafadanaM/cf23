import { startTransition, useCallback } from 'react';

import { interactionResponse } from '@/core/utils/scheduler';
import { Circle } from '@/domain/circle/types';
import { APP_DRAWER_ID, useAppDrawer } from '@/layout/drawers/useAppDrawer';
import { useNavigationTab } from '@/layout/navigation/navigation';

import { useActiveCircleAction } from '../contexts/ActiveCircleProvider';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import { useMapControl } from '../contexts/MapProvider';
import { boothToBounds } from '../utils/map';

function useZoomToBooth() {
  const { zoomToPoint } = useMapControl();

  const { openDrawer } = useAppDrawer();
  const { setTab } = useNavigationTab();
  const { setActiveCircleId } = useActiveCircleAction();
  const { setAttendingDay } = useCircleFilter();

  const zoomToBooth = useCallback(
    async (circle: Circle) => {
      startTransition(() => {
        setTab('MAP');
        setActiveCircleId(circle.id);
      });

      // switching attending days is HEAVY because it rerenders everything, based on "testing" Activity seems to help alot
      if (circle.attendingDays.length === 1) {
        startTransition(() => {
          setAttendingDay((prevAttendingDay) => {
            if (
              !circle.attendingDays.includes(prevAttendingDay) &&
              circle.attendingDays[0]
            ) {
              return circle.attendingDays[0];
            }

            return prevAttendingDay;
          });
        });
      }

      // wait a bit until zoomToPoint
      await interactionResponse();

      await zoomToPoint(boothToBounds(circle.rect, { y: -150 }));

      // wait a bit after zoom completes
      await interactionResponse();

      // open circle detail drawer
      startTransition(() => {
        openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, { circle, hideOverlay: true });
      });
    },
    [openDrawer, zoomToPoint, setTab, setActiveCircleId, setAttendingDay]
  );

  return zoomToBooth;
}

export default useZoomToBooth;
