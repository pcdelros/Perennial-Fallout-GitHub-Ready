import { defineConfig } from 'astro/config';
// Static output is deployable directly to Cloudflare Pages (dist/).
// Add an adapter only if server-rendered features are introduced later.
export default defineConfig({ output: 'static', server: { host: '127.0.0.1', port: 4321 } });
