import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching } from 'serwist';
import {
  CacheableResponsePlugin,
  ExpirationPlugin,
  NetworkFirst,
  Serwist
} from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  // pre-cache
  // oxlint-disable-next-line no-underscore-dangle
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    concurrency: 10,
    cleanURLs: true,
    cacheName: 'cf-23-precache'
  },

  // lifetime
  skipWaiting: true,
  clientsClaim: true,

  disableDevLogs: process.env.NODE_ENV === 'production',
  // cache
  cacheId: 'cf23-cache',

  // runtime cache
  runtimeCaching: (() => {
    const cachingArr: RuntimeCaching[] = [
      {
        matcher: ({ url }) => url.pathname.includes('/api/v1/circles'),
        handler: new NetworkFirst({
          cacheName: 'circles-response',
          networkTimeoutSeconds: 3,
          plugins: [
            new CacheableResponsePlugin({
              statuses: [200]
            }),
            new ExpirationPlugin({
              maxEntries: 30,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days,
              purgeOnQuotaError: true
            })
          ]
        })
      }
    ];

    // cache index.html on runtime because tanstack start generates prerendered html later and I can't find a way to start the sw plugin after prerender
    if (process.env.NODE_ENV === 'production') {
      cachingArr.push({
        matcher: ({ request }) => request.mode === 'navigate',
        handler: new NetworkFirst({
          cacheName: 'html-cache',
          networkTimeoutSeconds: 3,
          plugins: [
            {
              cacheWillUpdate: async ({ response }) => {
                if (response && response.status === 200) {
                  return response;
                }
                return null;
              }
            }
          ]
        })
      });
    }
    return cachingArr;
  })()
});

serwist.addEventListeners();
