import { ComponentType, ReactNode } from 'react';

export type DrawerId = string;

export type DrawerComponent<Props> = ComponentType<Props>;

// oxlint-disable-next-line typescript/no-explicit-any
export type DrawerComponents<Id extends DrawerId> = Record<Id, DrawerComponent<any>>;

export type DrawerRegistry<Components extends DrawerComponents<DrawerId>> = {
  registerDrawer<K extends keyof Components>(
    id: K,
    component: Components[K],
    loader?: ReactNode
  ): void;
  getDrawer<K extends keyof Components>(
    id: K
  ):
    | {
        component: Components[K];
        loader?: ReactNode;
      }
    | undefined;
  getAllDrawers(): Map<
    keyof Components,
    {
      component: Components[keyof Components];
      loader: ReactNode;
    }
  >;
};

export function createDrawerRegistry<
  Components extends DrawerComponents<DrawerId>
>(): DrawerRegistry<Components> {
  type Id = keyof Components;
  const registry = new Map<
    Id,
    {
      component: Components[Id];
      loader: ReactNode;
    }
  >();

  function registerDrawer<K extends Id>(
    id: K,
    component: Components[K],
    loader?: ReactNode
  ) {
    registry.set(id, {
      component,
      loader
    });
  }

  function getDrawer<K extends Id>(
    id: K
  ):
    | {
        component: Components[K];
        loader?: ReactNode;
      }
    | undefined {
    return registry.get(id) as
      | {
          component: Components[K];
          loader?: ReactNode;
        }
      | undefined;
  }

  function getAllDrawers() {
    return registry;
  }

  return {
    getDrawer,
    registerDrawer,
    getAllDrawers
  };
}
