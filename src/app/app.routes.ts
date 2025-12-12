import { Routes } from '@angular/router';
import { StockControlComponent } from './private/components/stock-control/stock-control';
import { CashierControl } from './private/components/cashier-control/cashier-control';
import { PublicLayout } from './public/components/public-layout/public-layout';
import { MainLayout } from './private/components/main-layout/main-layout';
import { authGuard } from './global/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: PublicLayout },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'stock-control', component: StockControlComponent },
            { path: 'cashier-control', component: CashierControl }
        ]
    }
];
