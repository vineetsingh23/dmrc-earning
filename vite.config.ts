// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// import { viteSingleFile } from 'vite-plugin-singlefile'

// // https://vite.dev/config/
// export default defineConfig(({ mode }) => ({
//   base: './', // <-- Added this to make asset paths relative for local/offline running
//   plugins: [
//     react(),
//     tailwindcss(),
//     ...(mode === 'file' ? [viteSingleFile()] : []),
//   ],
// }))

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => ({
  base: './', // Ensures paths stay relative for local running
  plugins: [
    react(),
    tailwindcss(),
      ...(mode === 'file' ? [viteSingleFile()] : []),
    ...(mode === 'file' ? [] : [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'My Local Offline App',
        short_name: 'LocalApp',
        description: 'An offline-first app backed by local IndexedDB',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Opens like a native app window with no browser tabs
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })]),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
  },
}))