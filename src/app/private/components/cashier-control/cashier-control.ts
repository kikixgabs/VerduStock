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
  sells = computed(() => {
    const today = new Date().toDateString();
    return this.sellsService.sells().filter((sell: Sell) => new Date(sell.date).toDateString() === today);
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
