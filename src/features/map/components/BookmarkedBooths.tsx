import { useEffect, useMemo } from 'react';

import { useBookmarkList } from '@/domain/bookmark/contexts/BookmarkFormProvider';
import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';

import { useCircleFilter } from '../contexts/CircleFilterProvider';
import { useHighlightBookmarkedCircles } from '../contexts/HighlightBookmarkedCircleProvider';
import { useMapRegistry } from '../contexts/MapProvider';
import { useTooltip } from '../contexts/TooltipProvider';
import useRectangleTextures from '../hooks/useRectangleTextures';
import BoothRectangles from './BoothRectangles';

function BookmarkedBooths() {
  const { getCircleDetail } = useCircle();
  const { bookmarks } = useBookmarkList();
  const { status } = useCircle();

  const { attendingDay } = useCircleFilter();

  const renderedItems = useMemo(
    () =>
      bookmarks.reduce<Circle[]>((acc, curr) => {
        const circle = getCircleDetail(curr.id);

        if (circle?.attendingDays.includes(attendingDay)) {
          acc.push(circle);
        }

        return acc;
      }, []),
    [getCircleDetail, bookmarks, attendingDay]
  );

  useHandleMapMove(renderedItems);
  const { getTexture } = useRectangleTextures({ isBookmarked: true });

  if (renderedItems.length === 0 || status !== 'success') return null;

  return (
    <BoothRectangles
      getRectangleTexture={getTexture}
      circles={renderedItems}
      isBookmarked
    />
  );
}

export default BookmarkedBooths;

function useHandleMapMove(renderedItems: Circle[]) {
  const { map } = useMapRegistry();

  const { updateCoord } = useTooltip();
  const { highlightBookmarkedCircles } = useHighlightBookmarkedCircles();

  useEffect(() => {
    const mapInstance = map.current;

    if (!mapInstance || !highlightBookmarkedCircles || renderedItems.length === 0) return;

    function update() {
      renderedItems.forEach((item) => {
        const screenPoint = mapInstance!.toScreen(
          item.rect.x + item.rect.width / 2,
          item.rect.y + item.rect.height / 2
        );

        updateCoord(item.id, { x: screenPoint.x, y: screenPoint.y });
      });
    }

    update();

    mapInstance.on('moved', update);

    return () => {
      mapInstance.off('moved', update);
    };
  }, [map, updateCoord, renderedItems, highlightBookmarkedCircles]);
}
