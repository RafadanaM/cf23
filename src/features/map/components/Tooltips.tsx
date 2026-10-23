import { useCallback, useEffect, useMemo, useRef } from 'react';

import { cn } from '@/core/ui/utils';

import { useBookmarkList } from '@/domain/bookmark/contexts/BookmarkFormProvider';
import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';

import { useCircleFilter } from '../contexts/CircleFilterProvider';
import { useHighlightBookmarkedCircles } from '../contexts/HighlightBookmarkedCircleProvider';
import { useTooltip } from '../contexts/TooltipProvider';

function Tooltips() {
  const { getCircleDetail } = useCircle();
  const { bookmarks } = useBookmarkList();
  const { status } = useCircle();
  const { getCoord } = useTooltip();

  const { attendingDay } = useCircleFilter();
  const { highlightBookmarkedCircles } = useHighlightBookmarkedCircles();

  const tooltips = useRef<Map<string, HTMLDivElement>>(new Map());

  const register = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      if (!node) return;
      tooltips.current.set(id, node);
    },
    []
  );

  const renderedItems = useMemo(
    () =>
      bookmarks.reduce<{ circle: Circle; isCompleted: boolean }[]>((acc, curr) => {
        const circle = getCircleDetail(curr.id);

        if (circle?.attendingDays.includes(attendingDay)) {
          acc.push({ circle, isCompleted: curr.isComplete });
        }

        return acc;
      }, []),
    [getCircleDetail, bookmarks, attendingDay]
  );

  useEffect(() => {
    if (!highlightBookmarkedCircles) return;
    let rafId: number | undefined;

    let elapsed = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function animate(currentTime: number) {
      const delta = currentTime - elapsed;

      if (delta >= interval) {
        tooltips.current.forEach((tooltip, id) => {
          const position = getCoord(id);
          if (!position) return;

          tooltip.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -100%)`;
        });

        elapsed = currentTime - (delta % interval);
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      if (typeof rafId === 'number') {
        cancelAnimationFrame(rafId);
      }
    };
  }, [highlightBookmarkedCircles, getCoord]);

  if (renderedItems.length === 0 || status !== 'success' || !highlightBookmarkedCircles)
    return null;

  return renderedItems.map((item) => (
    <div
      key={item.circle.id}
      ref={register(item.circle.id)}
      className="absolute top-0 left-0 flex flex-col items-center pointer-events-none"
    >
      <div
        className={cn(
          'flex flex-col gap-y-1 shadow-lg py-1 px-2 border border-border rounded-md',
          item.isCompleted ? 'bg-secondary/90' : 'bg-card/90'
        )}
      >
        <span className="text-sm font-semibold">{item.circle.code}</span>
        <span className="text-xs font-medium">{item.circle.name}</span>
      </div>
      <div
        className={cn(
          'bg-card border-border border shadow-lg size-3',
          item.isCompleted ? 'bg-secondary/90' : 'bg-card/90'
        )}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
        }}
      />
    </div>
  ));
}

export default Tooltips;
