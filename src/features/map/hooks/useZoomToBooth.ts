import { startTransition, useCallback } from 'react';

import { interactionResponse } from '@/core/utils/scheduler';
import { Circle } from '@/domain/circle/types';
import { APP_DRAWER_ID, useAppDrawer } from '@/layout/drawers/useAppDrawer';
import { useNavigationTab } from '@/layout/navigation/navigation';

import { useMediaQuery } from '@/core/hooks/useMediaQuery';
import { BAD_APPLE_ID } from '@/domain/circle/constants';
import { useSearchForm } from '@/features/circleList/contexts/SearchFormProvider';
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
  const { setIsOpen } = useSearchForm();
  const matches = useMediaQuery('(min-width: 48rem)');

  const zoomToBooth = useCallback(
    async (circle: Circle) => {
      startTransition(() => {
        if (!matches) {
          setTab('MAP');
        }

        setIsOpen(false);
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

      await zoomToPoint(
        boothToBounds(circle.rect, { y: circle.id === BAD_APPLE_ID ? 0 : -150 })
      );

      // open circle detail drawer
      startTransition(() => {
        if (circle.id !== BAD_APPLE_ID) {
          openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, { circle, hideOverlay: true });
        }
      });

      await interactionResponse();
      setActiveCircleId(circle.id);
    },
    [
      openDrawer,
      zoomToPoint,
      setTab,
      setActiveCircleId,
      setAttendingDay,
      setIsOpen,
      matches
    ]
  );

  return zoomToBooth;
}

export default useZoomToBooth;
