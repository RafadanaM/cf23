import { useEffect, useMemo } from 'react';

import { useBookmarkList } from '@/domain/bookmark/contexts/BookmarkFormProvider';
import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';

import { useCircleFilter } from '../contexts/CircleFilterProvider';
import { useHighlightBookmarkedCircles } from '../contexts/HighlightBookmarkedCircleProvider';
import { useMapRegistry } from '../contexts/MapProvider';
import { useTooltip } from '../contexts/TooltipProvider';
import BoothRectangle from './BoothRectangle';

function BookmarkedBooths() {
  const { getCircleDetail } = useCircle();
  const { bookmarks } = useBookmarkList();
  const { status } = useCircle();
  const { map } = useMapRegistry();

  const { updateCoord } = useTooltip();

  const { attendingDay } = useCircleFilter();
  const { highlightBookmarkedCircles } = useHighlightBookmarkedCircles();

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
    const mapInstance = map.current;

    if (!mapInstance || !highlightBookmarkedCircles) return;

    function update() {
      renderedItems.forEach((item) => {
        const screenPoint = mapInstance!.toScreen(
          item.circle.rect.x + item.circle.rect.width / 2,
          item.circle.rect.y
        );

        updateCoord(item.circle.id, { x: screenPoint.x, y: screenPoint.y });
      });
    }

    update();

    mapInstance.on('moved', update);

    return () => {
      mapInstance.off('moved', update);
    };
  }, [map, updateCoord, renderedItems, highlightBookmarkedCircles]);

  if (renderedItems.length === 0 || status !== 'success') return null;

  return renderedItems.map(({ circle }) => (
    <BoothRectangle key={circle.id} circle={circle} isBookmarked />
  ));
}

export default BookmarkedBooths;
