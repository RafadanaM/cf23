// src/client.tsx
import { StartClient } from '@tanstack/react-start/client';
import { StrictMode, useLayoutEffect, useRef } from 'react';
import { hydrateRoot } from 'react-dom/client';

// taken from nextjs source code, idk if this is accurate on tanstack though but the logic make sense.
const performanceMarks = {
  beforeRender: 'beforeRender',
  afterHydrate: 'afterHydrate'
} as const;

const performanceMeasures = {
  hydration: 'hydration'
} as const;

function clearMarks() {
  performance.clearMarks(performanceMarks.beforeRender);
  performance.clearMarks(performanceMarks.afterHydrate);
}

function App() {
  const isHydrated = useRef(false);

  useLayoutEffect(() => {
    if (isHydrated.current) return;
    isHydrated.current = true;

    performance.mark(performanceMarks.afterHydrate);
    performance.measure(
      performanceMeasures.hydration,
      performanceMarks.beforeRender,
      performanceMarks.afterHydrate
    );
    clearMarks();
  }, []);

  return <StartClient />;
}

performance.mark(performanceMarks.beforeRender);
hydrateRoot(
  document,
  import.meta.env.DEV ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
);
