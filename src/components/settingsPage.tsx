import { CheckCircle2, CircleAlert, Database, LogOut, LoaderCircle, MessageCircleCheck, ShieldCheck, UserRound } from 'lucide-react';
import type { SaveStatus } from '../hooks/useRegisterData';
import { cardTransition} from '../globalStyles';

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
  const statusColor = storageStatus === 'error' ? 'text-red-500' : storageStatus === 'saved' ? 'text-green-400' : 'text-ac';
  const info:{name:string; emp:string;} = {name:'Vineet Kumar Singh',emp:'Senior Head CRA'};
  

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      
      <section className={cardTransition} aria-labelledby="developer-profile-heading">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-ac/5 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 border-b border-bd pb-5 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ac2 text-white shadow-sm">
              <UserRound className="size-7" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex rounded-full  py-1 text-xs font-bold text-tx">Developed, Designed and &amp; maintaining by</span>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-tx">{info.name}</h2>
              <div className='mb-3 flex items-center gap-2 text-sm font-bold tracking-[0.12em]'>

              <span className="h-3 w-3 rounded-full bg-red-600"></span>
              <p className="mt-1 text-sm text-tx">{info.emp}<span className="mx-1.5 text-tx"></span> <span className="font-mono text-tx">Emp ID: 12649</span></p>
              </div>
              <div className="mt-4 rounded-xl border border-bd bg-inp p-3">
                <p className="text-xs font-semibold text-mu">Support and feedback</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-tx">
                  <MessageCircleCheck className="size-6 text-green-600" aria-hidden="true" />
                  WhatsApp: 9953161116
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-bd bg-card px-3.5 py-2 shadow-sm">
            <span className="size-4 rounded-full" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-mu">App version</p>
              <p className="font-mono text-xs font-bold text-tx">v{__APP_VERSION__}</p>
            </div>
          </div>
        </div>
        <footer className="relative mt-4 flex items-start gap-2.5 rounded-xl bg-ca/70 p-3 text-xs leading-relaxed text-mu">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-tx" aria-hidden="true" />
          <p>This application is in active development. Your feedback helps us improve and expand future features.</p>
        </footer>
      </section>

      <section className={cardTransition} aria-labelledby="database-status-heading">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-ca  text-ac2">
            <Database className="size-7 text-green-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="database-status-heading" className="font-bold tracking-wide text-ac">Database status</h2>
            <p className="mt-1 text-sm text-mu">Your register data is stored locally in this browser using IndexedDB.</p>
            <p className="mt-1 text-sm text-mu">Manage local storage and your station session.</p>
            <p className={`mt-4 flex items-center gap-2 text-sm font-semibold ${statusColor}`} role={storageStatus === 'error' ? 'alert' : 'status'}>
              <Icon className={`size-4 ${storageStatus === 'loading' || storageStatus === 'saving' ? 'animate-spin' : ''}`} aria-hidden="true" />
              {label}
            </p>
            {storageError && <p className="mt-2 break-words text-sm text-bad">{storageError}</p>}
          </div>
        </div>
      </section>

      <section className={`${cardTransition}  flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}>
        <div>
          <h2 className="font-semibold text-red-500 text-lg">Sign out</h2>
          <p className="mt-1 text-sm text-mu">Return to the station selection screen.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-bd bg-card px-4 py-2 text-sm font-semibold text-bad transition hover:bg-ac2"
        >
          <LogOut className="size-6 text-red-600 font-bold" aria-hidden="true" />
          Sign out
        </button>
      </section>
    </section>
  );
}
