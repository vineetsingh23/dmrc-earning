import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  base: mode === 'file' ? './' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      filename: 'dmrc-sw.js',
      injectRegister: false,
      registerType: 'prompt',
      manifest: {
        name: 'DMRC Station Earnings',
        short_name: 'DMRC Earnings',
        description: 'Station earnings and cash register',
        theme_color: '#2563eb',
        background_color: '#e8ebef',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        cacheId: 'dmrc-earning',
        navigateFallbackDenylist: [/^\/(?:dmrc-sw\.js|workbox-.*\.js)$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn-uicons\.flaticon\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'flaticon-uicons',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    ...(mode === 'file' ? [viteSingleFile()] : []),
  ],
}));