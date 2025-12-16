import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Measurement } from '@app/private/models/index';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { StockService } from '@app/private/services/stock-service/stock-service';

@Component({
  selector: 'app-edit-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-component.html',
  styleUrl: './edit-component.css',
})
export class EditComponent {

  stockService = inject(StockService);

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) { }

  measurements = Object.values(Measurement);

  close() {
    this.stockService.updateProduct(this.data).subscribe(() => {
      this.modalService.close();
    });
  }
}
