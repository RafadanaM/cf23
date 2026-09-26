import { lazy, Suspense, useDeferredValue, useState } from 'react';

import useDebounceValue from '@/core/hooks/useDebounceValue';
import Section from '@/core/ui/components/section';

const BookmarkProgress = lazy(
  () => import('@/features/bookmark/components/BookmarkProgress')
);
const BookmarkedCircleList = lazy(
  () => import('@/features/bookmark/components/BookmarkCircleList')
);
const BookmarkSearch = lazy(
  () => import('@/features/bookmark/components/BookmarkSearch')
);

function BookmarkSection() {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword] = useDebounceValue(keyword.trim());

  const deferredKeyword = useDeferredValue(debouncedKeyword);

  return (
    <Section
      id="section-BOOKMARKS"
      role="tabpanel"
      aria-labelledby="tab-BOOKMARKS"
      title="Bookmarked Circles"
    >
      <Suspense>
        <BookmarkSearch keyword={keyword} onChange={setKeyword} />
      </Suspense>
      <div className="overflow-y-auto space-y-2">
        <Suspense>
          <BookmarkProgress />
        </Suspense>
        <Suspense>
          <BookmarkedCircleList keyword={deferredKeyword} />
        </Suspense>
      </div>
    </Section>
  );
}

export default BookmarkSection;
