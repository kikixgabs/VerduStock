import { Component, inject, Inject, signal } from '@angular/core'; // Importar signal
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
  private modalService = inject(ModalService); // Inyección corregida

  // ✅ Señal local para manejar el input visualmente
  stockValue = signal<number | null>(null);

  measurements = Object.values(Measurement);

  constructor(@Inject('MODAL_DATA') public data: any) {
    // Si el stock es 0, lo ponemos como null para que se vea el placeholder
    // Si tiene valor (ej: 50), lo mostramos.
    this.stockValue.set(data.stock === 0 ? null : data.stock);
  }

  save() {
    // Antes de guardar, asignamos el valor del input al objeto data
    // Si está vacío (null), lo guardamos como 0
    this.data.stock = this.stockValue() || 0;

    this.stockService.updateProduct(this.data).subscribe(() => {
      this.modalService.close();
    });
  }

  close() {
    this.modalService.close();
  }
}