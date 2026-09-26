import { RiBookmarkLine } from '@remixicon/react';
import { ComponentProps, MouseEvent } from 'react';

import { Button } from '@/core/ui/components/button';
import { cn } from '@/core/ui/utils';

import { useToast } from '@/core/ui/components/toast/ToastProvider';
import { interactionResponse } from '@/core/utils/scheduler';
import { CircleId } from '@/domain/circle/types';

import {
  useBookmarkActions,
  useIsBookmarked
} from '@/domain/bookmark/contexts/BookmarkFormProvider';

interface BookmarkButtonProps {
  circleId: CircleId;
  size?: ComponentProps<typeof Button>['size'];
}

function BookmarkButton({ circleId, size = 'icon' }: BookmarkButtonProps) {
  const { showToast } = useToast();
  const { toggleBookmark } = useBookmarkActions();
  const { isBookmarked } = useIsBookmarked(circleId);

  const handleToggleBookmark = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    toggleBookmark(circleId);

    await interactionResponse();

    showToast({
      title: isBookmarked ? 'Circle Removed from Bookmark' : 'Circle Added to Bookmark',
      description: 'Check your bookmark page'
    });
  };

  return (
    <Button
      size={size}
      variant={isBookmarked ? 'default' : 'outline'}
      onClick={handleToggleBookmark}
      aria-label={isBookmarked ? 'Unbookmark Item' : 'Bookmark Item'}
      className={isBookmarked ? undefined : 'border-primary'}
    >
      <RiBookmarkLine className={cn(!isBookmarked && 'text-primary')} />
    </Button>
  );
}

export default BookmarkButton;
