import { Component, inject, signal } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models/index';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';
import { NewSellComponent } from '../new-sell-component/new-sell-component';
import { SellsHistoryComponent } from '../sells-history-component/sells-history-component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cashier-control',
  imports: [DatePipe],
  templateUrl: './cashier-control.html',
  styleUrl: './cashier-control.css',
})
export class CashierControl {

  localManager = inject(LocalManagerService);
  modalService = inject(ModalService);

  sells = signal<Sell[]>([]);
  constructor() {
    this.sells.set(this.localManager.loadSells().filter((sell: Sell) => sell.date = new Date()));
  }
  openNewSellModal() {
    this.modalService.open(NewSellComponent, { data: { sells: this.sells } });
  }
  openSellsHistoryModal() {
    this.modalService.open(SellsHistoryComponent, { data: { sells: this.sells } });
  }

}
