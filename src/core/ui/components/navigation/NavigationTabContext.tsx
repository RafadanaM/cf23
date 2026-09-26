import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

type NavigationTabContextValue<T extends readonly string[]> = {
  tab: T[number];
  setTab: (newTab: T[number]) => void;
};

function createNavigationTab<T extends readonly string[]>(tabs: T) {
  type TabType = T[number];

  const TabContext = createContext<NavigationTabContextValue<T>>({
    setTab: () => {},
    tab: ''
  });

  const NavigationTabProvider = ({
    initialTab,
    children
  }: PropsWithChildren<{ initialTab?: TabType }>) => {
    const [tab, setTab] = useState<TabType>(() => initialTab ?? (tabs[0] as TabType));

    const memoedValue = useMemo(
      () => ({
        tab,
        setTab
      }),
      [tab]
    );

    return <TabContext.Provider value={memoedValue}>{children}</TabContext.Provider>;
  };

  const useNavigationTab = () => {
    const context = useContext(TabContext);
    if (!context) throw new Error('useTab must be used within a TabProvider');
    return context;
  };

  return {
    NavigationTabProvider,
    useNavigationTab
  };
}

export default createNavigationTab;
