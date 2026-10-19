import { useState } from 'react';
import { formatRupees } from '../../lib/earningCalculations';

interface SendToBankDialogProps {
  amountDueToBank: number;
  totalCashInHand: number;
  noteTotalToSend: number;
  onClose: () => void;
  onConfirm: (slipNumber: string) => void;
}

// asks for the cash-to-bank slip number before the transfer is saved
export default function SendToBankDialog({ amountDueToBank, totalCashInHand, noteTotalToSend, onClose, onConfirm }: SendToBankDialogProps) {
  const [slipNumber, setSlipNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const confirmTransfer = () => {
    if (!slipNumber.trim()) { setErrorMessage('Enter the slip number.'); return; }
    if (noteTotalToSend !== amountDueToBank) {
      setErrorMessage(`Note counts total ${formatRupees(noteTotalToSend)} but must equal ${formatRupees(amountDueToBank)}.`);
      return;
    }
    onConfirm(slipNumber.trim());
  };

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-black/50" onClick={onClose}>
      <div className="w-[min(360px,90%)] rounded-2xl border border-slate-300 bg-white p-5 shadow-xl" onClick={event => event.stopPropagation()}>
        <h2 className="font-semibold">Send cash to bank</h2>
        <p className="my-1 text-sm text-slate-500">Sending {formatRupees(amountDueToBank)}. Cash in hand after: {formatRupees(totalCashInHand - amountDueToBank)}</p>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        <input autoFocus value={slipNumber} onChange={event => setSlipNumber(event.target.value)}
          onKeyDown={event => event.key === 'Enter' && confirmTransfer()} placeholder="Cash-to-bank slip number"
          className="my-2 w-full rounded-lg border border-slate-300 px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-400" />
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-300 px-3 py-1.5" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-white" onClick={confirmTransfer}>Confirm &amp; save</button>
        </div>
      </div>
    </div>
  );
}