import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { CircleId } from '@/domain/circle/types';

type ActiveCircleProviderContextValue = {
  activeCircleId: CircleId;
};

type ActiveCircleProviderContextActionValue = {
  setActiveCircleId: (circleId: CircleId) => void;
};

const ActiveCircleValueContext = createContext<ActiveCircleProviderContextValue>({
  activeCircleId: ''
});

const ActiveCircleActionContext = createContext<ActiveCircleProviderContextActionValue>({
  setActiveCircleId: (_circleId: CircleId) => {
    // noop
  }
});

function ActiveCircleProvider({ children }: PropsWithChildren<{}>) {
  const [activeCircleId, setActiveCircleId] = useState<CircleId>('');

  const value = useMemo(
    () => ({
      activeCircleId
    }),
    [activeCircleId]
  );

  const actions = useMemo(
    () => ({
      setActiveCircleId
    }),
    []
  );

  return (
    <ActiveCircleActionContext.Provider value={actions}>
      <ActiveCircleValueContext.Provider value={value}>
        {children}
      </ActiveCircleValueContext.Provider>
    </ActiveCircleActionContext.Provider>
  );
}

export default ActiveCircleProvider;

export const useActiveCircleAction = () => {
  const ctx = useContext(ActiveCircleActionContext);

  if (!ctx) {
    throw new Error('useActiveCircleAction must be used within ActiveCircleProvider');
  }

  return ctx;
};

export const useActiveCircle = () => {
  const ctx = useContext(ActiveCircleValueContext);

  if (!ctx) {
    throw new Error('useActiveCircle must be used within ActiveCircleProvider');
  }

  return ctx;
};
