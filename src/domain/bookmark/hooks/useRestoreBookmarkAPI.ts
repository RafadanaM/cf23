import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import restoreBookmarkAPI from '../api/restoreBookmarkAPI';
import { UserBookmark } from '../types/bookmark';

function useRestoreBookmarkAPI() {
  const mutationFn = useCallback(async ({ id }: { id: string }) => {
    const res = await restoreBookmarkAPI(id);

    if (!res.ok) {
      throw new Error('Failed to restore bookmark: ' + res.error?.name);
    }

    return res.data;
  }, []);

  const { isSuccess, mutate, isPending, isError } = useMutation<
    UserBookmark,
    Error,
    { id: string }
  >({
    mutationFn
  });

  return useMemo(
    () => ({ isSuccess, mutate, isPending, isError }),
    [mutate, isSuccess, isPending, isError]
  );
}

export default useRestoreBookmarkAPI;
