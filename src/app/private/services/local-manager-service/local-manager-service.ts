import { Injectable } from '@angular/core';
import { Product, Sell } from '@app/private/models/index';

@Injectable({
  providedIn: 'root',
})
export class LocalManagerService {

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

  saveSell(sell: Sell) {
    if (typeof localStorage !== 'undefined') {
      const sells = this.loadSells();
      sells.push(sell);
      localStorage.setItem('sells', JSON.stringify(sells));
    }
  }

  loadSells() {
    if (typeof localStorage !== 'undefined') {
      const sells = localStorage.getItem('sells');
      if (sells) {
        return JSON.parse(sells);
      }
    }
    return [];
  }

}
