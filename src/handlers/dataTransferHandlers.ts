import type { RegisterState } from '../lib/registerTypes';

// saves text as a file on the user's computer
function downloadTextFile(fileName: string, fileContent: string, mimeType: string) {
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(new Blob([fileContent], { type: mimeType }));
  downloadLink.download = fileName;
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
}

// whole backup of one station as one JSON file
export const exportBackupAsJson = (stationName: string, registerState: RegisterState) =>
  downloadTextFile(
    `${stationName}-backup.json`,
    JSON.stringify({ station: stationName, exportedAt: new Date().toISOString(), data: registerState }, null, 2),
    'application/json',
  );

// reads a backup file; the caller decides what to do with the data
export function importBackupFromJson(backupFile: File, onBackupLoaded: (backupData: Partial<RegisterState>) => void) {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    try {
      const parsedFile = JSON.parse(String(fileReader.result));
      if (!parsedFile || typeof parsedFile.data !== 'object') throw new Error('no data');
      onBackupLoaded(parsedFile.data);
    } catch {
      alert('This is not a valid backup file.');
    }
  };
  fileReader.readAsText(backupFile);
}

// rows of one sheet as a CSV file that opens in Excel
export function exportRowsAsCsv(fileName: string, rows: Record<string, unknown>[]) {
  if (!rows.length) { alert('Nothing to export for this date.'); return; }
  const columnNames = [...new Set(rows.flatMap(Object.keys))];
  const quoteCsvValue = (value: unknown) => '"' + String(value ?? '').replace(/"/g, '""') + '"';
  const csvLines = [
    columnNames.map(quoteCsvValue).join(','),
    ...rows.map(row => columnNames.map(columnName => quoteCsvValue(row[columnName])).join(',')),
  ];
  downloadTextFile(fileName, csvLines.join('\n'), 'text/csv');
}