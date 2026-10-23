import { useState } from 'react';
import { formatRupees } from '../../lib/earningCalculations';
import { amountInputClass, dialogClass, dialogOverlayClass, primaryButtonClass, secondaryButtonClass } from '../../globalStyles';

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
    <div className={dialogOverlayClass} onClick={onClose}>
      <div className={dialogClass} onClick={event => event.stopPropagation()}>
        <h2 className="font-semibold">Send cash to bank</h2>
        <p className="my-1 text-sm text-slate-500">Sending {formatRupees(amountDueToBank)}. Cash in hand after: {formatRupees(totalCashInHand - amountDueToBank)}</p>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        <input autoFocus value={slipNumber} onChange={event => setSlipNumber(event.target.value)}
          onKeyDown={event => event.key === 'Enter' && confirmTransfer()} placeholder="Cash-to-bank slip number"
          className={`${amountInputClass} my-2 w-full text-left`} />
        <div className="flex gap-2">
          <button className={secondaryButtonClass} onClick={onClose}>Cancel</button>
          <button className={primaryButtonClass} onClick={confirmTransfer}>Confirm &amp; save</button>
        </div>
      </div>
    </div>
  );
}