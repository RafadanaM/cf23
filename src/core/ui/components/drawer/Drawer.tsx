import { animate, motion, PanInfo, useDragControls, useMotionValue } from 'motion/react';
import { PropsWithChildren, useCallback, PointerEvent } from 'react';
import { cn } from '../../utils';

interface DrawerProps {
  animateExit?: boolean;
  close?: () => void;
}

const CLOSE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 600;

function DrawerContainer({
  children,
  close,
  animateExit = true
}: PropsWithChildren<DrawerProps>) {
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > CLOSE_THRESHOLD || info.velocity.y > VELOCITY_THRESHOLD) {
        close?.();
      } else {
        animate(y, 0);
      }
    },
    [close, y]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!close) return;
      e.preventDefault();
      dragControls.start(e);
    },
    [dragControls, close]
  );

  return (
    <motion.div
      className="bg-card pointer-events-auto fixed rounded-t-2xl bottom-0 left-0 right-0 max-h-[80vh] border-t border-border shadow-[5px_-4px_19px_5px_rgba(0,0,0,0.25)] md:right-auto md:left-1/2 md:-translate-x-1/2 md:w-md"
      initial={{
        y: '100%'
      }}
      animate={{
        y: '0%'
      }}
      exit={
        animateExit
          ? {
              y: '100%'
            }
          : undefined
      }
      style={{
        y
      }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.3}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      dragConstraints={{ top: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex flex-col justify-center items-center touch-none select-none h-6 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
      >
        <div className="rounded-full bg-border h-1 w-10" />
      </div>

      {children}
    </motion.div>
  );
}

interface DrawerContentProps {
  className?: string;
}
function DrawerContent({ className, children }: PropsWithChildren<DrawerContentProps>) {
  return <div className={cn('flex flex-col', className)}>{children}</div>;
}

interface DrawerHeaderProps {
  className?: string;
}

function DrawerHeader({ className, children }: PropsWithChildren<DrawerHeaderProps>) {
  return <div className={cn('px-4', className)}>{children}</div>;
}

interface DrawerBodyProps {
  className?: string;
}

function DrawerBody({ className, children }: PropsWithChildren<DrawerBodyProps>) {
  return (
    <div
      className={cn(
        'flex flex-1 items-stretch flex-col overflow-y-auto w-full p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface DrawerFooterProps {
  className?: string;
}

function DrawerFooter({ className, children }: PropsWithChildren<DrawerFooterProps>) {
  return (
    <div className={cn('px-4 py-3 border-t border-border', className)}>{children}</div>
  );
}

const Drawer = Object.assign(DrawerContainer, {
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter
});

export default Drawer;
