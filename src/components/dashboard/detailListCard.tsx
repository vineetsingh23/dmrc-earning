import type { DetailListKind } from '../../lib/registerTypes';
import { penaltySections } from '../../lib/businessRules';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { tableCellClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableWrapperClass, tableClass } from '../../globalStyles';

interface DetailListCardProps {
  title: string;
  listKind: DetailListKind;
  columnTitles: string[];
  listRows: string[][];
  onCellChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
}

const detailListRowCount = 5;

export default function DetailListCard({ title, listKind, columnTitles, listRows, onCellChange }: DetailListCardProps) {
  const penaltySectionColumnIndex = 2, penaltyDateTimeColumnIndex = 1;
  return (
    <div className={`${tableWrapperClass} rounded-2xl p-4 shadow-sm`} onKeyDown={handleSheetKeyDown}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
            {columnTitles.map(columnTitle => <th key={columnTitle} className={tableHeaderCellClass}>{columnTitle}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: detailListRowCount }, (_, rowIndex) => (
            <tr key={rowIndex} className={tableRowClass}>
              {columnTitles.map((columnTitle, columnIndex) => (
                <td key={columnTitle} className={`${tableCellClass} p-0`}>
                  {listKind === 'penaltyDetails' && columnIndex === penaltySectionColumnIndex ? (
                    <select data-grid={listKind} data-row={rowIndex} data-column={columnIndex} value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)} className={`${tableInputClass} min-w-[170px]`}>
                      <option value="">Select section</option>
                      {penaltySections.map(penaltySection => <option key={penaltySection}>{penaltySection}</option>)}
                    </select>
                  ) : (
                    <input data-grid={listKind} data-row={rowIndex} data-column={columnIndex} value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      placeholder={listKind === 'penaltyDetails' && columnIndex === penaltyDateTimeColumnIndex ? 'DD-MM-YYYY HH:MM' : ''}
                      onFocus={event => event.target.select()} onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
                      className={`${tableInputClass} min-w-[110px] ${columnIndex === columnTitles.length - 1 ? 'text-right' : ''}`} />
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