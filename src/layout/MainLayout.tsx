import { ClientOnly } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Spinner } from '@/core/ui/components/spinner';

import MapConfigs from '@/features/map/components/MapConfigs/MapConfigs';
import { useNavigationTab } from '@/layout/navigation/navigation';
import NavigationTab from '@/layout/navigation/NavigationTab';
import BookmarkSection from '@/layout/sections/BookmarkSection';
import SearchFormSection from '@/layout/sections/SearchFormSection';
import SyncSection from '@/layout/sections/SyncSection';

const ExpoMap = lazy(() => import('@/features/map/components/ExpoMap'));

function MainLayout() {
  const { tab } = useNavigationTab();

  return (
    <div className="flex flex-col relative h-screen w-full">
      <main className="flex flex-col flex-1">
        <ErrorBoundary fallback={<p>{'failed to load map component'}</p>}>
          <ClientOnly fallback={<MapLoader />}>
            <Suspense>
              <ExpoMap />
            </Suspense>
          </ClientOnly>
        </ErrorBoundary>
      </main>
      <MapConfigs />

      {/* lazy the content inside instead of the section itself so it immediately appears when opened */}
      <SearchFormSection />
      {tab === 'BOOKMARKS' && <BookmarkSection />}
      {tab === 'SYNC' && <SyncSection />}
      <Suspense>
        <NavigationTab />
      </Suspense>
    </div>
  );
}

export default MainLayout;

function MapLoader() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
