import { Serwist, SerwistLifecycleEvent } from '@serwist/window';
import { useEffect } from 'react';

function useRegisterServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const serwist = new Serwist('/sw.js', { scope: '/', type: 'module' });

    const onControlling = (event: SerwistLifecycleEvent) => {
      if (event.isUpdate) {
        window.location.reload();
      }
    };

    serwist.addEventListener('controlling', onControlling);

    serwist.register().catch((e) => {
      console.error('[SERWIST] Failed to register service worker: ', e);
    });

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        serwist.update().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      serwist.removeEventListener('controlling', onControlling);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
}

export default useRegisterServiceWorker;
