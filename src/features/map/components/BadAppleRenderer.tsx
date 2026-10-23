import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useBadApple } from '../contexts/BadAppleProvider';
import BadApple from './BadApple';

function BadAppleRenderer() {
  const { show } = useBadApple();

  if (!show) return null;

  return (
    <ErrorBoundary fallback={null}>
      <Suspense>
        <BadApple />
      </Suspense>
    </ErrorBoundary>
  );
}

export default BadAppleRenderer;
