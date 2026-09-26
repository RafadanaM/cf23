import type { Plugin } from 'vite';
import { injectManifest } from '@serwist/build';
import path from 'node:path';
import { build } from 'vite';

// src: https://github.com/TanStack/router/discussions/4770
export function tanstackSerwistPlugin(): Plugin {
  let rootDir: string;
  let isProduction: boolean;
  let isSSR: boolean;

  return {
    name: 'tanstack-serwist',
    enforce: 'post',
    configResolved: (config) => {
      rootDir = config.root;
      isProduction = config.isProduction;
      isSSR = !!config.build.ssr;
    },
    buildStart: async () => {
      // Build service worker in dev mode
      if (!isProduction) {
        await buildServiceWorker(rootDir, isProduction);
      }
    },
    closeBundle: async () => {
      // Build service worker in production mode
      if (isProduction && !isSSR) {
        await buildServiceWorker(rootDir, true);
      }
    }
  };
}

async function buildServiceWorker(rootDir: string, isProduction: boolean) {
  const outName = 'sw.js';

  const outDir = isProduction
    ? path.resolve(rootDir, '.output', 'public')
    : path.resolve(rootDir, 'public');

  const swSrc = path.resolve(rootDir, 'src', 'core', 'workers', 'sw.ts');
  const swDest = path.resolve(outDir, outName);

  console.log(`[SERWIST] Building service worker at: ${swSrc}. Destination: ${swDest}`);
  try {
    await build({
      root: rootDir,
      configFile: false,
      publicDir: false,
      define: {
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        )
      },
      build: {
        lib: {
          entry: swSrc,
          formats: ['es'],
          fileName: () => outName
        },
        outDir,
        emptyOutDir: false,
        copyPublicDir: false,
        minify: isProduction,

        rolldownOptions: {
          output: {
            entryFileNames: outName
          }
        }
      }
    });

    if (isProduction) {
      console.log(`[SERWIST] Injecting Manifest...`);
      const result = await injectManifest({
        swSrc: swDest,
        swDest,
        globDirectory: outDir,
        globPatterns: ['**/*.{js,css,html,png,svg,webp,json,ico,webmanifest,woff,woff2}'],
        injectionPoint: 'self.__SW_MANIFEST'
      });

      const cacheSize = (result.size / 1024 / 1024).toFixed(2);
      console.log(`[SERWIST] Precached ${result.count} files (${cacheSize}) MB`);
    }
  } catch (err) {
    console.error('[BUILD][SERWIST] Failed to build service worker: ', err);
    throw err;
  }
}
