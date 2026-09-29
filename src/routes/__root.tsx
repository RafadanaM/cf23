/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';

import useRegisterServiceWorker from '@/core/hooks/useRegisterServiceWorker';

import geist from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
import leafletStyles from 'leaflet/dist/leaflet.css?url';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'CF23 Interactive Map'
      },
      {
        name: 'description',
        content:
          'Interactive map for Comifuro 23. Plan, bookmark, and write notes for your CF23 trip.'
      },
      {
        name: 'theme-color',
        content: '#203179'
      }
    ],
    links: [
      { rel: 'stylesheet', href: leafletStyles },
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon-180x180.png'
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: 'any'
      },
      {
        rel: 'preload',
        href: 'floor_map.webp',
        as: 'image',
        type: 'image/webp',
        fetchPriority: 'high'
      },
      {
        rel: 'preload',
        href: geist,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous'
      }
    ]
  }),
  component: RootComponent
});

function RootComponent() {
  useRegisterServiceWorker();
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
