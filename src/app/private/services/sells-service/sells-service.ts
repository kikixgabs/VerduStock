import { inject, Injectable, signal } from '@angular/core';
import { Sell, SellType } from '@app/private/models';
import { LocalManagerService } from '../local-manager-service/local-manager-service';
@Injectable({
  providedIn: 'root',
})
export class SellsService {

  localManager = inject(LocalManagerService);

  sells = signal<Sell[]>(this.localManager.loadSells());

  createNewSell(amount: number, type: string, comments?: string) {
    const sell: Sell = {
      id: Date.now().toString(),
      amount: amount,
      date: new Date(),
      type: type as SellType,
      comments: comments
    }
    this.localManager.saveSell(sell);
    this.sells.update((sells) => [...sells, sell]);
  }

  updateSell(sell: Sell) {
    this.localManager.updateSell(sell);
    this.sells.update((sells) => {
      const index = sells.findIndex((s) => s.id === sell.id);
      if (index !== -1) {
        const updated = [...sells];
        updated[index] = sell;
        return updated;
      }
      return sells;
    });
  }

}
