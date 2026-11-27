import {
  CheckCircle2,
  CircleAlert,
  Database,
  LogOut,
  LoaderCircle,
  MessageCircleCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import type { SaveStatus } from "../hooks/useRegisterData";
import { cardContainer, cardHeadingClass, cardTransition } from "../globalStyles";

interface SettingsPageProps {
  storageStatus: SaveStatus;
  storageError?: string;
  onLogout: () => void;
  backupFolderCard?: ReactNode;
  backupToolbarCard?: ReactNode;
}

const statusDetails: Record<
  SaveStatus,
  { label: string; Icon: typeof Database }
> = {
  loading: { label: "Loading database", Icon: LoaderCircle },
  saving: { label: "Saving changes", Icon: LoaderCircle },
  saved: { label: "Connected and saved", Icon: CheckCircle2 },
  error: { label: "Database error", Icon: CircleAlert },
};

export default function SettingsPage({
  storageStatus,
  storageError,
  onLogout,
  backupFolderCard,
  backupToolbarCard,
}: SettingsPageProps) {
  const { label, Icon } = statusDetails[storageStatus];
  const statusColor =
    storageStatus === "error"
      ? "text-danger-text"
      : storageStatus === "saved"
        ? "text-success-text"
        : "text-card-text";
  const info: { name: string; emp: string } = {
    name: "Vineet Kumar Singh",
    emp: "Senior Head CRA",
  };

  return (
    <section className="mx-auto w-full max-w-5xl gap-4 flex flex-col gap-4">
      <section
        className={cardTransition}
        aria-labelledby="developer-profile-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-card blur-3xl"
        />
        <div className="relative flex flex-col justify-between gap-5 border-b border-card-border pb-5 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-button text-white shadow-sm">
              <UserRound className="size-7" aria-hidden="true"  />
            </div>
            <div className="min-w-0">
              <small className={`${cardHeadingClass} text-xs italic capitalize! text-card-text!`}>
                Designed, developed &amp; maintaining by
              </small>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-big-number">
                {info.name}
              </h2>
              <div className="mb-3 flex items-center justify-center gap-2 text-sm font-bold tracking-[0.12em]">
                <span className="h-3 w-3 rounded-full bg-red-600"></span>
                <p className="mt-1 text-sm text-focus">
                  {info.emp}
                  <span className="mx-1.5 text-card-text"></span>{" "}
                  <span className="font-mono text-focus">&amp; Emp ID: 12649</span>
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-success-border  p-3 bg-success text-success-text">
                <p className="text-xs font-semibold ml-8">
                  Support and feedback
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                  <MessageCircleCheck
                    className="size-6"
                    aria-hidden="true"
                  />
                  WhatsApp: 9953161116
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-card-border bg-card px-3.5 py-2 shadow-sm">
            <span className="size-4 rounded-full" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-card-text">
                App version
              </p>
              <p className="font-mono text-xs font-bold text-card-text">
                v{__APP_VERSION__}
              </p>
            </div>
          </div>
        </div>
        <footer className="relative mt-4 flex items-start gap-2.5 rounded-xl  p-3 text-xs leading-relaxed text-card-text">
          <ShieldCheck
            className="mt-0.5 size-4 shrink-0 text-card-text"
            aria-hidden="true"
          />
          <p>
            This application is in active development. Your feedback helps us
            improve and expand future features.
          </p>
        </footer>
      </section>

      <section
        className={cardTransition}
        aria-labelledby="database-status-heading"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-card text-card-text">
            <Database className="size-7 text-success-text" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="database-status-heading"
              className={cardHeadingClass}
            >
              Database status
            </h2>
            <p className="mt-1 text-sm text-card-text">
              Your register data is stored locally in this browser using
              IndexedDB.
            </p>
            <p className="mt-1 text-sm text-card-text">
              Manage local storage and your station session.
            </p>
            <p
              className={`mt-4 flex items-center gap-2 text-sm font-semibold ${statusColor}`}
              role={storageStatus === "error" ? "alert" : "status"}
            >
              <Icon
                className={`size-4 ${storageStatus === "loading" || storageStatus === "saving" ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {label}
            </p>
            {storageError && (
              <p className="mt-2 break-words text-sm text-danger-text">
                {storageError}
              </p>
            )}
          </div>
        </div>
      </section>

      {(backupFolderCard || backupToolbarCard) && (
        <section className={cardTransition} aria-labelledby="backup-tools-heading">
          <div className="flex items-center gap-3">
            <div>
              <Database aria-hidden="true" className="stroke-success-text size-10"/>
            </div>
            <div>
              <p className={cardHeadingClass}>
                Data management
              </p>
              <h2
                id="backup-tools-heading"
                className="text-lg font-bold tracking-tight text-focus"
              >
                Backups and register tools
              </h2>
              <p className="mt-0.5 text-sm text-card-text">
                Manage your automatic backup and import or export register data.
              </p>
            </div>
          </div>
          <div className={`${cardContainer} flex gap-4 mt-4 bg-none border-0 border-b-0`}>
            {backupFolderCard}
            {backupToolbarCard}
          </div>
        </section>
      )}

      <section
        className={`${cardTransition}  flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}
      >
        <div>
          <h2 className="font-semibold text-danger-text text-lg">Sign out</h2>
          <p className="mt-1 text-sm text-danger-text/60 dark:text-danger">
            Return to the station selection screen.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex min-h-10 items-center gap-2 text-danger-text rounded-lg border border-card-border bg-danger px-4 py-2 text-sm font-semibold  transition hover:bg-danger/30"
        >
          <LogOut
            className="size-6 font-bold"
            aria-hidden="true"
          />
          Sign out
        </button>
      </section>
    </section>
  );
}
