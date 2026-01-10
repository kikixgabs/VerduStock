import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, Status } from '../../models/receipts-model';
import { ModalService } from '../../../global/services/modal-service/modal-service';
import { OperationDetailsComponent } from '../operation-details-component/operation-details-component';
import { ReceiptsService } from '@app/private/services/receipts-service/receipts-service';
import { AuthService } from '@app/global/services/auth-service/auth-service';

@Component({
  selector: 'app-receipts-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipts-component.html',
  styleUrl: './receipts-component.css',
})
export class ReceiptsComponent implements OnInit {
  private modalService = inject(ModalService);
  private receiptsService = inject(ReceiptsService);
  private authService = inject(AuthService);

  // ✅ CORRECCIÓN: Exponemos el Enum para usarlo en el HTML
  protected readonly Status = Status;

  receipts = signal<Receipt[]>([]);
  isLoading = signal(true);
  isSyncing = signal(false);

  isMpConnected = computed(() => {
    return !!this.authService.currentUser()?.mpAccountConnected;
  });

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    this.isLoading.set(true);
    this.receiptsService.getReceipts().subscribe({
      next: (data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysReceipts = data.filter(receipt => {
          const receiptDate = new Date(receipt.date);
          return receiptDate >= today;
        });

        todaysReceipts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.receipts.set(todaysReceipts);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando recibos', err);
        this.isLoading.set(false);
      }
    });
  }

  openDetails(receipt: Receipt) {
    this.modalService.open(OperationDetailsComponent, receipt);
  }

  // ✅ CORRECCIÓN: Usamos el Enum en el switch
  getStatusClass(status: Status): string {
    switch (status) {
      case Status.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Status.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case Status.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  syncNow() {
    if (!this.isMpConnected()) return;

    this.isSyncing.set(true);
    this.receiptsService.syncTransfers().subscribe({
      next: (res) => {
        this.loadReceipts();
        this.isSyncing.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isSyncing.set(false);
      }
    });
  }
}