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

}
