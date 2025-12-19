import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models/index';
import { NewSellComponent } from '../new-sell-component/new-sell-component';
import { SellsHistoryComponent } from '../sells-history-component/sells-history-component';
import { DatePipe } from '@angular/common';
import { SellsService } from '@app/private/services/sells-service/sells-service';
import { CashService } from '@app/private/services/cash-service/cash-service'; // ✅ Importamos CashService
import { CashClosingComponent } from '../cash-closing-component/cash-closing-component';

@Component({
  selector: 'app-cashier-control',
  imports: [DatePipe],
  templateUrl: './cashier-control.html',
  styleUrl: './cashier-control.css',
})
export class CashierControl implements OnInit {

  modalService = inject(ModalService);
  sellsService = inject(SellsService);
  cashService = inject(CashService); // ✅ Inyectamos el servicio

  sortOrder = signal<string>('date-desc');
  filterType = signal<string>('all');

  // Check if any of today's sells are closed. If so, the register is considered closed for today.
  isClosed = computed(() => this.sells().some(sell => sell.isClosed));

  constructor() { }

  ngOnInit(): void {
    // Al iniciar, preguntamos al backend si hay cajas viejas sin cerrar
    this.checkBackendForPendingBoxes();
  }

  checkBackendForPendingBoxes() {
    this.cashService.checkPendingBoxes().subscribe({
      next: (pendingBoxes) => {
        // Si el array tiene elementos, significa que el backend encontró días viejos abiertos
        if (pendingBoxes && pendingBoxes.length > 0) {

          // Tomamos la más antigua (la primera del array)
          const oldestBox = pendingBoxes[0];

          // Abrimos el modal pasando las ventas que vinieron del backend
          this.modalService.open(CashClosingComponent, {
            data: oldestBox.sells,
            isPastClosing: true, // 🚩 Bandera activada
            boxDate: oldestBox.date // Fecha de esa caja vieja
          });
        }
      },
      error: (err) => console.error('Error verificando cajas pendientes', err)
    });
  }

  sells = computed(() => {
    const today = new Date().toDateString();
    // Filtramos localmente solo lo de HOY para la vista de la caja actual
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
    // Para el cierre manual normal (el de hoy), pasamos las ventas actuales
    this.modalService.open(CashClosingComponent, { data: this.sells() });
  }

  editSell(sell: Sell) {
    if (sell.isClosed) return;
    this.modalService.open(NewSellComponent, { sell });
  }
}