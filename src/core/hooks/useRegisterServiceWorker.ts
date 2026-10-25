import { Serwist } from '@serwist/window';
import { useEffect } from 'react';

function useRegisterServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const serwist = new Serwist('/sw.js', { scope: '/', type: 'module' });

    const onControlling = () => {
      caches.delete('cf-23-precache');
      caches.delete('cf-22-precache');
      caches.delete('html-cache');
      caches.delete('cf-23-precache-v2');
    };

    serwist.register().catch((e) => {
      console.error('[SERWIST] Failed to register service worker: ', e);
    });

    serwist.addEventListener('controlling', onControlling);

    const interval = setInterval(
      () => {
        serwist.update().catch(() => {});
      },
      30 * 60 * 1000
    );

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        serwist.update().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      serwist.removeEventListener('controlling', onControlling);
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(interval);
    };
  }, []);
}

export default useRegisterServiceWorker;
