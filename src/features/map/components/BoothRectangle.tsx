import L, {
  LeafletEventHandlerFnMap,
  PathOptions,
  Rectangle as LeafletRectangle,
  PointTuple
} from 'leaflet';
import { memo, startTransition, useCallback, useMemo, useRef } from 'react';
import { Rectangle } from 'react-leaflet/Rectangle';
import { Tooltip } from 'react-leaflet/Tooltip';

import { cn } from '@/core/ui/utils';
import { interactionResponse } from '@/core/utils/scheduler';
import { Circle } from '@/domain/circle/types';
import { useAppDrawer, APP_DRAWER_ID } from '@/layout/drawers/useAppDrawer';

import { useActiveCircleAction } from '../contexts/ActiveCircleProvider';
import { boothToBounds } from '../utils/map';

interface BoothRectangleProps {
  pane?: string;
  circle: Circle;
  isActive?: boolean;
  isBookmarkComplete?: boolean;
  isBookmarked?: boolean;
  isHighlighted?: boolean;
}

const tooltipOffset: PointTuple = [0, 0];

function BoothRectangle({
  circle,
  isActive = false,
  isBookmarked = false,
  isHighlighted = false,
  isBookmarkComplete = false,
  pane
}: BoothRectangleProps) {
  const rectangleRef = useRef<LeafletRectangle | null>(null);
  // IT IS IMPORTANT TO KEEP THESE HOOKS CONSISTENT ACCROSS RENDERS
  const { openDrawer } = useAppDrawer();
  const { setActiveCircleId } = useActiveCircleAction();

  const { backgroundColor, backgroundColorHover, borderColor } = getColorConfig(
    circle,
    isActive,
    isBookmarked
  );

  const eventHandlers: LeafletEventHandlerFnMap = useMemo(() => {
    return {
      click: async () => {
        startTransition(() => {
          setActiveCircleId(circle.id);
        });
        await interactionResponse();

        openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, {
          circle,
          hideOverlay: true,
          onClose: () => {
            startTransition(() => {
              setActiveCircleId('');
            });
          }
        });
      },
      mouseover: () => {
        rectangleRef.current?.setStyle({
          fillColor: backgroundColorHover
        });
      },
      mouseout: () => {
        rectangleRef.current?.setStyle({
          fillColor: backgroundColor
        });
      }
    };
  }, [openDrawer, circle, backgroundColor, backgroundColorHover, setActiveCircleId]);

  const pathOptions: PathOptions = useMemo(
    () => ({
      fillColor: backgroundColor,
      color: borderColor,
      pane
    }),
    [borderColor, backgroundColor, pane]
  );

  const bounds = useMemo(() => boothToBounds(circle.rect), [circle.rect]);

  return (
    <Rectangle
      ref={rectangleRef}
      eventHandlers={eventHandlers}
      bounds={bounds}
      pathOptions={pathOptions}
      fillOpacity={0.5}
      className="pointer-events-auto"
      pane={pane}
    >
      {isHighlighted && (
        <Tooltip
          direction="top"
          offset={tooltipOffset}
          permanent
          className={cn('flex flex-col', isBookmarkComplete ? 'brightness-80' : '')}
        >
          <span className="text-sm font-bold">{circle.code}</span>
          <span className="text-xs font-medium">{circle.name}</span>
        </Tooltip>
      )}
    </Rectangle>
  );
}

export default memo(BoothRectangle);

export function useBoothRectangle() {
  // IT IS IMPORTANT TO KEEP THESE HOOKS CONSISTENT ACCROSS RENDERS
  const { openDrawer } = useAppDrawer();
  const { setActiveCircleId } = useActiveCircleAction();

  const createBooth = useCallback(
    ({ circle }: BoothRectangleProps) => {
      const colorConfig = getColorConfig(circle, false, false);
      const bounds = boothToBounds(circle.rect);

      const rect = L.rectangle(bounds, {
        fillColor: colorConfig.backgroundColor,
        color: colorConfig.borderColor,
        fillOpacity: 0.5
      });

      rect.on('click', async () => {
        startTransition(() => {
          setActiveCircleId(circle.id);
        });
        await interactionResponse();

        openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, {
          circle,
          hideOverlay: true,
          onClose: () => {
            startTransition(() => {
              setActiveCircleId('');
            });
          }
        });
      });

      rect.on('mouseover', () => {
        rect.setStyle({
          fillColor: colorConfig.backgroundColorHover
        });
      });

      rect.on('mouseout', () => {
        rect.setStyle({
          fillColor: colorConfig.backgroundColor
        });
      });

      return rect;
    },
    [openDrawer, setActiveCircleId]
  );

  return createBooth;
}

function getColorConfig(circle: Circle, isActive: boolean, isBookmarked: boolean) {
  if (isActive || isBookmarked) {
    return {
      backgroundColor: '#5a58ed',
      borderColor: '#432dd7',
      backgroundColorHover: '#432dd7'
    };
  }

  return {
    backgroundColor: circle.displayConfig.backgroundColor,
    borderColor: circle.displayConfig.borderColor,
    backgroundColorHover: circle.displayConfig.backgroundColorHover
  };
}
