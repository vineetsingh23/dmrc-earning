# React + TypeScript + Vite

## Run the build without a server

Run `npm run build:file`, then open `dist/index.html` directly in a browser. This creates a self-contained HTML file and uses hash-based routing for local file access. Keep using `npm run build` for the normal web-hosted build.

Register data is stored in IndexedDB in the current browser. It is not shared across devices or browsers. The first launch imports previously saved data from this browser's local storage. Data that exists only in the old Supabase database is not migrated by this change and remains in Supabase.

## Offline app

The web build is installable as a PWA and caches the application shell for offline use after its first successful online load. Register data continues to be stored locally in IndexedDB. A secure HTTPS origin is required for installation and service-worker features (localhost is supported during development). Updates are offered in the app so you can choose when to reload.

The Flaticon icon font is cached after it has loaded online once. A browser's file-based HTML mode cannot register a service worker, so offline PWA support is available from the web build.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Navigation and appearance

The app uses a collapsible sidebar for Dashboard, register tables, Earning, and the WhatsApp report. The header keeps the selected station, date selector, and light/dark mode control visible. The selected theme is saved in the browser.

Sidebar and report icons use Flaticon UIcons from its CDN; the sidebar includes a Flaticon attribution link. The icon font requires an internet connection.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
