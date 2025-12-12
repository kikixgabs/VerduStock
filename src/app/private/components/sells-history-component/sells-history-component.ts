import { DatePipe } from '@angular/common';
import { Component, inject, Inject, signal, computed } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AnimateLoadDirective } from 'ngx-gsap';

@Component({
  selector: 'app-sells-history-component',
  imports: [DatePipe, CdkAccordionModule, AnimateLoadDirective],
  templateUrl: './sells-history-component.html',
  styleUrl: './sells-history-component.css',
})
export class SellsHistoryComponent {

  localManager = inject(LocalManagerService);
  sells = signal<Sell[]>([]);

  groupedSells = computed(() => {
    const sells = this.sells();
    if (!sells.length) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter out today's sells UNLESS today is closed
    const isTodayClosed = this.localManager.isTodayClosedSignal();

    const pastSells = sells.filter(sell => {
      const sellDate = new Date(sell.date);
      sellDate.setHours(0, 0, 0, 0);

      const isToday = sellDate.getTime() === today.getTime();

      // Show if it's NOT today, OR if it IS today and the day is closed
      if (!isToday) return true;
      if (isToday && isTodayClosed) return true;

      return false;
    });

    if (!pastSells.length) return [];

    // Sort by date descending
    const sorted = [...pastSells].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    this.sells.set(this.localManager.loadSells());
  }


  close() {
    this.modalService.close();
  }

}
