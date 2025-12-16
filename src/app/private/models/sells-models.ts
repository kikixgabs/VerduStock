
export enum SellType {
    CASH = 'Efectivo',
    CREDIT = 'Crédito',
    DEBIT = 'Débito',
    TRANSFER = 'Transferencia'
}

export interface SellHistory {
    date: Date;
    field: string;
    oldValue: any;
    newValue: any;
}

export interface Sell {
    id: string;
    amount: number;
    date: Date;
    type: SellType;
    comments: string | undefined;
    modified?: boolean;
    isClosed?: boolean;
    history?: SellHistory[];
}