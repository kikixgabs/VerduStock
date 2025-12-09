import { Routes } from '@angular/router';
import { StockControlComponent } from './private/components/stock-control/stock-control';
import { CashierControl } from './private/components/cashier-control/cashier-control';

export const routes: Routes = [
    { path: '', redirectTo: 'stock-control', pathMatch: 'full' },
    { path: 'stock-control', component: StockControlComponent },
    { path: 'cashier-control', component: CashierControl }
];
