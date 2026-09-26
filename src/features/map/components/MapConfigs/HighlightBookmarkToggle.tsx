import { startTransition, useCallback } from 'react';

import { RiBookmark3Line } from '@remixicon/react';

import { Button } from '@/core/ui/components/button';

import { useHighlightBookmarkedCircles } from '../../contexts/HighlightBookmarkedCircleProvider';

function HighlightBookmarkToggle() {
  const { highlightBookmarkedCircles, setHighlightBookmarkedCircles } =
    useHighlightBookmarkedCircles();

  const handleToggle = useCallback(() => {
    startTransition(() => {
      setHighlightBookmarkedCircles((prevState) => !prevState);
    });
  }, [setHighlightBookmarkedCircles]);

  return (
    <Button
      size={'icon'}
      variant={highlightBookmarkedCircles ? 'default' : 'outline'}
      onClick={handleToggle}
      aria-pressed={highlightBookmarkedCircles}
      aria-label={
        highlightBookmarkedCircles
          ? 'Unhighlight Bookmarked Items on map'
          : 'Highlight Bookmarked Items on map'
      }
      className="shadow-xl"
    >
      <RiBookmark3Line />
    </Button>
  );
}

export default HighlightBookmarkToggle;
