import { useLocation, useNavigate, useRouter } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  ComponentProps,
  ComponentType,
  createContext,
  Fragment,
  PropsWithChildren,
  startTransition,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';

import { Spinner } from '@/core/ui/components/spinner';

import { interactionResponse } from '@/core/utils/scheduler';
import Drawer from './Drawer';
import { DrawerComponents, DrawerId, DrawerRegistry } from './DrawerRegistry';

interface DrawerOptions<TCloseProps = any> {
  hideOverlay?: boolean;
  onClose?: (closeProps?: TCloseProps) => void;
}

type DrawerContextValue<Id extends DrawerId, Props> = {
  openDrawer(id: Id, props: Props, options?: DrawerOptions): void;
  closeDrawer(id: Id, data?: unknown): void;
};

type IsEmptyObject<T> = keyof T extends never ? true : false;

const DrawerContext = createContext<DrawerContextValue<DrawerId, unknown>>(null!);

export type DrawerProps<TCloseProps = unknown> = {
  close: (closeProps?: TCloseProps) => void;
};

type DrawerInstance<Id extends DrawerId, Components extends DrawerComponents<Id>> = {
  id: Id;
  props: Omit<ComponentProps<Components[Id]>, 'close'>;
  options?: DrawerOptions;
};

type DrawerProviderProps<Components extends DrawerComponents<DrawerId>> = {
  registry: DrawerRegistry<Components>;
};

function DrawerProvider<Id extends DrawerId, Components extends DrawerComponents<Id>>({
  registry,
  children
}: PropsWithChildren<DrawerProviderProps<Components>>) {
  const [mounted, setMounted] = useState(false);
  const [trays, setDrawers] = useState<DrawerInstance<Id, Components>[]>([]);
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { history } = useRouter();

  const drawers = useRef(trays);

  useEffect(() => {
    drawers.current = trays;
  }, [trays]);

  const currentHash = hash;

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawerIds = useMemo(() => {
    const set = new Set<Id>();

    for (let key of registry.getAllDrawers().keys()) {
      set.add(key as Id);
    }
    return set;
  }, [registry]);

  const openDrawer = useCallback(
    (id: Id, props?: ComponentProps<Components[Id]>, options?: DrawerOptions) => {
      let shouldNavigate = true;
      startTransition(() => {
        setDrawers((prevDrawers) => {
          const nextDrawers = [
            ...prevDrawers.filter((drawer) => drawer.id !== id),
            { id, props: props ?? ({} as ComponentProps<Components[Id]>), options }
          ];

          if (prevDrawers.length === nextDrawers.length) {
            shouldNavigate = false;
          }

          return nextDrawers;
        });
      });

      if (!shouldNavigate) return;

      interactionResponse().then(() => {
        navigate({
          hash: id
        });
      });
    },
    [navigate]
  );

  const closeDrawer = useCallback(
    (id: Id, closeProps?: unknown) => {
      const idx = drawers.current.findIndex((drawer) => drawer.id === id);

      if (idx < 0) return;

      const onClose = drawers.current[idx]?.options?.onClose;

      const nextDrawers = drawers.current.reduce<DrawerInstance<Id, Components>[]>(
        (acc, drawer) => {
          if (drawer.id !== id) {
            acc.push(drawer);
          }
          return acc;
        },
        []
      );

      const nextHash = nextDrawers.length
        ? nextDrawers[nextDrawers.length - 1]?.id
        : undefined;

      navigate({
        hash: nextHash,
        replace: true
      });

      interactionResponse().then(() => {
        onClose?.(closeProps);
      });
    },
    [navigate]
  );

  const closeTopDrawer = useCallback(() => {
    history.back();
  }, [history]);

  useEffect(() => {
    if (!currentHash) {
      startTransition(() => {
        setDrawers((prev) => (prev.length ? [] : prev));
      });
      return;
    }

    if (!drawerIds.has(currentHash as Id)) return;

    if (currentHash) {
      // only update state when go back, opening may require props
      startTransition(() => {
        setDrawers((prev) => {
          const idx = prev.findIndex((d) => d.id === currentHash);
          if (idx === -1) return prev;

          const x = prev.slice(0, idx + 1);

          return x;
        });
      });
    }
  }, [currentHash, drawerIds]);

  const values = useMemo(
    () => ({
      openDrawer,
      closeDrawer,
      closeTopDrawer
    }),
    [closeDrawer, openDrawer, closeTopDrawer]
  );

  return (
    <DrawerContext.Provider value={values}>
      {children}

      {mounted &&
        createPortal(
          <div id="drawer-root" className="">
            <AnimatePresence>
              {trays.map((tray) => {
                const drawerData = registry.getDrawer(tray.id);

                const DrawerComponent = drawerData?.component as ComponentType<
                  typeof tray.props
                >;
                if (!DrawerComponent) return null;

                return (
                  <Fragment key={tray.id}>
                    {!tray.options?.hideOverlay && (
                      <motion.div
                        className="pointer-events-auto fixed top-0 bottom-0 left-0 right-0 bg-card-foreground/20 backdrop-blur-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeTopDrawer}
                      />
                    )}
                    <Suspense
                      fallback={
                        typeof drawerData?.loader === 'undefined' ? (
                          <DrawerLoader />
                        ) : (
                          drawerData.loader
                        )
                      }
                    >
                      <DrawerComponent
                        key={tray.id}
                        {...tray.props}
                        close={(closeProps?: unknown) => {
                          interactionResponse().then(() => {
                            closeDrawer(tray.id, closeProps);
                          });
                        }}
                      />
                    </Suspense>
                  </Fragment>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </DrawerContext.Provider>
  );
}

export default DrawerProvider;

function DrawerLoader() {
  return (
    <Drawer animateExit={false}>
      <Drawer.Body className="items-center py-10">
        <Spinner className="size-10 text-border" />
      </Drawer.Body>
    </Drawer>
  );
}

type ExtractCloseData<T> =
  T extends ComponentType<infer P>
    ? P extends DrawerProps<infer TData>
      ? TData
      : any
    : any;

export function createUseDrawer<Components extends DrawerComponents<DrawerId>>() {
  return function useDrawer() {
    const ctx = useContext(DrawerContext);

    if (!ctx) {
      throw new Error('useDrawer must be used inside DrawerProvider');
    }

    type Id = Extract<keyof Components, string>;

    return useMemo(
      () => ({
        openDrawer<K extends Id>(
          id: K,
          ...args: IsEmptyObject<
            Omit<ComponentProps<Components[K]>, 'close'>
          > extends true
            ? [props?: DrawerOptions<ExtractCloseData<Components[K]>>]
            : [
                props: Omit<ComponentProps<Components[K]>, 'close'> &
                  DrawerOptions<ExtractCloseData<Components[K]>>
              ]
        ) {
          const props = args[0] ?? {};
          const { hideOverlay, onClose, ...componentProps } = props;
          ctx.openDrawer(id, componentProps, { hideOverlay, onClose });
        },

        closeDrawer<K extends Id>(id: K, closeProps?: ExtractCloseData<Components[K]>) {
          ctx.closeDrawer(id, closeProps);
        }
      }),
      [ctx]
    );
  };
}
