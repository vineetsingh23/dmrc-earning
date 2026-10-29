import { useMemo, useState } from 'react';
import type { RegisterState } from '../lib/registerTypes';
import { buildWhatsAppMessage, reportFields, whatsAppLink } from '../lib/dailyReport';
import { copyReportFieldsFromPreviousDate, updateReportField } from '../handlers/reportFieldHandlers';

interface DailyReportPageProps {
  registerState: RegisterState;
  updateRegisterState: (applyChange: (draftState: RegisterState) => void) => void;
  date: string;
  stationName: string;
}

const buttonClass = 'rounded-xl border border-bd bg-card px-3.5 py-1.5 font-medium transition hover:-translate-y-0.5 hover:border-ac hover:text-ac';
const inputClass = 'w-full rounded-lg border border-bd bg-inp px-2 py-1.5 text-sm text-tx outline-hidden focus:ring-2 focus:ring-ac';

export default function DailyReportPage({ registerState, updateRegisterState, date, stationName }: DailyReportPageProps) {
  const [feedback, setFeedback] = useState('');
  const message = useMemo(() => buildWhatsAppMessage(registerState, date, stationName), [registerState, date, stationName]);
  const typedValueOf = (fieldKey: string) => registerState.reportFields?.[date]?.[fieldKey] ?? '';
  const hasEarlierFields = Object.keys(registerState.reportFields ?? {}).some(savedDate => savedDate < date);

  const sendOnWhatsApp = () => window.open(whatsAppLink(message), '_blank', 'noopener');
  const copyMessage = async () => {
    try { await navigator.clipboard.writeText(message); setFeedback('Message copied.'); }
    catch { setFeedback('Could not copy. Select the message and copy it by hand.'); }
  };

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-2xl border border-bd bg-card p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Report details for {date}</h2>
          <button className={buttonClass} disabled={!hasEarlierFields}
            onClick={() => updateRegisterState(draftState => { copyReportFieldsFromPreviousDate(draftState, date); })}>
            Copy empty fields from previous day
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {reportFields.map(field => (
            <label key={field.fieldKey} className="text-xs text-mu">
              {field.label}
              {field.kind === 'yesNo' ? (
                <select value={typedValueOf(field.fieldKey)} onChange={event => updateRegisterState(draftState => updateReportField(draftState, date, field.fieldKey, event.target.value))} className={inputClass}>
                  <option value="">{field.defaultValue ? `Default: ${field.defaultValue}` : 'Select'}</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              ) : (
                <input value={typedValueOf(field.fieldKey)} inputMode={field.kind === 'number' ? 'numeric' : 'text'}
                  placeholder={field.fieldKey === 'stationLabel' ? stationName : field.defaultValue ?? ''}
                  onChange={event => updateRegisterState(draftState => updateReportField(draftState, date, field.fieldKey, event.target.value))} className={inputClass} />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-bd bg-card p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">Message</h2>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg border border-bd bg-inp p-3 text-sm">{message}</pre>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-ok bg-ok px-3.5 py-1.5 font-medium text-onac transition hover:-translate-y-0.5" onClick={sendOnWhatsApp}>
            <i className="fi fi-rr-comment-alt" aria-hidden="true" />
            Send report on WhatsApp
          </button>
          <button className={buttonClass} onClick={copyMessage}>Copy message</button>
          <span className="text-sm text-mu">{feedback}</span>
        </div>
      </div>
    </div>
  );
}