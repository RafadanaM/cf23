import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import { tanstackSerwistPlugin } from './src/core/plugins/tanstackSerwistPlugin.ts';

const isProd = process.env.NODE_ENV === 'production';

const config = defineConfig(() => ({
  resolve: {
    tsconfigPaths: true
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true, secure: false }
    }
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        failOnError: true
      },
      sitemap: {
        enabled: true,
        host: 'https://cf23.rafadana.com'
      }
    }),
    isProd ? nitro({ preset: 'bun' }) : undefined,

    viteReact(),
    tanstackSerwistPlugin()
  ]
}));

export default config;
