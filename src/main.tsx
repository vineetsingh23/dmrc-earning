import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import ErrorBoundary from './components/errorBoundary';
import './index.css'
import App from './App.tsx'

async function removeLegacyPwa() {
  if (!('serviceWorker' in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  const legacyRegistrations = registrations.filter((registration) =>
    [registration.active, registration.waiting, registration.installing]
      .filter((worker) => worker !== null)
      .some((worker) => {
        const scriptUrl = new URL(worker.scriptURL);
        return scriptUrl.origin === window.location.origin && /\/(?:dev-)?sw\.js$/.test(scriptUrl.pathname);
      }),
  );
  const wasControlledByLegacyWorker = legacyRegistrations.length > 0 && navigator.serviceWorker.controller !== null;
  const unregistered = await Promise.all(legacyRegistrations.map((registration) => registration.unregister()));

  const cachePrefix = `workbox-precache-v2-${window.location.origin}`;
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((cacheName) => cacheName.startsWith(cachePrefix))
      .map((cacheName) => caches.delete(cacheName)),
  );

  if (wasControlledByLegacyWorker && unregistered.some(Boolean)) window.location.reload();
}

void removeLegacyPwa().catch((error: unknown) => {
  console.error('Could not remove the previous PWA service worker and cache.', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.MODE === 'file' ? (
      <HashRouter>
        <App />
      </HashRouter>
    ) : (
   <React.StrictMode>
  <BrowserRouter>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </BrowserRouter>
</React.StrictMode>
    )}
  </StrictMode>,
)
