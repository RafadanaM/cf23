import { RiDownloadCloud2Line, RiDownloadCloudLine, RiKeyFill } from '@remixicon/react';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/core/ui/components/button';
import { Field, FieldLabel, FieldDescription } from '@/core/ui/components/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/core/ui/components/input-group';
import { Spinner } from '@/core/ui/components/spinner';
import { useToast } from '@/core/ui/components/toast/ToastProvider';
import { yieldToMain } from '@/core/utils/scheduler';
import { useBookmarkActions } from '@/domain/bookmark/contexts/BookmarkFormProvider';
import useRestoreBookmarkAPI from '@/domain/bookmark/hooks/useRestoreBookmarkAPI';

interface FormFields {
  syncCode: string;
}

function RestoreSyncCard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid }
  } = useForm<FormFields>({
    defaultValues: {
      syncCode: ''
    },
    mode: 'onChange'
  });

  const { resetBookmark } = useBookmarkActions();

  const { isPending, mutate } = useRestoreBookmarkAPI();
  const { showToast } = useToast();

  const handleSync = (data: FormFields) => {
    mutate(
      { id: data.syncCode },

      {
        onSuccess: async (result) => {
          startTransition(() => {
            resetBookmark(result);
          });
          reset();

          await yieldToMain();
          showToast({
            title: 'Bookmark Restored!',
            description: 'Check your bookmarks page'
          });
        },
        onError: (e) => {
          showToast({
            title: 'Failed to Restore Bookmarks',
            description: e.message
          });
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSync)}>
      <Field>
        <div className="flex flex-col gap-3 bg-card rounded-lg border border-border p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-md bg-primary/10">
              <RiDownloadCloudLine size={32} className="text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="restore-sync-code" className="font-semibold text-lg">
                {'Restore from Cloud'}
              </FieldLabel>
              <FieldDescription className="text-sm text-muted-foreground">
                {
                  'Download your saved bookmark from another device by entering your unique sync code'
                }
              </FieldDescription>
            </div>
          </div>

          <InputGroup className="h-12">
            <InputGroupAddon>
              <RiKeyFill className="size-5" />
            </InputGroupAddon>
            <InputGroupInput
              id="restore-sync-code"
              className="ml-1 text-muted-foreground"
              placeholder="Enter Sync Code (e.g zFytvC4_EefTbytshP42K)"
              {...register('syncCode', { required: true })}
            />
          </InputGroup>
          <Button disabled={isPending || !isValid} size="lg">
            {isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <RiDownloadCloud2Line data-icon="inline-start" />
            )}
            {isPending ? 'Restoring data...' : 'Restore Data'}
          </Button>
        </div>
      </Field>
    </form>
  );
}

export default RestoreSyncCard;
