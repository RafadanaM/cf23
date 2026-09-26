import {
  RiFileImageLine,
  RiMap2Line,
  RiMapPinLine,
  RiCalendarLine
} from '@remixicon/react';
import { CSSProperties, memo, useCallback, MouseEvent, startTransition } from 'react';

import { Badge } from '@/core/ui/components/badge';
import { Button } from '@/core/ui/components/button';
import { cn } from '@/core/ui/utils';
import { interactionResponse } from '@/core/utils/scheduler';

import { Circle } from '@/domain/circle/types';
import BookmarkButton from '@/features/bookmark/components/BookmarkButton';
import useZoomToBooth from '@/features/map/hooks/useZoomToBooth';
import { useSearchForm } from '@/features/search/contexts/SearchFormProvider';
import { APP_DRAWER_ID, useAppDrawer } from '@/layout/drawers/useAppDrawer';

interface CircleCardProps {
  style?: CSSProperties;
  className?: string;
  circle: Circle;
}

function CircleCard({ circle, className, style }: CircleCardProps) {
  const { setIsOpen } = useSearchForm();
  const zoomToBooth = useZoomToBooth();
  const { openDrawer } = useAppDrawer();

  const handleSeeOnMap = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      startTransition(() => {
        setIsOpen(false);
      });

      await interactionResponse();

      zoomToBooth(circle);
    },
    [setIsOpen, zoomToBooth, circle]
  );

  const seeDetail = useCallback(() => {
    openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, { circle });
  }, [circle, openDrawer]);

  return (
    <div
      style={style}
      className={cn(
        'cursor-pointer flex flex-col gap-y-2 py-3 bg-card rounded-lg border',
        className
      )}
      onClick={seeDetail}
    >
      <div className="flex gap-2 px-3">
        {circle.imageUrl ? (
          <img
            src={circle.imageUrl}
            width={56}
            height={56}
            loading="lazy"
            className="object-cover size-14 overflow-hidden rounded-xl border border-muted-foreground"
          />
        ) : (
          <div className="flex items-center justify-center size-14 overflow-hidden rounded-xl border border-muted-foreground bg-secondary">
            <RiFileImageLine size={24} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-y-1.5 flex-1">
          <div>
            <h3 className="font-semibold text-left line-clamp-2">{circle.name}</h3>
            <div className="flex gap-1 items-center">
              <RiMapPinLine size={16} className="text-primary" />
              <span className="font-medium text-sm">{circle.code}</span>
            </div>
          </div>
          <div className="flex gap-x-1.5 items-center">
            <RiCalendarLine size={16} className="text-primary" />
            {circle.attendingDays.map((day) => (
              <Badge variant={'outline'} key={day} className="capitalize">
                {day.toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-1 self-start items-center">
          <Button
            size={'icon'}
            variant={'outline'}
            className="border-primary text-primary font-semibold"
            onClick={handleSeeOnMap}
          >
            <RiMap2Line className="text-primary size-4" />
          </Button>
          <BookmarkButton circleId={circle.id} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ul className="flex gap-1 w-max overflow-auto flex-1 px-3 no-scrollbar">
          {circle.fandoms.map((fandom, idx) => (
            <li key={`${fandom}-${idx}`}>
              <Badge
                variant="outline"
                className="text-xs capitalize py-0.5 h-auto bg-secondary"
              >
                {fandom}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default memo(CircleCard);
