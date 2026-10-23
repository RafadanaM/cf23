import { ClientOnly } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Attribution from '@/features/map/components/Attribution';
import ExpoMap from '@/features/map/components/ExpoMap';
import MapConfigs from '@/features/map/components/MapConfigs/MapConfigs';
import MapLoader from '@/features/map/components/MapLoader';
import { useNavigationTab } from '@/layout/navigation/navigation';
import NavigationTab from '@/layout/navigation/NavigationTab';
import BookmarkSection from '@/layout/sections/BookmarkSection';
import SearchFormSection from '@/layout/sections/SearchFormSection';
import SyncSection from '@/layout/sections/SyncSection';

function MainLayout() {
  const { tab } = useNavigationTab();

  return (
    <div className="flex flex-col relative h-screen w-full">
      <main className="relative flex flex-col flex-1">
        <ErrorBoundary fallback={<p>{'failed to load map component'}</p>}>
          <ClientOnly fallback={<MapLoader />}>
            <Suspense>
              <ExpoMap />
            </Suspense>
          </ClientOnly>
        </ErrorBoundary>
      </main>
      <MapConfigs />

      <Attribution />
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
