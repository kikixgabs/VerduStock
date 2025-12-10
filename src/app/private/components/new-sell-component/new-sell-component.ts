import { Component, inject, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { Sell, SellType } from '@app/private/models';
import { SellsService } from '@app/private/services/sells-service/sells-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-sell-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './new-sell-component.html',
  styleUrl: './new-sell-component.css',
})
export class NewSellComponent {

  sellService = inject(SellsService);
  amount = signal<number | null>(null);
  type = signal<SellType>(SellType.CASH);
  comments = signal<string>('');
  isEditing = signal<boolean>(false);
  originalSell: Sell | null = null;
  SellType = SellType;

  async save(amount: number | null, type: SellType, comments?: string) {
    if (!amount) return;

    if (this.isEditing() && this.originalSell) {
      const history = this.originalSell.history || [];
      const changes = [];

      if (this.originalSell.amount !== amount) {
        changes.push({ date: new Date(), field: 'Monto', oldValue: this.originalSell.amount, newValue: amount });
      }
      if (this.originalSell.type !== type) {
        changes.push({ date: new Date(), field: 'Tipo', oldValue: this.originalSell.type, newValue: type });
      }
      if ((this.originalSell.comments || '') !== (comments || '')) {
        changes.push({ date: new Date(), field: 'Comentarios', oldValue: this.originalSell.comments || '', newValue: comments || '' });
      }

      const updatedSell: Sell = {
        ...this.originalSell,
        amount: amount,
        type: type,
        comments: comments,
        history: changes.length > 0 ? [...history, ...changes] : history
      };
      this.sellService.updateSell(updatedSell);
    } else {
      await this.sellService.createNewSell(amount, type, comments);
    }
    this.modalService.close();
  }

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) {
    if (data && data.sell) {
      this.isEditing.set(true);
      this.originalSell = data.sell;
      this.amount.set(data.sell.amount);
      this.type.set(data.sell.type);
      this.comments.set(data.sell.comments || '');
    }
  }

  close() {
    this.modalService.close();
  }

  preventAlphabetical(event: KeyboardEvent) {
    // Allow: Backspace, Tab, End, Home, ArrowLeft, ArrowRight, Delete, Enter, Escape
    if (['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', 'Escape'].includes(event.key)) {
      return;
    }
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
      return;
    }
    // Allow: numbers and decimal point/comma
    if (/^[0-9.,]$/.test(event.key)) {
      return;
    }

    // Prevent: everything else (including 'e')
    event.preventDefault();
  }
}
