import { QueryClientProvider } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import queryClient from '@/core/config/queryClient';
import DrawerProvider from '@/core/ui/components/drawer/DrawerProvider';
import ToastProvider from '@/core/ui/components/toast/ToastProvider';

import BookmarkFormProvider from '@/domain/bookmark/contexts/BookmarkFormProvider';
import CircleProvider from '@/domain/circle/contexts/CircleProvider';

import CircleFilterProvider from '@/features/map/contexts/CircleFilterProvider';
import HighlightBookmarkedCirclesProvider from '@/features/map/contexts/HighlightBookmarkedCircleProvider';
import MapProvider from '@/features/map/contexts/MapProvider';
import SearchFormProvider from '@/features/search/contexts/SearchFormProvider';
import { appDrawerRegistry } from '@/layout/drawers/useAppDrawer';
import MainLayout from '@/layout/MainLayout';
import { NavigationTabProvider } from '@/layout/navigation/navigation';

import ActiveCircleProvider from '@/features/map/contexts/ActiveCircleProvider';

export const Route = createFileRoute('/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CircleProvider>
          <CircleFilterProvider>
            <HighlightBookmarkedCirclesProvider>
              <MapProvider>
                <NavigationTabProvider>
                  <ActiveCircleProvider>
                    <SearchFormProvider>
                      <BookmarkFormProvider>
                        <DrawerProvider registry={appDrawerRegistry}>
                          <MainLayout />
                        </DrawerProvider>
                      </BookmarkFormProvider>
                    </SearchFormProvider>
                  </ActiveCircleProvider>
                </NavigationTabProvider>
              </MapProvider>
            </HighlightBookmarkedCirclesProvider>
          </CircleFilterProvider>
        </CircleProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
