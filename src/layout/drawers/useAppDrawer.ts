import { lazy } from 'react';

import { createUseDrawer } from '@/core/ui/components/drawer/DrawerProvider';
import { createDrawerRegistry } from '@/core/ui/components/drawer/DrawerRegistry';

const CircleDetailDrawer = lazy(() => import('./CircleDetailDrawer'));
const EditBookmarkNoteDrawer = lazy(() => import('./EditBookmarkNoteDrawer'));
const SeeBookmarkNoteDrawer = lazy(() => import('./SeeBookmarkNoteDrawer'));
const SampleWorksDrawer = lazy(() => import('./SampleWorksDrawer'));

export const APP_DRAWER_ID = {
  CIRCLE_DETAIL: 'CIRCLE_DETAIL',
  EDIT_BOOKMARK_NOTE: 'EDIT_BOOKMARK_NOTE',
  SEE_BOOKMARK_NOTE: 'SEE_BOOKMARK_NOTE',
  SAMPLE_WORKS: 'SAMPLE_WORKS'
} as const;

const appDrawerRegistryMap = {
  [APP_DRAWER_ID.CIRCLE_DETAIL]: CircleDetailDrawer,
  [APP_DRAWER_ID.EDIT_BOOKMARK_NOTE]: EditBookmarkNoteDrawer,
  [APP_DRAWER_ID.SEE_BOOKMARK_NOTE]: SeeBookmarkNoteDrawer,
  [APP_DRAWER_ID.SAMPLE_WORKS]: SampleWorksDrawer
} as const;

type AppDrawerRegistryMap = typeof appDrawerRegistryMap;

export const appDrawerRegistry = createDrawerRegistry<AppDrawerRegistryMap>();

Object.entries(appDrawerRegistryMap).forEach(([key, value]) => {
  appDrawerRegistry.registerDrawer(
    key as keyof AppDrawerRegistryMap,
    value,
    key === APP_DRAWER_ID.SAMPLE_WORKS ? null : undefined
  );
});

export const useAppDrawer = createUseDrawer<AppDrawerRegistryMap>();
