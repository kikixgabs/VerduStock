import { Component, inject, Inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AnimateLoadDirective } from 'ngx-gsap';
import { CashService } from '@app/private/services/cash-service/cash-service';

@Component({
  selector: 'app-sells-history-component',
  imports: [DatePipe, CdkAccordionModule, AnimateLoadDirective],
  templateUrl: './sells-history-component.html',
  styleUrl: './sells-history-component.css',
})
export class SellsHistoryComponent {

  cashService = inject(CashService);
  sells = signal<Sell[]>([]);
  modalService = inject(ModalService);

  constructor(@Inject('MODAL_DATA') public data: any) {
    this.loadHistory();
  }

  loadHistory() {
    // Pedimos al backend las ventas con status=closed
    this.cashService.getClosedSells().subscribe({
      next: (data) => {
        this.sells.set(data);
      },
      error: (err) => console.error('Error cargando historial', err)
    });
  }

  groupedSells = computed(() => {
    const sells = this.sells();
    if (!sells.length) return [];

    // Ordenar por fecha descendente
    const sorted = [...sells].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Interfaz local para el grupo
    interface SellGroup { dateLabel: string; sells: Sell[]; totalAmount: number; }
    const groups: SellGroup[] = [];

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    sorted.forEach(sell => {
      const d = new Date(sell.date);
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();

      const currentYear = new Date().getFullYear();
      // Si es otro año, lo mostramos. Si es este año, solo día y mes.
      const label = year === currentYear ? `${day} de ${month}` : `${day} de ${month} ${year}`;

      const existingGroup = groups.find(g => g.dateLabel === label);
      if (existingGroup) {
        existingGroup.sells.push(sell);
        existingGroup.totalAmount += sell.amount;
      } else {
        groups.push({ dateLabel: label, sells: [sell], totalAmount: sell.amount });
      }
    });

    return groups;
  });

  close() {
    this.modalService.close();
  }
}