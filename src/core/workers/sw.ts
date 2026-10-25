import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching } from 'serwist';
import {
  CacheableResponsePlugin,
  ExpirationPlugin,
  Serwist,
  StaleWhileRevalidate
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
    cacheName: 'cf23-precache-v3'
  },

  fallbacks: {
    entries: [
      {
        url: '/',
        matcher: ({ request }) => request.mode === 'navigate'
      }
    ]
  },

  // lifetime
  skipWaiting: true,
  clientsClaim: true,

  disableDevLogs: process.env.NODE_ENV === 'production',
  // cache
  cacheId: 'cf23-cache-v3',

  // runtime cache
  runtimeCaching: (() => {
    const cachingArr: RuntimeCaching[] = [
      {
        matcher: ({ url }) => url.pathname.includes('/api/v1/circles'),
        handler: new StaleWhileRevalidate({
          cacheName: 'circles-response-cache-v2',
          plugins: [
            new CacheableResponsePlugin({
              statuses: [200]
            }),
            new ExpirationPlugin({
              maxEntries: 30,
              purgeOnQuotaError: true
            })
          ]
        })
      }
    ];

    return cachingArr;
  })()
});

serwist.addEventListeners();
