export enum ProductType {
    FRUIT = 'FRUIT',
    VEGETABLE = 'VEGETABLE',
}

export enum Season {
    WINTER = 'WINTER',
    SPRING = 'SPRING',
    SUMMER = 'SUMMER',
    AUTUMN = 'AUTUMN',
    YEAR = 'YEAR'
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
    season: Season;
    measurement: Measurement;
}