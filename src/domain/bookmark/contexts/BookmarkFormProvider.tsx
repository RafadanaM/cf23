import {
  PropsWithChildren,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo
} from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';

import { CircleId } from '@/domain/circle/types';
import { BookmarkDetail, UserBookmark } from '../types/bookmark';

import { saveLocalBookmark, getLocalBookmark } from '../utils/bookmark';

function BookmarkFormProvider({ children }: PropsWithChildren<{}>) {
  const methods = useForm<UserBookmark>({
    defaultValues: {
      bookmarkedCircleIds: [],
      bookmarks: {} as Record<CircleId, BookmarkDetail>,
      bookmarkId: ''
    }
  });

  const values = useDeferredValue(useWatch({ control: methods.control }));
  const reset = useMemo(() => methods.reset, [methods.reset]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveLocalBookmark(values as UserBookmark);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [values]);

  useEffect(() => {
    const localBookmark = getLocalBookmark();

    if (localBookmark) {
      reset(localBookmark);
    }
  }, [reset]);

  return <FormProvider {...methods}>{children}</FormProvider>;
}

export default BookmarkFormProvider;

export const useBookmarkForm = () => useFormContext<UserBookmark>();

export function useBookmarkActions() {
  const { getValues, setValue, reset } = useBookmarkForm();

  const toggleBookmarkComplete = useCallback(
    (id: string) => {
      setValue(`bookmarks.${id}.isComplete`, !getValues(`bookmarks.${id}.isComplete`));
    },
    [setValue, getValues]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      const bookmarkedCircleIds = getValues('bookmarkedCircleIds');
      const bookmarks = getValues('bookmarks');
      const isBookmarked = !!bookmarks[id];

      if (isBookmarked) {
        setValue(
          'bookmarkedCircleIds',
          bookmarkedCircleIds.filter((circleId) => id !== circleId)
        );
        // oxlint-disable-next-line no-unused-vars
        const { [id]: _, ...filteredRecord } = bookmarks;
        setValue(`bookmarks`, filteredRecord);
      } else {
        setValue('bookmarkedCircleIds', [...bookmarkedCircleIds, id]);
        setValue(`bookmarks.${id}`, {
          id,
          isComplete: false,
          note: ''
        });
      }
    },
    [setValue, getValues]
  );

  const updateNote = useCallback(
    (id: string, note: string) => {
      setValue(`bookmarks.${id}.note`, note.trim());
    },
    [setValue]
  );

  const getAllBookmarkData = useCallback(() => {
    return getValues();
  }, [getValues]);

  const resetBookmark = useCallback(
    (values?: UserBookmark) => {
      reset(values);
    },
    [reset]
  );

  return useMemo(
    () => ({
      toggleBookmarkComplete,
      toggleBookmark,
      updateNote,
      getAllBookmarkData,
      resetBookmark
    }),
    [
      toggleBookmarkComplete,
      toggleBookmark,
      updateNote,
      getAllBookmarkData,
      resetBookmark
    ]
  );
}

export function useBookmarkList() {
  const { control } = useBookmarkForm();

  const bookmarkedCircleIds = useWatch({ control, name: 'bookmarkedCircleIds' });
  const bookmarks = useWatch({
    control,
    name: 'bookmarks'
  });

  return useMemo(
    () => ({
      bookmarks: bookmarkedCircleIds
        .map((id) => bookmarks[id])
        .filter((bookmark): bookmark is BookmarkDetail => Boolean(bookmark))
    }),
    [bookmarkedCircleIds, bookmarks]
  );
}

export function useIsBookmarked(id: string) {
  const { control } = useBookmarkForm();

  const isBookmarked: boolean = useWatch({
    control,
    name: `bookmarks.${id}`,
    compute: (bookmark) => !!bookmark
  });

  return useMemo(
    () => ({
      isBookmarked
    }),
    [isBookmarked]
  );
}

export function useBookmarkDetail(id: string) {
  const { control } = useBookmarkForm();

  const bookmarkDetail: BookmarkDetail = useWatch({
    control,
    name: `bookmarks.${id}`
  });

  return useMemo(
    () => ({
      bookmarkDetail
    }),
    [bookmarkDetail]
  );
}

export function useBookmarkId() {
  const { control } = useBookmarkForm();

  const bookmarkId: string = useWatch({
    control,
    name: `bookmarkId`
  });

  return useMemo(() => ({ bookmarkId }), [bookmarkId]);
}

export function useBookmark() {}
