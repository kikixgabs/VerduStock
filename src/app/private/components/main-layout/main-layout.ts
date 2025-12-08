import { Component } from '@angular/core';
import { StockControlComponent } from "../stock-control/stock-control";
import { CashierControl } from "../cashier-control/cashier-control";

@Component({
  selector: 'app-main-layout',
  imports: [StockControlComponent, CashierControl],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
