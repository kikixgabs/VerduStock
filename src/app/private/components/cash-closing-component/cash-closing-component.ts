import { Component, Inject, signal, inject, computed } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { DatePipe } from '@angular/common';
import { Sell } from '@app/private/models';
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

  // Señal para saber si es un cierre atrasado
  isPastClosing = signal<boolean>(false);
  boxDate = signal<string | null>(null);

  totalAmount = computed(() => this.sells().reduce((acc, sell) => acc + sell.amount, 0));

  constructor(
    @Inject('MODAL_DATA') public incomingData: any, // Renombramos a incomingData para claridad
    private modalService: ModalService
  ) {
    // Lógica para detectar qué nos mandaron
    // Caso 1: Viene desde checkPendingBoxes (Array de ventas está en incomingData)
    // Caso 2: Viene desde el botón normal (Array de ventas está en incomingData.data si usaste esa estructura, o directo)

    // Asumiendo que desde CashierControl siempre mandas { data: ventas[] }
    if (incomingData.data) {
      this.sells.set(incomingData.data);
    } else if (Array.isArray(incomingData)) {
      this.sells.set(incomingData);
    }

    if (incomingData.isPastClosing) {
      this.isPastClosing.set(true);
    }

    if (incomingData.boxDate) {
      this.boxDate.set(incomingData.boxDate);
    }
  }

  editSell(sell: Sell) {
    this.modalService.open(NewSellComponent, { sell });
  }

  cashClose() {

    this.cashService.closeCashRegister().subscribe({
      next: () => {
        this.toastService.showToast('Caja cerrada con éxito');
        this.modalService.close();
        // Recargamos para que CashierControl vuelva a preguntar si hay MÁS cajas pendientes
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