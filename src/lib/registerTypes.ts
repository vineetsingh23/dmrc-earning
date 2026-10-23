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
    advanceReceived:{}
})

export type DetailListKind =
  | 'imprestIssue' | 'advanceReceived'
  | 'outsourceEarning' | 'miscEarning' | 'penaltyDetails';
