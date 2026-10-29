import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PwaUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const { updateServiceWorker } = useRegisterSW({
    immediate: true,
    onNeedRefresh: () => setNeedRefresh(true),
    onOfflineReady: () => setOfflineReady(true),
    onRegisterError: error => console.error('Could not register the offline service worker.', error),
  });

  useEffect(() => {
    if (!offlineReady || needRefresh) return;
    const timeoutId = window.setTimeout(() => setOfflineReady(false), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [needRefresh, offlineReady]);

  if (!needRefresh && !offlineReady) return null;

  const applyUpdate = async () => {
    setUpdateError('');
    try {
      await updateServiceWorker(true);
    } catch (error) {
      console.error('Could not apply the service worker update.', error);
      setUpdateError('The update could not be applied. Please try again.');
    }
  };

  const dismiss = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
    setUpdateError('');
  };

  return (
    <section className="pwa-notice" aria-live="polite" aria-label="App update status">
      <div className="flex items-start gap-3">
        <span className="pwa-notice-icon" aria-hidden="true">
          <i className={`fi ${needRefresh ? 'fi-rr-refresh' : 'fi-rr-cloud-check'}`} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-tx">
            {needRefresh ? 'Update available' : 'Ready to use offline'}
          </h2>
          <p className="mt-1 text-sm text-mu">
            {needRefresh
              ? 'A newer version is ready. Reload to update the app.'
              : 'This app is saved on this device for offline use.'}
          </p>
          {updateError && <p className="mt-2 text-sm text-bad" role="alert">{updateError}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {needRefresh && (
              <button type="button" className="pwa-notice-primary" onClick={() => void applyUpdate()}>
                Reload and update
              </button>
            )}
            <button type="button" className="pwa-notice-secondary" onClick={dismiss}>
              {needRefresh ? 'Later' : 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
