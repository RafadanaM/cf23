import { RiInformationLine } from '@remixicon/react';
import { Button } from '@/core/ui/components/button';
import { useAppDrawer } from '@/layout/drawers/useAppDrawer';

function Attribution() {
  const { openDrawer } = useAppDrawer();

  const handleOpen = () => {
    openDrawer('ATTRIBUTION');
  };

  return (
    <Button
      size={'icon-sm'}
      variant={'outline'}
      className="fixed bottom-2 right-1 rounded-full shadow-md"
      onClick={handleOpen}
    >
      <RiInformationLine />
    </Button>
  );
}

export default Attribution;
