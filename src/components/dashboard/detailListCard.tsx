import type { DetailListKind } from '../../lib/registerTypes';
import { penaltySections } from '../../lib/businessRules';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';

interface DetailListCardProps {
  title: string;
  listKind: DetailListKind;
  columnTitles: string[];
  listRows: string[][];
  onCellChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
}

const detailListRowCount = 5;
const cellInputClass = 'w-full min-w-[110px] bg-transparent p-1.5 text-sm outline-none focus:bg-blue-50';

export default function DetailListCard({ title, listKind, columnTitles, listRows, onCellChange }: DetailListCardProps) {
  const penaltySectionColumnIndex = 2, penaltyDateTimeColumnIndex = 1;
  return (
    <div className="overflow-auto rounded-2xl border border-slate-300 bg-white p-4 shadow-sm" onKeyDown={handleSheetKeyDown}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-100 text-xs">
            {columnTitles.map(columnTitle => <th key={columnTitle} className="border border-white px-2 py-1">{columnTitle}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: detailListRowCount }, (_, rowIndex) => (
            <tr key={rowIndex} className="even:bg-slate-100">
              {columnTitles.map((columnTitle, columnIndex) => (
                <td key={columnTitle} className="border border-slate-200 p-0">
                  {listKind === 'penaltyDetails' && columnIndex === penaltySectionColumnIndex ? (
                    <select data-grid={listKind} data-row={rowIndex} data-column={columnIndex} value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)} className={`${cellInputClass} min-w-[170px]`}>
                      <option value="">Select section</option>
                      {penaltySections.map(penaltySection => <option key={penaltySection}>{penaltySection}</option>)}
                    </select>
                  ) : (
                    <input data-grid={listKind} data-row={rowIndex} data-column={columnIndex} value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      placeholder={listKind === 'penaltyDetails' && columnIndex === penaltyDateTimeColumnIndex ? 'DD-MM-YYYY HH:MM' : ''}
                      onFocus={event => event.target.select()} onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
                      className={`${cellInputClass} ${columnIndex === columnTitles.length - 1 ? 'text-right' : ''}`} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}