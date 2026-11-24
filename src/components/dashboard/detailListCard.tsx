import type { DetailListKind } from '../../lib/registerTypes';
import { penaltySections } from '../../lib/businessRules';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { Trash2 } from 'lucide-react';
import { tableCellClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableWrapperClass, tableClass, cardClass, cardHeaderClass, cardHeadingClass, tableTotalCellClass, tableTotalRowClass, tableCellLeftClass, primaryButtonClass } from '../../globalStyles';

interface DetailListCardProps {
  title: string;
  listKind: DetailListKind;
  columnTitles: string[];
  listRows: string[][];
  onAddRow: () => void;
  onDeleteRow: (rowIndex: number) => void;
  onCellChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
}

const detailListRowCount = 3;
const penaltyTypes = [
  { field: 'manualPenaltyAmount', label: 'Manual Penalty' },
  { field: 'hhtPenaltyCashAmount', label: 'Cash by HHT' },
  { field: 'hhtPenaltyPurseAmount', label: 'Penalty by Purse' },
];

function formatPenaltyDateTime(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 12) return value;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const hours = Number(digits.slice(8, 10));
  const minutes = Number(digits.slice(10, 12));
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    hours > 23 ||
    minutes > 59
  ) return value;

  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)} & ${digits.slice(8, 10)}:${digits.slice(10, 12)}`;
}

function penaltyColumnClass(columnIndex: number) {
  if (columnIndex === 0) return 'w-[90px]';
  if (columnIndex === 1) return 'w-[190px]';
  if (columnIndex === 2) return 'w-[140px]';
  if (columnIndex === 3) return 'w-[210px]';
  if (columnIndex === 4) return 'w-[140px]';
  if (columnIndex === 5) return 'w-[150px]';
  if (columnIndex === 6) return 'w-[190px]';
  if (columnIndex === 7) return 'w-[75px]';
  if (columnIndex === 8) return 'w-[150px]';

  return '';
}

export default function DetailListCard({ title, listKind, columnTitles, listRows, onCellChange, onAddRow, onDeleteRow }: DetailListCardProps) {
  const penaltySectionColumnIndex = 2;
  const penaltyDetailColumnIndex = 3;
  const penaltyAmountColumnIndex = 8;
  const penaltyTypeColumnIndex = 4;
  const penaltyDateTimeColumnIndex = 1;
  const penaltySectionsUnique = [...new Map(penaltySections.map(rule => [rule.section, rule])).values()];
  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <div className={cardHeaderClass}>
      <h2 className={cardHeadingClass}>{title}</h2>

              <button type="button" onClick={onAddRow} className={primaryButtonClass}>
                + Add row
              </button>
       

      </div>
      <div className={tableWrapperClass}>

      <table className={`${tableClass} ${listKind === 'penaltyDetails' ? 'min-w-[1335px] table-fixed' : ''}`}>
        <thead>
          <tr className={tableHeaderRowClass}>
            {columnTitles.map((columnTitle, columnIndex) => (
              <th key={columnTitle} className={`${tableHeaderCellClass} ${listKind === 'penaltyDetails' ? penaltyColumnClass(columnIndex) : ''} whitespace-normal break-words`}>
                {columnTitle}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(detailListRowCount, listRows.length) }, (_, rowIndex) => (
            <tr key={rowIndex} className={tableRowClass}>
              {columnTitles.map((columnTitle, columnIndex) => (
                <td key={columnTitle} className={`${tableCellClass} relative p-0 whitespace-normal wrap-break-words ${listKind === 'penaltyDetails' ? penaltyColumnClass(columnIndex) : ''}`}>
                  {columnIndex === 0 && rowIndex < listRows.length && (
                    <button
                      type="button"
                      onClick={() => onDeleteRow(rowIndex)}
                      aria-label={`Delete ${title} row ${rowIndex + 1}`}
                      title="Delete row"
                      className="absolute left-1 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-md text-danger-text transition hover:bg-danger/10"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  )}
                  {listKind === 'penaltyDetails' && columnIndex === penaltySectionColumnIndex ? (
                    <select data-grid={listKind} data-row={rowIndex} data-column={columnIndex} value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      onChange={event => {
                        const selectedSection = event.target.value;
                        const matchingRule = penaltySections.find(rule => rule.section === selectedSection);
                        onCellChange(rowIndex, penaltySectionColumnIndex, selectedSection);
                        onCellChange(rowIndex, penaltyDetailColumnIndex, matchingRule?.penaltyDetail ?? '');
                        onCellChange(rowIndex, penaltyAmountColumnIndex, matchingRule ? String(matchingRule.penaltyAmount) : '');
                      }} className={`${tableInputClass} w-full min-w-0 whitespace-normal wrap-break-words`}>
                      <option value="">Select section</option>
                      {penaltySectionsUnique.map(penaltySection => (
                        <option key={penaltySection.section} value={penaltySection.section}>{penaltySection.section}</option>
                      ))}
                    </select>
                  ) : listKind === 'penaltyDetails' && columnIndex === penaltyDetailColumnIndex ? (
                    <select data-grid={listKind} data-row={rowIndex} data-column={columnIndex} value={listRows[rowIndex]?.[columnIndex] ?? ''}
                    onChange={event => {
                      const selectedDetail = event.target.value;
                      const matchingRule = penaltySections.find(rule =>
                        rule.section === listRows[rowIndex]?.[penaltySectionColumnIndex] &&
                        rule.penaltyDetail === selectedDetail,
                      );
                        onCellChange(rowIndex, penaltyDetailColumnIndex, selectedDetail);
                        onCellChange(rowIndex, penaltyAmountColumnIndex, matchingRule ? String(matchingRule.penaltyAmount) : '');
                      }} className={`${tableInputClass} w-full min-w-0 whitespace-normal break-words`}>
                      <option value="">Select penalty detail</option>
                      {penaltySections
                        .filter(rule => rule.section === listRows[rowIndex]?.[penaltySectionColumnIndex])
                        .map(rule => (
                          <option key={rule.penaltyDetail} value={rule.penaltyDetail}>{rule.penaltyDetail}</option>
                        ))}
                    </select>
                  ) : listKind === 'penaltyDetails' && columnIndex === penaltyAmountColumnIndex ? (
                    <input data-grid={listKind} data-row={rowIndex} data-column={columnIndex}
                      value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      readOnly
                      className={`${tableInputClass} w-full min-w-0 text-right`} />
                  ) : listKind === 'penaltyDetails' && columnIndex === penaltyTypeColumnIndex ? (
                    <select data-grid={listKind} data-row={rowIndex} data-column={columnIndex}
                      value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
                      className={`${tableInputClass} w-full min-w-0 whitespace-normal break-words`}>
                      <option value="">Select type</option>
                      {penaltyTypes.map(type => (
                        <option key={type.field} value={type.field}>{type.label}</option>
                      ))}
                    </select>
                  ) : listKind === 'penaltyDetails' && columnIndex !== penaltyDateTimeColumnIndex ? (
                    <textarea data-grid={listKind} data-row={rowIndex} data-column={columnIndex}
                      ref={element => {
                        if (element) {
                          element.style.height = 'auto';
                          element.style.height = `${element.scrollHeight}px`;
                        }
                      }}
                      value={listRows[rowIndex]?.[columnIndex] ?? ''}
                      onFocus={event => event.target.select()}
                      onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
                      className={`${tableInputClass} min-h-[40px] w-full min-w-0 resize-none whitespace-pre-wrap break-words overflow-hidden ${columnIndex === 0 ? '!pl-8' : ''}`} />
                    ) : (
                    <input data-grid={listKind} data-row={rowIndex} data-column={columnIndex}
                      value={listKind === 'penaltyDetails' && columnIndex === penaltyDateTimeColumnIndex
                        ? formatPenaltyDateTime(listRows[rowIndex]?.[columnIndex] ?? '')
                        : listRows[rowIndex]?.[columnIndex] ?? ''}
                      placeholder={listKind === 'penaltyDetails' && columnIndex === penaltyDateTimeColumnIndex ? 'DD-MM-YYYY HH:MM' : ''}
                      onFocus={event => event.target.select()}
                      onBlur={event => {
                        if (listKind === 'penaltyDetails' && columnIndex === penaltyDateTimeColumnIndex) {
                          onCellChange(rowIndex, columnIndex, formatPenaltyDateTime(event.target.value));
                        }
                      }}
                      onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
                      className={`${tableInputClass} w-full min-w-0 ${columnIndex === 0 ? '!pl-8' : ''} ${columnIndex === columnTitles.length - 1 ? 'text-right' : ''}`} />
                    )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {listKind === 'penaltyDetails' && (
          <tfoot>
            <tr className={tableTotalRowClass}>
              <td colSpan={penaltyAmountColumnIndex} className={`${tableCellLeftClass} font-bold text-left`}>Total</td>
              <td className={`${tableTotalCellClass} font-bold text-right px-2`}>
                {listRows.reduce((total, row) => {
                  const amount = Number((row[penaltyAmountColumnIndex] ?? '').replace(/,/g, ''));
                  return total + (Number.isFinite(amount) ? amount : 0);
                }, 0).toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
          </div>
    </div>
  );
}