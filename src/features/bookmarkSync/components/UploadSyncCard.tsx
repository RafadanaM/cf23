import { RiFileCopyLine, RiUploadCloud2Line, RiUploadCloudLine } from '@remixicon/react';

import { Button } from '@/core/ui/components/button';
import { Field, FieldDescription, FieldLabel } from '@/core/ui/components/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/core/ui/components/input-group';
import { Spinner } from '@/core/ui/components/spinner';
import { useToast } from '@/core/ui/components/toast/ToastProvider';

import {
  useBookmarkActions,
  useBookmarkId
} from '@/domain/bookmark/contexts/BookmarkFormProvider';
import useCreateBookmarkAPI from '@/domain/bookmark/hooks/useCreateBookmarkAPI';
import useUpsertBookmarkAPI from '@/domain/bookmark/hooks/useUpsertBookmarkAPI';

function UploadSyncCard() {
  const { isPending: isUpsertBookmarkPending, mutate: upsertBookmark } =
    useUpsertBookmarkAPI();
  const { isPending: isCreateBookmarkPending, mutate: createBookmark } =
    useCreateBookmarkAPI();
  const { showToast } = useToast();

  const { bookmarkId } = useBookmarkId();
  const { getAllBookmarkData, resetBookmark } = useBookmarkActions();

  const isPending = isCreateBookmarkPending || isUpsertBookmarkPending;

  const handleSync = () => {
    const bookmarkData = getAllBookmarkData();
    if (bookmarkData.bookmarkId) {
      upsertBookmark(
        { id: bookmarkData.bookmarkId!, bookmarkData },
        {
          onSuccess: () => {
            showToast({
              title: 'Bookmark Synced!',
              description: 'Access this bookmark on other devices'
            });
          },
          onError: (e) => {
            showToast({
              title: 'Failed To Sync Bookmark',
              description: e.message
            });
          }
        }
      );
    } else {
      createBookmark(
        { bookmarkData },
        {
          onSuccess: (data) => {
            showToast({
              title: 'Bookmark Created!',
              description: 'Access this bookmark on other devices'
            });
            resetBookmark(data);
          },
          onError: (e) => {
            showToast({
              title: 'Failed To Create Bookmark',
              description: e.message
            });
          }
        }
      );
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getAllBookmarkData().bookmarkId);
      showToast({
        title: 'Copy Success!',
        description: 'Save your code to be reused later.',
        timeoutMs: 2000
      });
    } catch {
      showToast({
        title: 'Copy Failed!',
        description: 'Please update your browser',
        timeoutMs: 2000
      });
    }
  };

  const description = bookmarkId
    ? 'Use the unique sync code below to access your data on other devices.'
    : 'After first time sync, you will receive a unique code that can be reused to re-sync your data on current or other devices.';

  return (
    <div className="flex flex-col gap-3 bg-card rounded-lg border border-border p-4">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md bg-primary/10">
          <RiUploadCloudLine size={32} className="text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">{'Upload To Cloud'}</h3>
          <FieldDescription className="text-sm text-muted-foreground">
            {`Backup your bookmark and notes to our server. ${description}`}
          </FieldDescription>
        </div>
      </div>
      {Boolean(bookmarkId) && (
        <Field>
          <div className="flex flex-col gap-2 py-2 px-4 border bg-secondary rounded-md">
            <FieldLabel
              htmlFor="sync-code"
              className="text-sm font-semibold text-muted-foreground text-center self-center"
            >
              {'Your Sync Code'}
            </FieldLabel>

            <InputGroup className="h-10 bg-white flex items-center">
              <InputGroupInput id="sync-cod" value={bookmarkId} readOnly />
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={handleCopyCode} size="icon-sm">
                  <RiFileCopyLine />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </Field>
      )}
      <Button disabled={isPending} size="lg" onClick={handleSync}>
        {isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <RiUploadCloud2Line data-icon="inline-start" />
        )}
        {isPending ? 'Syncing data...' : 'Sync Data'}
      </Button>
    </div>
  );
}

export default UploadSyncCard;
