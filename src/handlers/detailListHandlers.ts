import type { DetailListKind, RegisterState} from '../lib/registerTypes';

export function updateDetailListCell(   state: RegisterState, 
                                        date: string, 
                                        listKind: DetailListKind, 
                                        roeIndex: number,
                                        columnIndex:number,
                                        newValue:string
                                    ){
                                        state.detailLists ?? = {};
                                        const listOfDate =(state.detailLists[date] ?? = {});
                                        const listRows = (listOfDate[listKind] ?? = []);
                                        (listRows[rowIndex] ?? = [])[columnIndex]= newValue;
                                    }