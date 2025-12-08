import { Component, inject, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell, SellType } from '@app/private/models';
import { SellsService } from '@app/private/services/sells-service/sells-service';

@Component({
  selector: 'app-new-sell-component',
  imports: [FormsModule],
  templateUrl: './new-sell-component.html',
  styleUrl: './new-sell-component.css',
})
export class NewSellComponent {

  sellService = inject(SellsService);
  amount = signal<number>(0);
  type = signal<SellType>(SellType.CASH);
  comments = signal<string>('');
  SellType = SellType;

  async newSell(amount: number, type: SellType, comments?: string) {
    await this.sellService.createNewSell(amount, type, comments);
    this.modalService.close();
  }

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) { }

  close() {
    this.modalService.close();
  }
}
