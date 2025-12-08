import { Component, Inject, inject } from '@angular/core';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { ToastService } from '@app/global/services/toast-service/toast-service';

@Component({
  selector: 'app-save-stock-component',
  imports: [],
  templateUrl: './save-stock-component.html',
  styleUrl: './save-stock-component.css',
})
export class SaveStockComponent {

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService,
    private toastService: ToastService
  ) { }

  copyToClipboard() {
    const text = this.data.map((product: any) => `${product.name} - ${product.stock} - ${product.measurement}`).join('\n');
    navigator.clipboard.writeText(text);
    this.toastService.showToast('Stock guardado en portapapeles');
    this.modalService.close();
  }

  close() {
    this.modalService.close();
  }
}
