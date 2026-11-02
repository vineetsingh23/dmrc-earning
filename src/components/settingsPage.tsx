import { CheckCircle2, CircleAlert, Database, LogOut, LoaderCircle, MessageCircleCheckIcon} from 'lucide-react';
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
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-100 to-indigo-50/40 p-6 shadow-xl transition-all hover:shadow-2xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30" aria-labelledby="developer-profile-heading">
          
       
  {/* Top Accent Decoration / Glow */}
  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-slate-200/80 pb-5 dark:border-slate-800">
    
    {/* Left Side: Icon & Developer Info */}
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
    
        <svg className="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <div>
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-1">
          Lead Developer & Maintainer
        </span>
        <h2 id="developer-profile-heading" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Vineet Kumar Singh
        </h2>
        <div className="mt-1 flex flex-wrap flex-col items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div>
          <span>Sr. Head CRA</span>
          <span className="h-1 w-1 rounded-full bg-slate-400"></span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400">Emp ID: 12649</span>
          </div>
          <div>
            <h1 className=' text-md font-semibold font-mono text-blue-700 mt-2'>Contact for any support and feedback.</h1>
            <div className='flex gap-4 items-center'>

          <span className='text-left'><MessageCircleCheckIcon size={20} fill='green' stroke='white'/></span><span className='text-md text-violet-800 font-mono'>WhatsApp: 9953161116</span>
            </div>

          </div>
          
        </div>
      </div>
    </div>

    {/* Right Side: Version Badge */}
    <div className="self-start sm:self-center flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
      </span>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">App Version</p>
        <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">v{__APP_VERSION__}</p>
      </div>
    </div>

  </div>

  {/* Footer: Development Stage & Feedback Notice */}
  <footer className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
      <svg className="h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-xs italic leading-relaxed text-slate-600 dark:text-slate-400">
        This application is currently under its <strong className="font-semibold text-slate-700 dark:text-slate-200">active development stage</strong>. Your feedback is crucial for fixing issues and expanding future features.
      </p>
    </div>
  </footer>

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
