import { createClient } from '@supabase/supabase-js';
import type { RegisterState } from './registerTypes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// null when the keys are missing: the app then works with browser storage only
export const supabaseClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const stationName = 'Lesson Station';
type ShiftEntries = RegisterState['shiftEntries'];

// remembers what the database already holds, so only changed rows are sent
const lastSentRows = new Map<string, string>();

export async function pullShiftEntries(): Promise<ShiftEntries> {
  const { data, error } = await supabaseClient!.from('shift_entries').select('*').eq('station', stationName);
  if (error) throw error;
  const shiftEntries: ShiftEntries = {};
  lastSentRows.clear();
  data.forEach(databaseRow => {
    (shiftEntries[databaseRow.entry_date] ??= {})[databaseRow.row_no] = databaseRow.data;
    lastSentRows.set(`${databaseRow.entry_date}|${databaseRow.row_no}`, JSON.stringify(databaseRow.data));
  });
  return shiftEntries;
}

export async function pushShiftEntries(shiftEntries: ShiftEntries) {
  const changedRows: { rowKey: string; serializedData: string; databaseRow: Record<string, unknown> }[] = [];
  Object.entries(shiftEntries).forEach(([date, rowsByIndex]) => {
    Object.entries(rowsByIndex).forEach(([rowIndex, data]) => {
      const rowKey = `${date}|${rowIndex}`, serializedData = JSON.stringify(data);
      if (lastSentRows.get(rowKey) !== serializedData) {
        changedRows.push({ rowKey, serializedData, databaseRow: { station: stationName, entry_date: date, row_no: Number(rowIndex), data } });
      }
    });
  });
  if (!changedRows.length) return;
  const { error } = await supabaseClient!.from('shift_entries')
    .upsert(changedRows.map(changedRow => changedRow.databaseRow), { onConflict: 'station,entry_date,row_no' });
  if (error) throw error;
  changedRows.forEach(changedRow => lastSentRows.set(changedRow.rowKey, changedRow.serializedData));
}