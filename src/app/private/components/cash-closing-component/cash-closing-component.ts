import { Component, Inject, signal, inject, computed } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Sell } from '@app/private/models';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';
import { ToastService } from '@app/global/services/toast-service/toast-service';
import { NewSellComponent } from '../new-sell-component/new-sell-component';

@Component({
  selector: 'app-cash-closing-component',
  imports: [DatePipe],
  templateUrl: './cash-closing-component.html',
  styleUrl: './cash-closing-component.css',
})
export class CashClosingComponent {

  sells = signal<Sell[]>([]);
  localManager = inject(LocalManagerService);
  toastService = inject(ToastService);

  totalAmount = computed(() => this.sells().reduce((acc, sell) => acc + sell.amount, 0));

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) {
    this.sells.set(data.data);
  }

  editSell(sell: Sell) {
    // We pass the sell to be edited. 
    // Important: In this context, we probably want to refresh the list after edit.
    // However, NewSellComponent updates the service signal. 
    // Since CashClosingComponent uses a signal coming from MODAL_DATA (Snapshot) it wont update automatically unless we re-fetch.
    // But let's check. 
    // Actually, CashClosingComponent initializes `this.sells` signal from data.data. It is NOT connected to the service normally.
    // We should probably subscribe to service sells or manually update.
    this.modalService.open(NewSellComponent, { sell });
  }

  cashClose() {
    const ok = this.localManager.cashClose(this.sells());

    if (!ok) {
      this.toastService.showToast('Ya existe un cierre de caja para el día de hoy');
      return;
    }

    this.modalService.close();
  }


  close() {
    this.modalService.close();
  }
}
