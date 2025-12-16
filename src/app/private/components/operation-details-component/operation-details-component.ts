import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, Status } from '../../models/receipts-model';
import { ModalService } from '../../../global/services/modal-service/modal-service';

@Component({
  selector: 'app-operation-details-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operation-details-component.html',
  styleUrl: './operation-details-component.css',
})
export class OperationDetailsComponent {
  receipt: Receipt;
  private modalService = inject(ModalService);

  constructor(@Inject('MODAL_DATA') public data: Receipt) {
    this.receipt = data;
  }

  close() {
    this.modalService.close();
  }

  convertToPdf() {
    console.log('Converting to PDF...', this.receipt);
    alert('Funcionalidad de PDF pendiente de implementación');
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Status.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case Status.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}
