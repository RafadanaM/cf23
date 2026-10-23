/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';

import useRegisterServiceWorker from '@/core/hooks/useRegisterServiceWorker';

import geist from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
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
          'Interactive CF23 Map and circle list for Comifuro 23. Explore CF23 floor plan, search circles, filter based on fandoms, bookmark your favourite circles, list down notes, and sync all across devices to plan your CF23 Trip'
      },
      {
        name: 'theme-color',
        content: '#203179'
      },
      {
        property: 'og:title',
        content: 'CF23 Interactive Map'
      },
      {
        property: 'og:description',
        content:
          'Interactive CF23 Map and circle list for Comifuro 23. Explore CF23 floor plan, search circles, filter based on fandoms, bookmark your favourite circles, list down notes, and sync all across devices to plan your CF23 Trip'
      },
      {
        property: 'og:image',
        content: 'https://cf23.rafadana.com/logo.png'
      },
      {
        property: 'og:url',
        content: 'https://cf23.rafadana.com/'
      },
      {
        property: 'og:type',
        content: 'website'
      }
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'canonical', href: 'https://cf23.rafadana.com' },
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
