import { useMemo } from 'react';
import { SVGOverlay } from 'react-leaflet/SVGOverlay';

import { useBookmarkList } from '@/domain/bookmark/contexts/BookmarkFormProvider';
import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';

import { bounds, MAP_HEIGHT, MAP_WIDTH } from '../constants/map';
import { useCircleFilter } from '../contexts/CircleFilterProvider';
import { useHighlightBookmarkedCircles } from '../contexts/HighlightBookmarkedCircleProvider';
import BoothRectangle from './BoothRectangle';
import CircleCodeText from './CircleCodeText';

function BookmarkedCircleBooths() {
  const { getCircleDetail } = useCircle();
  const { bookmarks } = useBookmarkList();
  const { status } = useCircle();

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

  if (renderedItems.length === 0 || status !== 'success') return null;

  return (
    <>
      {renderedItems.map(({ circle, isCompleted }) => (
        <BoothRectangle
          key={circle.id}
          circle={circle}
          isBookmarked
          isHighlighted={highlightBookmarkedCircles}
          isBookmarkComplete={isCompleted}
          pane="bookmarks"
        />
      ))}

      <SVGOverlay
        bounds={bounds}
        attributes={{ viewBox: `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}` }}
        pane="bookmarks"
      >
        {renderedItems.map(({ circle }) => (
          <CircleCodeText key={circle.id} circle={circle} isActive />
        ))}
      </SVGOverlay>
    </>
  );
}

export default BookmarkedCircleBooths;
