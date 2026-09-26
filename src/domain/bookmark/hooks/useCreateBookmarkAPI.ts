import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import createBookmarkAPI from '../api/createBookmarkAPI';
import { UserBookmark } from '../types/bookmark';

function useCreateBookmarkAPI() {
  const mutationFn = useCallback(
    async ({ bookmarkData }: { bookmarkData: UserBookmark }) => {
      const res = await createBookmarkAPI(bookmarkData);

      if (!res.ok) {
        throw new Error('Failed to create bookmark: ' + res.error?.name);
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

export default useCreateBookmarkAPI;
