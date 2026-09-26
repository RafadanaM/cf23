import { createClientOnlyFn } from '@tanstack/react-start';

import { UserBookmark } from '../types/bookmark';

import { BOOKMARK_STORAGE_ID } from '../constants/bookmark';

function isPlainObject(val: unknown): val is object {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function hasKey<Key extends string>(obj: object, key: Key): obj is Record<Key, unknown> {
  return Object.hasOwn(obj, key);
}

// wtf is this bro, I don't think anyone will manually update the local storage
function isBookmarkValid(val: unknown): val is UserBookmark {
  if (!isPlainObject(val)) return false;

  const isValidId = hasKey(val, 'bookmarkId') && typeof val.bookmarkId === 'string';

  const isBookmarksValid =
    hasKey(val, 'bookmarks') &&
    isPlainObject(val.bookmarks) &&
    Object.entries(val.bookmarks).every(
      ([key, bookmarkDetail]) =>
        typeof key === 'string' &&
        isPlainObject(bookmarkDetail) &&
        hasKey(bookmarkDetail, 'id') &&
        typeof bookmarkDetail.id === 'string' &&
        hasKey(bookmarkDetail, 'isComplete') &&
        typeof bookmarkDetail.isComplete === 'boolean' &&
        hasKey(bookmarkDetail, 'note') &&
        typeof bookmarkDetail.note === 'string'
    );

  const isBookmarkedCircleIdsValid =
    hasKey(val, 'bookmarkedCircleIds') &&
    Array.isArray(val.bookmarkedCircleIds) &&
    val.bookmarkedCircleIds.every((id) => typeof id === 'string');

  return isValidId && isBookmarksValid && isBookmarkedCircleIdsValid;
}

export const saveLocalBookmark = createClientOnlyFn((bookmarkData: UserBookmark) => {
  try {
    localStorage.setItem(BOOKMARK_STORAGE_ID, JSON.stringify(bookmarkData));
  } catch {
    //noop
  }
});

export const getLocalBookmark = createClientOnlyFn(() => {
  try {
    const result = localStorage.getItem(BOOKMARK_STORAGE_ID);

    if (!result) return null;

    const parsedData = JSON.parse(result);

    const isValid = isBookmarkValid(parsedData);

    if (!isValid) {
      localStorage.removeItem(BOOKMARK_STORAGE_ID);
      return null;
    }

    return parsedData;
  } catch {
    localStorage.removeItem(BOOKMARK_STORAGE_ID);
    return null;
  }
});
