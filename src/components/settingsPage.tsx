import { CheckCircle2, CircleAlert, Database, LogOut, LoaderCircle, ContactIcon } from 'lucide-react';
import type { SaveStatus } from '../hooks/useRegisterData';

interface SettingsPageProps {
  storageStatus: SaveStatus;
  storageError?: string;
  onLogout: () => void;
}

const statusDetails: Record<SaveStatus, { label: string; Icon: typeof Database }> = {
  loading: { label: 'Loading database', Icon: LoaderCircle },
  saving: { label: 'Saving changes', Icon: LoaderCircle },
  saved: { label: 'Connected and saved', Icon: CheckCircle2 },
  error: { label: 'Database error', Icon: CircleAlert },
};

export default function SettingsPage({
  storageStatus,
  storageError,
  onLogout,
}: SettingsPageProps) {
  const { label, Icon } = statusDetails[storageStatus];
  const statusColor = storageStatus === 'error' ? 'text-bad' : storageStatus === 'saved' ? 'text-ok' : 'text-ac';

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tx">Settings</h1>
      <section className="rounded-2xl border border-bd bg-card p-5 shadow-sm" aria-labelledby="database-status-heading">
        
        <div className="flex items-start gap-3">
          <ContactIcon stroke='violet'/>
          <h1 id="database-status-heading" className="font-semibold text-tx flex gap-4">Created by</h1>
          <div className='text-mu text-sm '>
          <p>Vineet Kumar Singh</p>
          <p>Sr. Head CRA</p>
          <p>Emp. ID - 12649</p>

          </div>
        </div>
      </section>
      </div>

      <section className="rounded-2xl border border-bd bg-card p-5 shadow-sm" aria-labelledby="database-status-heading">

        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-ca p-2 text-ac">
            <Database className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="database-status-heading" className="font-semibold text-tx">Database status</h2>
            <p className="mt-1 text-sm text-mu">Your register data is stored locally in this browser using IndexedDB.</p>
        <p className="mt-1 text-sm text-mu">Manage local storage and your station session.</p>
            <p className={`mt-4 flex items-center gap-2 text-sm font-medium ${statusColor}`} role={storageStatus === 'error' ? 'alert' : 'status'}>
              <Icon className={`size-4 ${storageStatus === 'loading' || storageStatus === 'saving' ? 'animate-spin' : ''}`} aria-hidden="true" />
              {label}
            </p>
            {storageError && <p className="mt-2 break-words text-sm text-bad">{storageError}</p>}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-bd bg-card p-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-tx">Sign out</h2>
          <p className="mt-1 text-sm text-mu">Return to the station selection screen.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-bad px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </section>
    </section>
  );
}
