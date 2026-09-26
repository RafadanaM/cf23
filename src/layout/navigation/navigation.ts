import createNavigationTab from '@/core/ui/components/navigation/NavigationTabContext';

const NAVIGATION_TABS = ['MAP', 'BOOKMARKS', 'SYNC'] as const;

const { NavigationTabProvider, useNavigationTab } = createNavigationTab(NAVIGATION_TABS);

export { NAVIGATION_TABS, NavigationTabProvider, useNavigationTab };
