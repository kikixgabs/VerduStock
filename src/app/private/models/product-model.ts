export enum ProductType {
    FRUIT = 'FRUTA',
    VEGETABLE = 'VEGETAL',
    ORTALIZA = 'ORTALIZA',
    OTHER = 'OTROS'
}

export enum Measurement {
    UNIDADES = 'UNIDADES',
    KILOS = 'KILOS',
    CAJONES = 'CAJONES',
    BOLSAS = 'BOLSAS'
}

export interface Product {
    id: string;
    name: string;
    stock: number;
    type?: ProductType;
    measurement: Measurement;
}