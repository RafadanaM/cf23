import { Spinner } from '../spinner';
import Drawer from './Drawer';

interface DrawerLoaderProps {
  height?: number;
  layoutId?: string;
}

function DrawerLoader({ height, layoutId }: DrawerLoaderProps) {
  return (
    <Drawer animateExit={false} layoutId={layoutId}>
      <Drawer.Body className="justify-center items-center py-10" style={{ height }}>
        <Spinner className="size-10 text-border" />
      </Drawer.Body>
    </Drawer>
  );
}

export default DrawerLoader;
