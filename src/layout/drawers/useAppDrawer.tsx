import { lazy } from 'react';

import DrawerLoader from '@/core/ui/components/drawer/DrawerLoader';
import { createUseDrawer } from '@/core/ui/components/drawer/DrawerProvider';
import { createDrawerRegistry } from '@/core/ui/components/drawer/DrawerRegistry';
import { APP_DRAWER_ID } from './constants';

const CircleDetailDrawer = lazy(() => import('./CircleDetailDrawer'));
const EditBookmarkNoteDrawer = lazy(() => import('./EditBookmarkNoteDrawer'));
const SeeBookmarkNoteDrawer = lazy(() => import('./SeeBookmarkNoteDrawer'));
const SampleWorksDrawer = lazy(() => import('./SampleWorksDrawer'));
const CircleFilterDrawer = lazy(() => import('./CircleFilterDrawer'));
const AttributionDrawer = lazy(() => import('./AttributionDrawer'));

const appDrawerRegistryMap = {
  [APP_DRAWER_ID.CIRCLE_DETAIL]: CircleDetailDrawer,
  [APP_DRAWER_ID.EDIT_BOOKMARK_NOTE]: EditBookmarkNoteDrawer,
  [APP_DRAWER_ID.SEE_BOOKMARK_NOTE]: SeeBookmarkNoteDrawer,
  [APP_DRAWER_ID.SAMPLE_WORKS]: SampleWorksDrawer,
  [APP_DRAWER_ID.CIRCLE_FILTER]: CircleFilterDrawer,
  [APP_DRAWER_ID.ATTRIBUTION]: AttributionDrawer
} as const;

const HEIGHT_MAPPING = {
  [APP_DRAWER_ID.CIRCLE_DETAIL]: 436,
  [APP_DRAWER_ID.EDIT_BOOKMARK_NOTE]: 359,
  [APP_DRAWER_ID.SEE_BOOKMARK_NOTE]: 295,
  [APP_DRAWER_ID.SAMPLE_WORKS]: undefined,
  [APP_DRAWER_ID.CIRCLE_FILTER]: 587,
  [APP_DRAWER_ID.ATTRIBUTION]: 543
};

type AppDrawerRegistryMap = typeof appDrawerRegistryMap;

export const appDrawerRegistry = createDrawerRegistry<AppDrawerRegistryMap>();

Object.entries(appDrawerRegistryMap).forEach(([key, value]) => {
  appDrawerRegistry.registerDrawer(
    key as keyof AppDrawerRegistryMap,
    value,
    getLoader(key as (typeof APP_DRAWER_ID)[keyof typeof APP_DRAWER_ID])
  );
});

function getLoader(key: (typeof APP_DRAWER_ID)[keyof typeof APP_DRAWER_ID]) {
  if (key === APP_DRAWER_ID.SAMPLE_WORKS) return null;

  const height = HEIGHT_MAPPING[key];

  console.log({ height });

  if (!height) return undefined;

  return <DrawerLoader height={height} layoutId={key} />;
}

export const useAppDrawer = createUseDrawer<AppDrawerRegistryMap>();
