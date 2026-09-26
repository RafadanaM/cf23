import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import upsertBookmarkAPI from '../api/upsertBookmarkAPI';
import { UserBookmark } from '../types/bookmark';

function useUpsertBookmarkAPI() {
  const mutationFn = useCallback(
    async ({ id, bookmarkData }: { id: string; bookmarkData: UserBookmark }) => {
      const res = await upsertBookmarkAPI(id, bookmarkData);

      if (!res.ok) {
        throw new Error('Failed to upload bookmark: ' + res.error?.name);
      }

      return res.data;
    },
    []
  );

  const { isSuccess, mutate, isPending, isError } = useMutation({
    mutationFn
  });

  return useMemo(
    () => ({ isSuccess, mutate, isPending, isError }),
    [mutate, isSuccess, isPending, isError]
  );
}

export default useUpsertBookmarkAPI;
