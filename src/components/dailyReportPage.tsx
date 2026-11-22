import { useMemo, useState } from 'react';
import type { RegisterState } from '../lib/registerTypes';
import { buildDailyReportPaymentSummary, buildWhatsAppMessage, reportFieldValue, reportFields, whatsAppLink } from '../lib/dailyReport';
import { copyReportFieldsFromPreviousDate, updateReportField } from '../handlers/reportFieldHandlers';
import { cardClass, cardContainer, cardHeadingClass, summaryRowClass } from '../globalStyles';
import { formatRupees } from '../lib/earningCalculations';
import { handleSheetKeyDown } from '../handlers/sheetKeyboardHandlers';
import { MessageCircleCheck} from 'lucide-react';

interface DailyReportPageProps {
  registerState: RegisterState;
  updateRegisterState: (applyChange: (draftState: RegisterState) => void) => void;
  date: string;
  stationName: string;
}

const buttonClass = 'rounded-xl border border-button-border bg-card px-3.5 py-1.5 font-medium transition hover:-translate-y-0.5 hover:border-ac hover:text-ac';
const inputClass = 'w-full rounded-lg border border-table-border/30 bg-input-focus px-2 py-1 text-sm text-table-text outline-hidden focus:ring-2 focus:ring-focus';

export default function DailyReportPage({ registerState, updateRegisterState, date, stationName }: DailyReportPageProps) {
  const [feedback, setFeedback] = useState('');
  const message = useMemo(() => buildWhatsAppMessage(registerState, date, stationName), [registerState, date, stationName]);
  const paymentSummary = useMemo(
    () => buildDailyReportPaymentSummary(registerState, date),
    [registerState, date],

  );
  const summaryRows = [
    { label: 'Total AFC Earning', value: formatRupees(paymentSummary.afcEarning) },
    { label: 'Total TOM UPI', value: formatRupees(paymentSummary.tomUpi) },
    { label: 'Total CC UPI', value: formatRupees(paymentSummary.ccUpi) },
    { label: 'Total TVM UPI', value: formatRupees(paymentSummary.tvmUpi) },
    { label: 'Total UPI Earning', value: formatRupees(paymentSummary.totalUpi) },
    { label: 'Total POS Earning', value: formatRupees(paymentSummary.totalPos) },
    { label: 'Total Digital Payment Percentage (A)', value: `${paymentSummary.digitalPaymentPercent.toFixed(2)}%` },
    { label: 'Average Digital Payment of Previous Month (B)', value: `${paymentSummary.previousMonthDigitalPaymentPercent.toFixed(2)}%` },
    {
      label: 'Difference (A-B)',
      value: `${(paymentSummary.digitalPaymentPercent - paymentSummary.previousMonthDigitalPaymentPercent).toFixed(2)} percentage points`,
    },
  ];

  const digitalPerformance = [
    {label: 'Total AFC Earning' , value: formatRupees(paymentSummary.afcEarning)},
    {label: 'Total UPI Transaction (TOM+CC)' , value: formatRupees(paymentSummary.totalUpi)},
    {label: 'Total Cashless UPI & POS (TOM+CC)' , value: formatRupees(paymentSummary.totalUpi + paymentSummary.totalPos)},
    {label: 'Percentage share of UPI' , value: `${(paymentSummary.totalUpi*100 / paymentSummary.afcEarning).toFixed(2)}%`},
    {label: 'Percentage share of UPI + POS' , value: `${(paymentSummary.digitalPaymentPercent).toFixed(2)}%`},
    {label: 'Total TVM UPI' , value: formatRupees(paymentSummary.tvmUpi)},
    {label: 'Total TVM Earning' , value: formatRupees(paymentSummary.tvmUpi)},
    {label: 'Percentage share of TVM' , value: `${(paymentSummary.tvmUpi*100 / paymentSummary.afcEarning).toFixed(2)}%`},
    {label: 'Total CASHLESS EARNING' , value: `${((paymentSummary.totalUpi + paymentSummary.totalPos + paymentSummary.tvmUpi)*100 / paymentSummary.afcEarning).toFixed(2)}%`},
  ]

  const typedValueOf = (fieldKey: string) => registerState.reportFields?.[date]?.[fieldKey] ?? '';
  const hasEarlierFields = Object.keys(registerState.reportFields ?? {}).some(savedDate => savedDate < date);

  const sendOnWhatsApp = () => window.open(whatsAppLink(message), '_blank', 'noopener');
  const copyMessage = async () => {
    try { await navigator.clipboard.writeText(message); setFeedback('Message copied.'); }
    catch { setFeedback('Could not copy. Select the message and copy it by hand.'); }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className={cardClass} onKeyDown={handleSheetKeyDown}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className={cardHeadingClass}>Report details for {date}</h2>
          <button className={buttonClass} disabled={!hasEarlierFields}
            onClick={() => updateRegisterState(draftState => { copyReportFieldsFromPreviousDate(draftState, date); })}>
            Copy empty fields from previous day
          </button>
        </div>
      
<div className="overflow-x-auto rounded-xl border border-table-border">
  <table className="w-full min-w-[480px] border-collapse text-sm">
    <thead className="bg-surface text-table-text">
      <tr>
        <th className="w-16 border-b border-table-border px-3 py-3 text-center">
          S.No.
        </th>
        <th className="border-b border-table-border px-4 py-3 text-left">
          Report Particulars
        </th>
        <th className="w-[40%] border-b border-table-border px-4 py-3 text-left">
          Entry
        </th>
      </tr>
    </thead>

    <tbody>
      {reportFields.map((field, fieldIndex) => (
        <tr
          key={field.fieldKey}
          className="last:border-b-0 hover:bg-surface/60"
        >
          <td className="px-3 py-1 text-center text-table-text">
            {fieldIndex + 1}
          </td>

          <td className="px-4 py-1 font-medium text-table-text">
            {field.label}
          </td>

          <td className="px-4 py-1">
            {field.kind === 'yesNo' ? (
              <select
                data-grid="dailyReport"
                data-row={fieldIndex}
                data-column={0}
                value={
                  typedValueOf(field.fieldKey) ||
                  field.defaultValue ||
                  ''
                }
                onChange={event =>
                  updateRegisterState(draftState =>
                    updateReportField(
                      draftState,
                      date,
                      field.fieldKey,
                      event.target.value
                    )
                  )
                }
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            ) : field.kind === 'calculated' ? (
              <input
                data-grid="dailyReport"
                data-row={fieldIndex}
                data-column={0}
                value={reportFieldValue(
                  registerState,
                  date,
                  field,
                  stationName
                )}
                readOnly
                aria-label={`${field.label} (calculated)`}
                className={`${inputClass} bg-calculated/40 font-semibold`}
              />
            ) : (
              <input
                data-grid="dailyReport"
                data-row={fieldIndex}
                data-column={0}
                value={typedValueOf(field.fieldKey)}
                inputMode={
                  field.kind === 'number' ? 'numeric' : 'text'
                }
                placeholder={
                  field.fieldKey === 'stationLabel'
                    ? stationName
                    : field.defaultValue ?? ''
                }
                onChange={event =>
                  updateRegisterState(draftState =>
                    updateReportField(
                      draftState,
                      date,
                      field.fieldKey,
                      event.target.value
                    )
                  )
                }
                className={inputClass}
              />
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>

      <div className={cardClass}>
        <h2 className={cardHeadingClass}>Message</h2>
        <pre className="max-h-[100vh] overflow-auto whitespace-pre-wrap rounded-lg border border-background bg-surface p-3 text-sm">{message}</pre>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-success-border px-3.5 py-1.5 font-medium text-success-text bg-success transition hover:-translate-y-0.5" onClick={sendOnWhatsApp}>
            <MessageCircleCheck  className='fill-success stroke-2 stroke-success-text'/>
            Send report on WhatsApp
          </button>
          <button className={buttonClass} onClick={copyMessage}>Copy message</button>
          <span className="text-sm text-mu">{feedback}</span>
        </div>
      </div>

      <div className={`${cardClass}`}>
        <h2 className={cardHeadingClass}>Morning Report · Digital Payments</h2>
        <div className={`${cardClass} flex-col p-4 mb-4 border-0`}>
          {summaryRows.map(({ label, value }) => (
            <div key={label} className={summaryRowClass}>
              <span>{label}</span>
              <b className="text-right">{value}</b>
            </div>
          ))}
        </div>
      </div>
       <div className={`${cardClass}`}>
        <h2 className={cardHeadingClass}>Morning Report · Station Digital Earning Performance</h2>
        <div className={`${cardClass} flex-col p-4 mb-4 border-0`}>
          {digitalPerformance.map(({ label, value }) => (
            <div key={label} className={summaryRowClass}> 
              <span>{label}</span>
              <b className="text-right">{value}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
