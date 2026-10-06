import { useDeferredValue } from 'react';
import { Control, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/core/ui/components/button';
import Drawer from '@/core/ui/components/drawer/Drawer';
import { DrawerProps } from '@/core/ui/components/drawer/DrawerProvider';
import { Field, FieldLabel } from '@/core/ui/components/field';
import { Textarea } from '@/core/ui/components/textarea';
import { cn } from '@/core/ui/utils';
import { interactionResponse } from '@/core/utils/scheduler';
import { Circle } from '@/domain/circle/types';

import { MAX_CHARACTERS } from '@/domain/bookmark/constants/bookmark';
import { useBookmarkActions } from '@/domain/bookmark/contexts/BookmarkFormProvider';

interface EditBookmarkNoteDrawerProps extends DrawerProps {
  circle: Circle;
  note: string;
}

interface EditBookmarkNote {
  note: string;
}

function EditBookmarkNoteDrawer({ note, circle, close }: EditBookmarkNoteDrawerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<EditBookmarkNote>({
    defaultValues: {
      note
    }
  });

  const { updateNote } = useBookmarkActions();

  const onSubmit = async (data: EditBookmarkNote) => {
    close();
    await interactionResponse();
    updateNote(circle.id, data.note);
  };

  return (
    <Drawer close={close}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Drawer.Header className="flex gap-2">
            <h2 className="text-xl font-semibold">{`${circle.name}`}</h2>
          </Drawer.Header>

          <Drawer.Body className="flex flex-col gap-2 border-t border-border">
            <div className="flex item-center justify-between">
              <FieldLabel
                className="text-md"
                htmlFor={`note-${circle.name}-${circle.id}`}
              >
                {'Note:'}
              </FieldLabel>

              <CharacterCounter control={control} />
            </div>
            <Textarea
              {...register('note', {
                maxLength: {
                  value: MAX_CHARACTERS,
                  message: `Note cannot exceed ${MAX_CHARACTERS} characters`
                }
              })}
              maxLength={MAX_CHARACTERS}
              id={`note-${circle.name}-${circle.id}`}
              placeholder="Type your notes here"
              className={cn(
                'resize-none text-sm h-40',
                !!errors.note && 'border-destructive focus-visible:ring-destructive/70'
              )}
            />
          </Drawer.Body>
        </Field>

        <Drawer.Footer className="flex flex-col gap-1">
          <Button className="h-10" size="lg" type="submit" disabled={!!errors.note}>
            {'Submit'}
          </Button>
          <Button variant="secondary" size="lg" onClick={close}>
            {'Cancel'}
          </Button>
        </Drawer.Footer>
      </form>
    </Drawer>
  );
}

export default EditBookmarkNoteDrawer;

interface CharacterCounterProps {
  control: Control<EditBookmarkNote, any, EditBookmarkNote>;
}

function CharacterCounter({ control }: CharacterCounterProps) {
  const characters = useWatch({
    control,
    name: 'note'
  });

  const characterCount = useDeferredValue(characters.length);

  return (
    <span className="text-muted-foreground font-medium text-sm">{`${characterCount}/${MAX_CHARACTERS}`}</span>
  );
}
