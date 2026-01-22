import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models/index';
import { NewSellComponent } from '../new-sell-component/new-sell-component';
import { EditSellComponent } from '../edit-sell-component/edit-sell-component'; // ✅ Importamos EditSell
import { SellsHistoryComponent } from '../sells-history-component/sells-history-component';
import { DatePipe } from '@angular/common';
import { SellsService } from '@app/private/services/sells-service/sells-service';
import { CashService } from '@app/private/services/cash-service/cash-service';
import { CashClosingComponent } from '../cash-closing-component/cash-closing-component';

@Component({
  selector: 'app-cashier-control',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './cashier-control.html',
  styleUrl: './cashier-control.css',
})
export class CashierControl implements OnInit {

  modalService = inject(ModalService);
  sellsService = inject(SellsService);
  cashService = inject(CashService);

  sortOrder = signal<string>('date-desc');
  filterType = signal<string>('all');

  isClosed = computed(() => this.sells().some(sell => sell.isClosed));

  constructor() { }

  ngOnInit(): void {
    this.checkBackendForPendingBoxes();
  }

  checkBackendForPendingBoxes() {
    this.cashService.checkPendingBoxes().subscribe({
      next: (pendingBoxes) => {
        if (pendingBoxes && pendingBoxes.length > 0) {
          const oldestBox = pendingBoxes[0];

          // Ahora modalRef tendrá el método .afterClosed()
          const modalRef = this.modalService.open(CashClosingComponent, {
            data: oldestBox.sells,
            isPastClosing: true,
            boxDate: oldestBox.date
          });

          modalRef.afterClosed().subscribe(() => {
            // Se ejecuta cuando el modal termina su animación de cierre
            this.checkBackendForPendingBoxes();
          });
        }
      },
      error: (err) => console.error('Error verificando cajas pendientes', err)
    });
  }

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
    this.modalService.open(NewSellComponent, {});
  }

  openSellsHistoryModal() {
    this.modalService.open(SellsHistoryComponent, { data: { sells: this.sells() } });
  }

  openCashClosingModal() {
    this.modalService.open(CashClosingComponent, { data: this.sells() });
  }

  editSell(sell: Sell) {
    if (sell.isClosed) return;
    this.modalService.open(EditSellComponent, { sell });
  }


}