export type RegisterRow = Record<string,string>;

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
    detailLists: Record<string, Record<string, string[][]>>;
    cashCounts: Record<string, Record<string, number>>;
    bankTransfers: Record<string, BankTransfer>;
}

export const createEmptyRegisterState =() : RegisterState =>({
    shiftRowCount:12,
    tvmRowCount:12,
    shiftEntries:{},
    tvmEntries:{},
    detailLists:{},
    cashCounts:{},
    bankTransfers:{},
})

export type DetailListKind = 'imprestIssue' | 'advanceReceived'