import { Button } from '@/core/ui/components/button';
import Drawer from '@/core/ui/components/drawer/Drawer';
import { DrawerProps } from '@/core/ui/components/drawer/DrawerProvider';
import { Circle } from '@/domain/circle/types';

interface SeeBookmarkNoteDrawerProps extends DrawerProps {
  circle: Circle;
  note: string;
}

function SeeBookmarkNoteDrawer({ note, circle, close }: SeeBookmarkNoteDrawerProps) {
  return (
    <Drawer close={close}>
      <Drawer.Header className="flex gap-2 pb-2">
        <h2 className="text-xl font-semibold capitalize">{`${circle.name} Note`}</h2>
      </Drawer.Header>

      <Drawer.Body className="flex flex-col gap-2 border-t border-border">
        <div className="min-h-44 mt-1 p-2 rounded-lg bg-secondary border">
          <p className="whitespace-pre-wrap text-justify text-sm text-muted-foreground text-ellipsis leading-tight line-clamp-3">
            {note || '-'}
          </p>
        </div>
      </Drawer.Body>
      <Drawer.Footer className="flex flex-col">
        <Button size="lg" variant="secondary" onClick={close}>
          {'Close'}
        </Button>
      </Drawer.Footer>
    </Drawer>
  );
}

export default SeeBookmarkNoteDrawer;
