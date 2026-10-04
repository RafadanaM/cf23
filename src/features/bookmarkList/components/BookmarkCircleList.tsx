import uFuzzy from '@leeoniya/ufuzzy';
import { AnimatePresence } from 'motion/react';
import { memo, useMemo } from 'react';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';
import { Circle } from '@/domain/circle/types';

import { useBookmarkList } from '@/domain/bookmark/contexts/BookmarkFormProvider';
import BookmarkCard from './BookmarkCard';

interface BookmarkedCircleListProps {
  keyword?: string;
}

const uf = new uFuzzy({
  intraMode: 1
});

function BookmarkedCircleList({ keyword = '' }: BookmarkedCircleListProps) {
  const { bookmarks } = useBookmarkList();
  const { getCircleDetail } = useCircle();

  const bookmarkItems = useMemo(
    () =>
      bookmarks
        .sort((a, b) => {
          return Number(a.isComplete) - Number(b.isComplete);
        })
        .map((bookmark) => getCircleDetail(bookmark.id))
        .filter((item): item is Circle => Boolean(item)),
    [getCircleDetail, bookmarks]
  );

  const keyedBookmarkItems = useMemo(
    () => bookmarkItems.map((item) => `${item.name} ${item.code}`),
    [bookmarkItems]
  );

  const result: Circle[] = useMemo(() => {
    const query = keyword.trim();
    if (!query) return bookmarkItems;

    const idxs = uf.filter(keyedBookmarkItems, query);

    if (!idxs || idxs.length === 0) return [];

    const info = uf.info(idxs, keyedBookmarkItems, query);

    const order = uf.sort(info, keyedBookmarkItems, query);

    return order.map((i) => bookmarkItems[info.idx[i]!]!);
  }, [keyword, keyedBookmarkItems, bookmarkItems]);

  if (result.length === 0) {
    return (
      <div className="flex flex-col gap-2 bg-card rounded-xl border border-border p-4">
        <p className="font-semibold text-center">{'You have no Circles Bookmarked'}</p>

        <p className="text-center text-sm text-muted-foreground">
          {'Bookmark circles to track your progress'}
        </p>
      </div>
    );
  }

  return (
    <div className={'flex flex-col gap-2 pb-20 scrollbar-thin'}>
      <AnimatePresence>
        <BookmarkCards circles={result} />
      </AnimatePresence>
    </div>
  );
}

export default BookmarkedCircleList;

interface BookmarkCardsProps {
  circles: Circle[];
}

const BookmarkCards = memo(({ circles }: BookmarkCardsProps) => {
  return circles.map((bookmarkItem) => {
    return <BookmarkCard key={bookmarkItem.id} circle={bookmarkItem} />;
  });
});
