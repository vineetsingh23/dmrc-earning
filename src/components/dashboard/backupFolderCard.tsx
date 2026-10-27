import type { BackupStatus } from '../../hooks/useWeeklyBackup';

interface BackupFolderCardProps {
  backupStatus: BackupStatus; folderName: string; lastBackupTime: string; backupMessage: string;
  onChooseFolder: () => void; onBackUpNow: () => void;
}

const statusTexts: Record<BackupStatus, string> = {
  unsupported: 'This browser cannot write to a folder. Use Chrome or Edge, or the Export backup button.',
  noFolder: 'No backup folder chosen yet. Weekly backups need one.',
  upToDate: 'Weekly backup is on.',
  needsPermission: 'A backup is due. Click "Back up now" to allow the folder again.',
  working: 'Writing the backup…',
  error: 'The backup failed.',
};
const buttonClass = 'rounded-xl border border-bd bg-card px-3.5 py-1.5 font-medium transition hover:-translate-y-0.5 hover:border-ac hover:text-ac disabled:opacity-50';

export default function BackupFolderCard({ backupStatus, folderName, lastBackupTime, backupMessage, onChooseFolder, onBackUpNow }: BackupFolderCardProps) {
  return (
    <section className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
      <h3 className="mb-1 font-medium text-slate-700 dark:text-slate-200">Automatic weekly backup (JSON)</h3>
      <p className={`text-sm ${backupStatus === 'error' || backupStatus === 'needsPermission' ? 'text-bad' : 'text-mu'}`}>{statusTexts[backupStatus]}</p>
      {folderName && <p className="text-sm">Folder: <b>{folderName}</b></p>}
      {lastBackupTime && <p className="text-sm">Last backup: <b>{new Date(lastBackupTime).toLocaleString()}</b></p>}
      {backupMessage && <p className="text-xs text-mu">{backupMessage}</p>}
      {backupStatus !== 'unsupported' && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button className={buttonClass} onClick={onChooseFolder}>{folderName ? 'Change folder' : 'Choose backup folder'}</button>
          {folderName && <button className={buttonClass} disabled={backupStatus === 'working'} onClick={onBackUpNow}>Back up now</button>}
        </div>
      )}
    </section>
  );
}