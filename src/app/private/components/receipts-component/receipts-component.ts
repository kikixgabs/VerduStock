import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, Status } from '../../models/receipts-model';
import { ModalService } from '../../../global/services/modal-service/modal-service';
import { OperationDetailsComponent } from '../operation-details-component/operation-details-component';

@Component({
  selector: 'app-receipts-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipts-component.html',
  styleUrl: './receipts-component.css',
})
export class ReceiptsComponent {
  private modalService = inject(ModalService);

  receipts = signal<Receipt[]>([
    {
      amount: 1500.50,
      date: new Date().toISOString(),
      payment_id: 'PAY-123456',
      operationNumber: 'OP-001',
      personData: {
        name: 'Juan Perez',
        email: 'juan.perez@example.com'
      },
      status: Status.PENDING
    },
    {
      amount: 2300.00,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      payment_id: 'PAY-789012',
      operationNumber: 'OP-002',
      personData: {
        name: 'Maria Garcia',
        email: 'maria.g@example.com'
      },
      status: Status.COMPLETED
    },
    {
      amount: 500.00,
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      payment_id: 'PAY-345678',
      operationNumber: 'OP-003',
      personData: {
        name: 'Carlos Lopez',
        email: 'carlos.lopez@example.com'
      },
      status: Status.CANCELLED
    }
  ]);

  openDetails(receipt: Receipt) {
    this.modalService.open(OperationDetailsComponent, receipt);
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

  getStatusIcon(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return '⏳';
      case Status.COMPLETED:
        return '✅';
      case Status.CANCELLED:
        return '❌';
      default:
        return '❓';
    }
  }
}
