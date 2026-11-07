export type RegisterRow = Record<string,string>;
// export type DetailListKind = 'imprestIssue' | 'advanceReceived';

export interface BankTransfer{
    amount:number;
    slipNumber:string;
    noteCounts:Record<string,number>;
    sentAt:string | null;
}

export interface RegisterState {
    shiftRowCount:number;
    tvmRowCount:number;
    shiftEntries:Record<string, Record<number, RegisterRow>>;
    tvmEntries: Record<string, Record<number, RegisterRow>>;
    detailLists: Record<string, Partial<Record<DetailListKind, string[][]>>>;
    cashCounts: Record<string, Record<string, number>>;
    bankTransfers: Record<string, BankTransfer>;
    imprestIssued:Record<string, Record<number,RegisterRow>>
    advanceReceived:Record<string, Record<number,RegisterRow>>
    reportFields?:Record<string, Record<string, string>>;
}

export const createEmptyRegisterState =() : RegisterState =>({
    shiftRowCount:12,
    tvmRowCount:12,
    shiftEntries:{},
    tvmEntries:{},
    detailLists:{},
    cashCounts:{},
    bankTransfers:{},
    imprestIssued:{},
    advanceReceived:{},
    cashCountHistory: {},
    reportFields:{},
    miscEntries: { miscDebit: [], miscCredit: [] },
    miscRowCounts: { miscDebit: 6, miscCredit: 6 },
})

export type DetailListKind =
  | 'imprestIssue' | 'advanceReceived'
  | 'outsourceEarning' | 'miscEarning' | 'penaltyDetails'



export interface StationRecord { name: string; hasSv4Recharge: boolean; hasParking: boolean }

export const stations: StationRecord[] = [
  { name: 'Noida Electronic City', hasSv4Recharge: true, hasParking: true },
  { name: 'Sector 62 Noida', hasSv4Recharge: false, hasParking: false },
];

export type MiscKind = 'miscDebit' | 'miscCredit';

export interface RegisterState {
  // ...your existing properties...
  miscEntries?: Record<MiscKind, string[][]>;      // misc debit / credit: every entry ever added, each with its own date
  miscRowCounts?: Record<MiscKind, number>;        // rows shown in each card; the Add row button raises it
}

export interface CashCountChange { countKey: string; from: number; to: number; at: number }   // at = time in milliseconds
export interface CashCountHistory { changes: CashCountChange[]; position: number }              // position = how many changes are applied

export interface RegisterState {
  // ...your existing properties...
  cashCountHistory?: Record<string, CashCountHistory>;     // steps of the cash counts, for Back and Next: [date]
}
