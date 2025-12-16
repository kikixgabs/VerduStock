import { Component, Inject, signal, inject, computed } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Sell } from '@app/private/models';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';
import { ToastService } from '@app/global/services/toast-service/toast-service';
import { NewSellComponent } from '../new-sell-component/new-sell-component';
import { AnimateLoadDirective } from 'ngx-gsap';
import { CashService } from '@app/private/services/cash-service/cash-service';


@Component({
  selector: 'app-cash-closing-component',
  imports: [DatePipe, AnimateLoadDirective],
  templateUrl: './cash-closing-component.html',
  styleUrl: './cash-closing-component.css',
})
export class CashClosingComponent {

  sells = signal<Sell[]>([]);
  cashService = inject(CashService);
  toastService = inject(ToastService);

  totalAmount = computed(() => this.sells().reduce((acc, sell) => acc + sell.amount, 0));

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) {
    this.sells.set(data.data);
  }

  editSell(sell: Sell) {
    this.modalService.open(NewSellComponent, { sell });
  }

  cashClose() {
    this.cashService.closeCashRegister().subscribe({
      next: () => {
        this.toastService.showToast('Caja cerrada con éxito');
        this.modalService.close();
        window.location.reload();
      },
      error: () => {
        this.toastService.showToast('Error al cerrar la caja');
      }
    });
  }

  close() {
    this.modalService.close();
  }
}
