import { buildServiceWorker } from './core/plugins/tanstackSerwistPlugin';

await buildServiceWorker(process.cwd(), true);
