import { Component, computed, inject, signal } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models/index';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';
import { NewSellComponent } from '../new-sell-component/new-sell-component';
import { SellsHistoryComponent } from '../sells-history-component/sells-history-component';
import { DatePipe } from '@angular/common';
import { SellsService } from '@app/private/services/sells-service/sells-service';
import { CashClosingComponent } from '../cash-closing-component/cash-closing-component';

@Component({
  selector: 'app-cashier-control',
  imports: [DatePipe],
  templateUrl: './cashier-control.html',
  styleUrl: './cashier-control.css',
})
export class CashierControl {

  modalService = inject(ModalService);
  sellsService = inject(SellsService);
  sortOrder = signal<string>('date-desc');
  filterType = signal<string>('all');

  sells = computed(() => {
    const today = new Date().toDateString();
    let filtered = this.sellsService.sells().filter((sell: Sell) => new Date(sell.date).toDateString() === today);
    const type = this.filterType();

    if (type !== 'all') {
      filtered = filtered.filter(sell => sell.type === type);
    }

    const order = this.sortOrder();

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      switch (order) {
        case 'date-desc': return dateB - dateA;
        case 'date-asc': return dateA - dateB;
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        default: return 0;
      }
    });
  });
  openNewSellModal() {
    this.modalService.open(NewSellComponent, { data: { sells: this.sells() } });
  }
  openSellsHistoryModal() {
    this.modalService.open(SellsHistoryComponent, { data: { sells: this.sells() } });
  }
  openCashClosingModal() {
    this.modalService.open(CashClosingComponent, { data: this.sells() });
  }

}
