import { RiCloseCircleLine } from '@remixicon/react';
import { Button } from '@/core/ui/components/button';

import { useBadApple } from '../contexts/BadAppleProvider';

function BadAppleClose() {
  const { setPlay, setShow, show } = useBadApple();

  if (!show) return null;

  const handleEnd = () => {
    setPlay(false);
    setShow(false);
  };

  return (
    <Button
      variant={'destructive'}
      size={'icon-lg'}
      className="z-400 fixed bottom-40 left-1/2 -translate-x-1/2 rounded-full"
      onClick={handleEnd}
    >
      <RiCloseCircleLine className="size-6" />
    </Button>
  );
}

export default BadAppleClose;
