
export enum SellType {
    CASH = 'Efectivo',
    CREDIT = 'Crédito',
    DEBIT = 'Débito',
    TRANSFER = 'Transferencia'
}

export interface Sell {
    id: string;
    amount: number;
    date: Date;
    type: SellType;
    comments: string | undefined;
}