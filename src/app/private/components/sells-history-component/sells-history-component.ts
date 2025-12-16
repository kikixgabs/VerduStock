import { CashService } from '@app/private/services/cash-service/cash-service';
import { DatePipe } from '@angular/common';
import { Component, inject, Inject, signal, computed } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AnimateLoadDirective } from 'ngx-gsap';

@Component({
  selector: 'app-sells-history-component',
  imports: [DatePipe, CdkAccordionModule, AnimateLoadDirective],
  templateUrl: './sells-history-component.html',
  styleUrl: './sells-history-component.css',
})
export class SellsHistoryComponent {

  cashService = inject(CashService);
  sells = signal<Sell[]>([]);

  groupedSells = computed(() => {
    const sells = this.sells();
    if (!sells.length) return [];

    // Assuming backend returns closed sells, we just group them by date
    // Sort by date descending
    const sorted = [...sells].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const groups: { dateLabel: string, sells: Sell[], totalAmount: number }[] = [];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    sorted.forEach(sell => {
      const d = new Date(sell.date);
      const day = d.getDate();
      const month = months[d.getMonth()];
      const label = `${day} de ${month}`;

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

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) {
    this.cashService.getClosedSells().subscribe(data => {
      this.sells.set(data);
    });
  }


  close() {
    this.modalService.close();
  }

}
