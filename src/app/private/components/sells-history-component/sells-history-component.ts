import { DatePipe } from '@angular/common';
import { Component, inject, Inject, signal } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell } from '@app/private/models';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';

@Component({
  selector: 'app-sells-history-component',
  imports: [DatePipe],
  templateUrl: './sells-history-component.html',
  styleUrl: './sells-history-component.css',
})
export class SellsHistoryComponent {

  localManager = inject(LocalManagerService);
  sells = signal<Sell[]>([]);
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
