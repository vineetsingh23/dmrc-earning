import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  base: mode === 'file' ? './' : '/',
  plugins: [
    react(),
    tailwindcss(),
    ...VitePWA({
      disable: mode === 'file',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Station Earning Register',
        short_name: 'Earning Register',
        description: 'Station earning register',
        start_url: '/',
        scope: '/',
        display: 'standalone',            // opens in its own window, with no browser bar
        background_color: '#e8ebef',
        theme_color: '#2563eb',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
       
        ],
        screenshots: [
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop View'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            label: 'Mobile View'
          }
        ],
      },
      devOptions: { enabled: true },       // lets you test the install while running npm run dev
    }),
    ...(mode === 'file' ? [viteSingleFile()] : []),
  ],
}));