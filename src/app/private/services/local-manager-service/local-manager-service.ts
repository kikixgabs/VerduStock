import { Injectable, signal } from '@angular/core';
import { Product, Sell } from '@app/private/models/index';

@Injectable({
  providedIn: 'root',
})
export class LocalManagerService {

  isTodayClosedSignal = signal<boolean>(false);

  // constructor() {
  //   this.isTodayClosedSignal.set(this.isTodayClosed());
  // }

  saveStockList(stock: Product[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('stockList', JSON.stringify(stock));
    }
  }


  loadStockList() {
    if (typeof localStorage !== 'undefined') {
      const stock = localStorage.getItem('stockList');
      if (stock) {
        return JSON.parse(stock);
      }
    }
    return [];
  }

  updateProduct(product: Product) {
    if (typeof localStorage !== 'undefined') {
      const stock = this.loadStockList();
      const index = stock.findIndex((product: Product) => product.id === product.id);
      if (index !== -1) {
        stock[index] = product;
        this.saveStockList(stock);
      }
    }
  }

  // saveSell(sell: Sell) {
  //   if (typeof localStorage !== 'undefined') {
  //     const sells = this.loadSells();
  //     sells.push(sell);
  //     localStorage.setItem('sells', JSON.stringify(sells));
  //   }
  // }

  // updateSell(sell: Sell) {
  //   if (typeof localStorage !== 'undefined') {
  //     const sells = this.loadSells();
  //     const index = sells.findIndex((s: Sell) => s.id === sell.id);
  //     if (index !== -1) {
  //       sells[index] = sell;
  //       localStorage.setItem('sells', JSON.stringify(sells));
  //     }
  //   }
  // }

  // loadSells() {
  //   if (typeof localStorage !== 'undefined') {
  //     const raw = JSON.parse(localStorage.getItem('sells') ?? '[]');

  //     return raw.map((item: any) => ({
  //       ...item,
  //       date: new Date(item.date)
  //     }));
  //   }
  //   return [];
  // }

  // cashClose(sells: Sell[]): boolean {
  //   if (typeof localStorage === 'undefined') return false;

  //   const existing = localStorage.getItem('cashCloseList');
  //   const cashCloseList = existing ? JSON.parse(existing) : [];

  //   const today = new Date();

  //   const isSameDay = (d1: Date, d2: Date) =>
  //     d1.getFullYear() === d2.getFullYear() &&
  //     d1.getMonth() === d2.getMonth() &&
  //     d1.getDate() === d2.getDate();

  //   const hasTodayClose = cashCloseList.some((close: any) =>
  //     isSameDay(new Date(close.date), today)
  //   );

  //   if (hasTodayClose) {
  //     return false;
  //   }

  //   const newClose = {
  //     date: today,
  //     sells
  //   };

  //   cashCloseList.push(newClose);
  //   localStorage.setItem('cashCloseList', JSON.stringify(cashCloseList));

  //   this.isTodayClosedSignal.set(true);

  //   return true;
  // }


  // loadCashCloseList() {
  //   if (typeof localStorage !== 'undefined') {
  //     const raw = JSON.parse(localStorage.getItem('cashCloseList') ?? '[]');
  //     return raw.map((item: any) => ({
  //       ...item,
  //       date: new Date(item.date)
  //     }));
  //   }
  //   return [];
  // }

  // isTodayClosed(): boolean {
  //   if (typeof localStorage === 'undefined') return false;

  //   const cashCloseList = this.loadCashCloseList();
  //   const today = new Date();

  //   return cashCloseList.some((close: any) =>
  //     close.date.getFullYear() === today.getFullYear() &&
  //     close.date.getMonth() === today.getMonth() &&
  //     close.date.getDate() === today.getDate()
  //   );
  // }
}
