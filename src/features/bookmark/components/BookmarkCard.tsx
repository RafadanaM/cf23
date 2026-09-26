import {
  RiCheckLine,
  RiEditLine,
  RiFileImageLine,
  RiMapPinLine,
  RiCalendarLine,
  RiMap2Line
} from '@remixicon/react';
import { motion } from 'motion/react';
import { MouseEvent } from 'react';

import { Badge } from '@/core/ui/components/badge';
import { Button } from '@/core/ui/components/button';
import { Circle } from '@/domain/circle/types';

import useZoomToBooth from '@/features/map/hooks/useZoomToBooth';
import { useAppDrawer, APP_DRAWER_ID } from '@/layout/drawers/useAppDrawer';

import {
  useBookmarkActions,
  useBookmarkDetail
} from '@/domain/bookmark/contexts/BookmarkFormProvider';

interface BookmarkCardProps {
  circle: Circle;
}

function BookmarkCard({ circle }: BookmarkCardProps) {
  const { bookmarkDetail } = useBookmarkDetail(circle.id);
  const { toggleBookmarkComplete } = useBookmarkActions();

  const { openDrawer } = useAppDrawer();
  const zoomToBooth = useZoomToBooth();

  const toggleComplete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleBookmarkComplete(circle.id);
  };

  const handleEditNote = () => {
    openDrawer(APP_DRAWER_ID.EDIT_BOOKMARK_NOTE, {
      note: bookmarkDetail.note,
      circle
    });
  };

  const handleSeeNote = () => {
    openDrawer(APP_DRAWER_ID.SEE_BOOKMARK_NOTE, {
      circle,
      note: bookmarkDetail.note
    });
  };

  const openDetailDrawer = () => {
    openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, { circle });
  };

  const handleZoomToBooth = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    zoomToBooth(circle);
  };

  return (
    <motion.div layout="position">
      <div
        onClick={openDetailDrawer}
        className={
          'cursor-pointer flex flex-col gap-1 space-y-2 py-3 bg-card rounded-t-lg border'
        }
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
          <div className="flex flex-col flex-1 gap-y-1.5">
            <div>
              <h3 className="flex font-semibold line-clamp-2">{circle.name}</h3>
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
          <div className="flex flex-col items-end space-y-3">
            <div className="flex gap-2 items-center">
              <Button
                size={'icon'}
                variant={'outline'}
                className="border-primary text-primary font-semibold"
                onClick={handleZoomToBooth}
              >
                <RiMap2Line className="text-primary size-4" />
              </Button>
              <Button
                variant={bookmarkDetail.isComplete ? 'default' : 'outline'}
                size="icon"
                className="rounded-full"
                onClick={toggleComplete}
                aria-label={
                  bookmarkDetail.isComplete ? 'Unclomplete item' : 'Complete Item'
                }
              >
                <RiCheckLine className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 px-4 py-2 bg-card border-b border-l border-r border-border rounded-b-xl">
        <div className="flex flex-col flex-1">
          <h4 className="text-sm font-semibold">{'Note:'}</h4>
          <button
            onClick={handleSeeNote}
            className="block mt-1 p-2 rounded-lg bg-secondary border"
          >
            <p className="whitespace-pre-wrap text-justify text-xs text-muted-foreground text-ellipsis leading-tight line-clamp-3">
              {bookmarkDetail.note || '-'}
            </p>
          </button>
        </div>
        <Button
          onClick={handleEditNote}
          variant="secondary"
          size="icon"
          className="rounded-full bg-muted"
          aria-label="Edit Note"
        >
          <RiEditLine />
        </Button>
      </div>
    </motion.div>
  );
}

export default BookmarkCard;
