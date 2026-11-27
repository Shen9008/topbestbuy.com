// @ts-check
import { URL } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
const SITEMAP_EXCLUDE = new Set([
  '/contact',
  '/corrections',
  '/privacy',
  '/terms',
  '/saved',
]);

export default defineConfig({
  site: 'https://topbestbuy.online',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Flat .html files so Cloudflare Pages does not 308 to a trailing slash.
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    preact(),
    sitemap({
      namespaces: {
        news: false,
        xhtml: false,
        image: false,
        video: false,
      },
      filter: (page) => {
        const path = new URL(page).pathname;
        return (
          !path.startsWith('/dev/') &&
          !path.endsWith('/404') &&
          !SITEMAP_EXCLUDE.has(path)
        );
      },
      serialize(item) {
        return {
          ...item,
          lastmod: '2026-11-22',
        };
      },
    }),
  ],
});