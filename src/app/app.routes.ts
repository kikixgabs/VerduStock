import { Routes } from '@angular/router';
import { StockControlComponent } from './private/components/stock-control/stock-control';
import { CashierControl } from './private/components/cashier-control/cashier-control';
import { ReceiptsComponent } from './private/components/receipts-component/receipts-component';
import { PublicLayout } from './public/components/public-layout/public-layout';
import { MainLayout } from './private/components/main-layout/main-layout';
import { authGuard } from './global/guards/auth.guard';
import { MpCallback } from './private/pages/mp-callback/mp-callback';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: PublicLayout },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        children: [
            { path: 'stock-control', component: StockControlComponent },
            { path: 'cashier-control', component: CashierControl },
            { path: 'receipts', component: ReceiptsComponent },
            { path: 'callback', component: MpCallback }
        ]
    }
];
