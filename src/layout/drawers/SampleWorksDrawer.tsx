import { RiCloseLine } from '@remixicon/react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState, WheelEvent } from 'react';

import { useMediaQuery } from '@/core/hooks/useMediaQuery';
import { Button } from '@/core/ui/components/button';
import { DrawerProps } from '@/core/ui/components/drawer/DrawerProvider';
import { cn } from '@/core/ui/utils';
import { debounce } from '@/core/utils/scheduler';

interface SampleWorksDrawerProps extends DrawerProps {
  works: string[];
  startingItemKey?: string;
}

function SampleWorksDrawer({ works, startingItemKey, close }: SampleWorksDrawerProps) {
  const matches = useMediaQuery('(min-width: 48rem)');

  const [activeItem, setActiveItem] = useState(() =>
    startingItemKey || works.length ? generateKey(works[0]!, 0) : ''
  );

  const sliderRef = useRef<HTMLUListElement | null>(null);
  const sliderItems = useRef<Map<string, HTMLLIElement>>(new Map());

  const thumbnailListRef = useRef<HTMLUListElement | null>(null);
  const thumbnailItems = useRef<Map<string, HTMLLIElement>>(new Map());

  const registerSliderItem = useCallback((key: string, node: HTMLLIElement | null) => {
    if (node) {
      sliderItems.current.set(key, node);
    }
  }, []);

  const registerThumbnailItem = useCallback((key: string, node: HTMLLIElement | null) => {
    if (node) {
      thumbnailItems.current.set(key, node);
    }
  }, []);

  useEffect(() => {
    if (!sliderRef.current || !startingItemKey) return;

    const sliderItem = sliderItems.current.get(startingItemKey);

    if (!sliderItem) return;

    sliderItem.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }, [startingItemKey]);

  const sliderIntersectionCallback = useMemo(
    () =>
      debounce((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const itemKey = entry.target.getAttribute('data-item-key');
          if (!itemKey) return;
          setActiveItem(itemKey);
        });
      }, 250),
    []
  );

  useEffect(() => {
    if (!sliderRef.current) return;

    const observer = new IntersectionObserver(sliderIntersectionCallback, {
      root: sliderRef.current,
      threshold: 1
    });

    sliderItems.current.forEach((node) => {
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, [sliderIntersectionCallback]);

  const thumbnailIntersectionCallback = useMemo(
    () =>
      debounce((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const itemKey = entry.target.getAttribute('data-item-key');
          if (!itemKey) return;
          if (itemToThumbnailKey(activeItem) === itemKey) {
            entry.target.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }
        });
      }, 250),
    [activeItem]
  );

  useEffect(() => {
    if (!thumbnailListRef.current) return;

    const observer = new IntersectionObserver(thumbnailIntersectionCallback, {
      root: sliderRef.current,
      threshold: 1
    });

    thumbnailItems.current.forEach((node) => {
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
    };
  }, [thumbnailIntersectionCallback]);

  const handleClickThumbnail = useCallback((key: string) => {
    if (!sliderRef.current) return;

    const sliderItem = sliderItems.current.get(key);
    if (!sliderItem) return;

    sliderItem.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    setActiveItem(key);
  }, []);

  const handleWheel = useCallback((event: WheelEvent<HTMLUListElement>) => {
    if (event.deltaY === 100 || event.deltaY === -100) {
      sliderRef.current?.scrollBy({
        left: event.deltaY,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <>
      {matches && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-card-foreground/70 backdrop-blur-lg" />
      )}

      <motion.section
        className="overflow-hidden flex flex-col bg-foreground/95 fixed bottom-0 left-0 right-0 top-0 md:left-1/2 md:top-1/2 md:bottom-auto md:right-auto md:-translate-y-1/2 md:-translate-x-1/2 md:rounded-lg"
        initial={{
          y: '100%'
        }}
        animate={{
          y: '0%'
        }}
        exit={{
          y: '100%'
        }}
        transition={{ type: 'tween' }}
      >
        <div className="flex item-center justify-between p-4">
          <h4 className="text-secondary text-xl font-semibold">{'Sample Works'}</h4>

          <Button
            variant={'ghost'}
            size={'icon-lg'}
            className="hover:bg-foreground"
            onClick={close}
          >
            <RiCloseLine className="size-8 text-secondary" />
          </Button>
        </div>

        <div className="my-auto flex flex-col gap-y-10">
          <ul
            ref={sliderRef}
            className="flex gap-x-8 px-2 overflow-x-auto snap-x snap-mandatory h-4/5 cursor-move scroll-smooth scrollbar-none"
            onWheel={handleWheel}
          >
            {works.map((work, idx) => (
              <li
                key={work}
                ref={(node) => registerSliderItem(generateKey(work, idx), node)}
                className="shrink-0 snap-center snap-always basis-4/5 max-h-4/5 flex items-center justify-center"
                data-item-key={generateKey(work, idx)}
              >
                <img
                  src={work}
                  loading="lazy"
                  alt={`Work ${idx + 1}`}
                  className="object-cover"
                  width={'100%'}
                  height={'100%'}
                />
              </li>
            ))}
          </ul>

          <ul
            ref={thumbnailListRef}
            role="list"
            aria-label="works thumbnails"
            className="flex gap-x-3 overflow-x-auto scroll-smooth scrollbar-thin px-2 py-4 bg-foreground"
          >
            {works.map((work, idx) => (
              <li
                key={work}
                ref={(node) =>
                  registerThumbnailItem(generateThumbnailKey(work, idx), node)
                }
                data-item-key={generateThumbnailKey(work, idx)}
                className={cn(
                  'shrink-0 rounded-sm overflow-hidden flex',
                  activeItem === generateKey(work, idx) ? 'border-3 border-primary' : ''
                )}
              >
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => handleClickThumbnail(generateKey(work, idx))}
                >
                  <img
                    loading="lazy"
                    src={work}
                    alt={`Work ${idx + 1}`}
                    className="object-cover"
                    width={64}
                    height={64}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>
    </>
  );
}

export default SampleWorksDrawer;

function generateKey(work: string, idx: number) {
  return `${work}-${idx}`;
}

function generateThumbnailKey(work: string, idx: number) {
  return `thumb-${work}-${idx}`;
}

function itemToThumbnailKey(itemKey: string) {
  return `thumb-${itemKey}`;
}
