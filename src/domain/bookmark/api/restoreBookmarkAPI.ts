import appAPIClient from '@/core/api/client';

import { UserBookmark } from '../types/bookmark';

async function restoreBookmarkAPI(id: string) {
  return appAPIClient.get<UserBookmark>(`/v1/bookmarks/${id}`);
}

export default restoreBookmarkAPI;
