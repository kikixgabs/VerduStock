import { Component, Inject, signal, inject } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Sell } from '@app/private/models';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';
import { ToastService } from '@app/global/services/toast-service/toast-service';

@Component({
  selector: 'app-cash-closing-component',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './cash-closing-component.html',
  styleUrl: './cash-closing-component.css',
})
export class CashClosingComponent {

  sells = signal<Sell[]>([]);
  localManager = inject(LocalManagerService);
  toastService = inject(ToastService);

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) {
    this.sells.set(data.data);
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
