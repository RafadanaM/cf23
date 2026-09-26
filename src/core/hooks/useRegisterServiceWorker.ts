import { Serwist } from '@serwist/window';
import { useEffect } from 'react';

function useRegisterServiceWorker() {
  useEffect(() => {
    async function registerSW() {
      if ('serviceWorker' in navigator) {
        const serwist = new Serwist('/sw.js', { scope: '/', type: 'module' });

        try {
          await serwist.register();
        } catch (e) {
          console.error('[SERWIST] Failed to register service worker: ', e);
        }
      }
    }

    registerSW();
  }, []);
}

export default useRegisterServiceWorker;
