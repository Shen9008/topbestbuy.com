// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://topbestbuy.online',
  output: 'static',
  trailingSlash: 'never',
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
      filter: (page) => !page.includes('/dev/') && !page.endsWith('/404'),
      serialize(item) {
        return {
          ...item,
          lastmod: '2026-11-22',
        };
      },
    }),
  ],
});