import { Component, inject, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sell, SellType } from '../../models/index';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { CashService } from '@app/private/services/cash-service/cash-service';
import { ToastService } from '@app/global/services/toast-service/toast-service';

@Component({
  selector: 'app-edit-sell-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-sell-component.html',
  styleUrl: './edit-sell-component.css',
})
export class EditSellComponent {

  modalService = inject(ModalService);
  cashService = inject(CashService);
  toastService = inject(ToastService);

  // Signals inicializados con los datos de la venta original
  amount = signal<number | null>(null);
  type = signal<SellType>(SellType.CASH);
  comments = signal<string>('');

  originalSell: Sell;
  SellType = SellType;

  constructor(@Inject('MODAL_DATA') public data: any) {
    if (data && data.sell) {
      this.originalSell = data.sell;

      // Cargamos los datos para editar
      this.amount.set(data.sell.amount);
      this.type.set(data.sell.type);
      this.comments.set(data.sell.comments || '');
    } else {
      // Fallback de seguridad, aunque no debería pasar si se llama desde editSell
      this.originalSell = {} as Sell;
      this.close();
    }
  }

  preventAlphabetical(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  save() {
    const valAmount = this.amount();

    if (!valAmount || valAmount <= 0) {
      this.toastService.showToast('Monto inválido');
      return;
    }

    // Datos parciales a actualizar
    const updates: Partial<Sell> = {
      amount: valAmount,
      type: this.type(),
      comments: this.comments()
    };

    // Fusionamos con el original
    const updatedSell = { ...this.originalSell, ...updates };

    this.cashService.updateSell(updatedSell).subscribe({
      next: () => {
        this.toastService.showToast('Venta actualizada');
        this.close();
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
        this.toastService.showToast('Error al actualizar');
      }
    });
  }

  close() {
    this.modalService.close();
  }
}