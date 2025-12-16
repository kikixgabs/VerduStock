import { inject, Injectable, signal } from '@angular/core';
import { Sell, SellType } from '@app/private/models';
import { CashService } from '../cash-service/cash-service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SellsService {

  cashService = inject(CashService);

  // We primarily track open sells for the current session/day in this signal for UI updates
  sells = signal<Sell[]>([]);

  // ...

  constructor() {
    this.loadTodaySells();
  }

  loadTodaySells() {
    forkJoin({
      open: this.cashService.getOpenSells(),
      closed: this.cashService.getClosedSells()
    }).pipe(
      map(({ open, closed }) => {
        const all = [...open, ...closed];
        const today = new Date().toDateString();
        // Filter only today's sells
        return all.filter(s => new Date(s.date).toDateString() === today);
      })
    ).subscribe(data => {
      this.sells.set(data);
    });
  }

  createNewSell(amount: number, type: string, comments?: string) {
    const newSell: Partial<Sell> = {
      amount: amount,
      type: type as SellType,
      comments: comments
    }

    this.cashService.addSell(newSell).subscribe(createSell => {
      this.sells.update(prev => [...prev, createSell]);
    });
  }

  updateSell(sell: Sell) {
    // Optimistic update
    const previousSells = this.sells();
    this.sells.update(prev => prev.map(s => s.id === sell.id ? sell : s));

    this.cashService.updateSell(sell).subscribe({
      next: (updatedSell) => {
        this.sells.update(prev => prev.map(s => s.id === updatedSell.id ? updatedSell : s));
      },
      error: (err) => {
        console.error('Error updating sell:', err);
        // Revert optimistic update
        this.sells.set(previousSells);
      }
    });
  }
}
