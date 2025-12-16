export interface PersonData {
    name: string;
    email: string;
}

export enum Status {
    PENDING = 'PENDIENTE',
    COMPLETED = 'COMPLETADO',
    CANCELLED = 'CANCELADO'
}

export interface Receipt {
    amount: number;
    date: string;
    payment_id: string;
    operationNumber: string;
    personData: PersonData;
    status: Status;
}