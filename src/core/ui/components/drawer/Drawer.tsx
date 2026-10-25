import { animate, motion, PanInfo, useDragControls, useMotionValue } from 'motion/react';
import {
  PropsWithChildren,
  useCallback,
  PointerEvent,
  CSSProperties,
  useRef,
  useEffect,
  useState,
  useMemo,
  startTransition
} from 'react';
import { throttle } from '@/core/utils/scheduler';
import { cn } from '../../utils';

interface DrawerProps {
  layoutId?: string;
  animateExit?: boolean;
  close?: () => void;
}

const CLOSE_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 600;

function DrawerContainer({
  children,
  close,
  animateExit = true,
  layoutId
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
      layoutId={layoutId}
      layout={layoutId ? 'position' : undefined}
      className="flex flex-col bg-card touch-none pointer-events-auto fixed rounded-t-2xl bottom-0 left-0 right-0 max-h-[80vh] border-t border-border shadow-[5px_-4px_19px_5px_rgba(0,0,0,0.25)] md:right-auto md:left-1/2 md:-translate-x-1/2 md:w-md will-change-transform"
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
  return <div className={cn('px-4 pb-2', className)}>{children}</div>;
}

interface DrawerBodyProps {
  className?: string;
  style?: CSSProperties;
}

function DrawerBody({ className, style, children }: PropsWithChildren<DrawerBodyProps>) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [scrollPosition, setScrollPosition] = useState<'START' | 'MIDDLE' | 'END'>(
    'START'
  );

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const div = divRef.current;
      if (!div) return;
      const divOverflow = div.scrollHeight > div.clientHeight;

      startTransition(() => {
        setIsOverflow(divOverflow);
        if (divOverflow) setScrollPosition('START');
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  // can use raf as well but this should be fine
  const handleScroll = useMemo(() => {
    // oxlint-disable-next-line react/refs
    return throttle(() => {
      const scrollTop = divRef?.current?.scrollTop || 0;

      if (scrollTop <= 1) {
        startTransition(() => {
          setScrollPosition('START');
        });
        return;
      }
      const scrollHeight = divRef.current?.scrollHeight || 0;
      const clientHeight = divRef.current?.clientHeight || 0;

      const hasReachedEnd = Math.abs(scrollHeight - (scrollTop + clientHeight)) <= 1;

      startTransition(() => {
        setScrollPosition(hasReachedEnd ? 'END' : 'MIDDLE');
        return;
      });
    }, 150);
  }, []);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      <div
        aria-hidden="true"
        role="presentation"
        className={cn(
          'absolute top-0 left-0 w-full h-3 pointer-events-none transition-opacity duration-200 bg-linear-to-b from-card-foreground/15',
          scrollPosition === 'START' || !isOverflow ? 'opacity-0' : 'opacity-100'
        )}
      />
      <div
        ref={divRef}
        onScroll={isOverflow ? handleScroll : undefined}
        className={cn(
          'flex overflow-y-auto items-stretch flex-col w-full px-4 py-2',
          className
        )}
        style={style}
      >
        {children}
        <div />
      </div>
      <div
        aria-hidden="true"
        role="presentation"
        className={cn(
          'absolute bottom-0 left-0 w-full h-3 pointer-events-none transition-opacity duration-200 bg-linear-to-t from-card-foreground/15',
          scrollPosition === 'END' || !isOverflow ? 'opacity-0' : 'opacity-100'
        )}
      />
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
