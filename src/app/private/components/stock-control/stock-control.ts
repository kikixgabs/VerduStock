import { Component, HostListener, ElementRef, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductType, Measurement } from '../../models/index';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { EditComponent } from '../edit-component/edit-component/edit-component';
import { SaveStockComponent } from '../save-stock-component/save-stock-component';
import { AnimateClickDirective } from 'ngx-gsap'

@Component({
  selector: 'app-stock-control',
  standalone: true,
  imports: [CommonModule, AnimateClickDirective],
  templateUrl: './stock-control.html',
  styleUrls: ['./stock-control.css'],
})
export class StockControlComponent {

  localManagerService = inject(LocalManagerService);
  modalService = inject(ModalService);

  // --------------------- PRODUCTOS ---------------------
  products = signal<Product[]>([
    // FRUTAS
    { id: '1', name: 'Naranja', stock: 100, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '2', name: 'Mandarina', stock: 80, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '3', name: 'Pomelo', stock: 50, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '11', name: 'Frutilla', stock: 70, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '12', name: 'Cereza', stock: 60, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '13', name: 'Damasco', stock: 55, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '21', name: 'Sandía', stock: 40, type: ProductType.FRUIT, measurement: Measurement.UNIDADES },
    { id: '22', name: 'Melón', stock: 45, type: ProductType.FRUIT, measurement: Measurement.UNIDADES },
    { id: '23', name: 'Durazno', stock: 90, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '24', name: 'Ciruela', stock: 85, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '25', name: 'Higo', stock: 60, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '31', name: 'Manzana', stock: 120, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '32', name: 'Pera', stock: 100, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '33', name: 'Uva', stock: 90, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '34', name: 'Granada', stock: 40, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '35', name: 'Membrillo', stock: 30, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '40', name: 'Caqui', stock: 35, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '41', name: 'Banana', stock: 200, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '42', name: 'Limón', stock: 150, type: ProductType.FRUIT, measurement: Measurement.KILOS },
    { id: '49', name: 'Palta', stock: 70, type: ProductType.FRUIT, measurement: Measurement.UNIDADES },

    // ORTALIZAS (Leafy greens, etc.)
    { id: '4', name: 'Espinaca', stock: 30, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES },
    { id: '9', name: 'Acelga', stock: 45, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES },
    { id: '18', name: 'Rabanito', stock: 80, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES },
    { id: '19', name: 'Berro', stock: 25, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES },
    { id: '46', name: 'Lechuga', stock: 100, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES },
    { id: '48', name: 'Perejil', stock: 60, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES },
    { id: '6', name: 'Coliflor', stock: 35, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES }, // Could be debated, but putting here 
    { id: '7', name: 'Repollo', stock: 25, type: ProductType.ORTALIZA, measurement: Measurement.UNIDADES },
    { id: '5', name: 'Brócoli', stock: 40, type: ProductType.ORTALIZA, measurement: Measurement.KILOS },

    // VEGETALES (Vegetables)
    { id: '8', name: 'Col de Bruselas', stock: 20, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '10', name: 'Puerro', stock: 60, type: ProductType.VEGETABLE, measurement: Measurement.UNIDADES },
    { id: '14', name: 'Espárrago', stock: 30, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '15', name: 'Alcaucil', stock: 40, type: ProductType.VEGETABLE, measurement: Measurement.UNIDADES },
    { id: '16', name: 'Arvejas', stock: 50, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '17', name: 'Habas', stock: 45, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '20', name: 'Hinojo', stock: 35, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '26', name: 'Tomate', stock: 150, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '27', name: 'Pepino', stock: 70, type: ProductType.VEGETABLE, measurement: Measurement.UNIDADES },
    { id: '28', name: 'Zucchini', stock: 65, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '29', name: 'Berenjena', stock: 60, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '30', name: 'Morrón', stock: 80, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '36', name: 'Calabaza', stock: 80, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '37', name: 'Batata', stock: 90, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '39', name: 'Choclo', stock: 100, type: ProductType.VEGETABLE, measurement: Measurement.UNIDADES },
    { id: '43', name: 'Papa', stock: 300, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '44', name: 'Cebolla', stock: 250, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '45', name: 'Zanahoria', stock: 180, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },
    { id: '47', name: 'Ajo', stock: 120, type: ProductType.VEGETABLE, measurement: Measurement.UNIDADES },
    { id: '50', name: 'Remolacha', stock: 80, type: ProductType.VEGETABLE, measurement: Measurement.KILOS },

    // OTROS
    { id: '38', name: 'Hongo', stock: 50, type: ProductType.OTHER, measurement: Measurement.KILOS },
  ]);

  stockFiltered = signal<Product[]>([]);

  // Categorías fijas
  categories = [
    ProductType.FRUIT,
    ProductType.VEGETABLE,
    ProductType.ORTALIZA,
    ProductType.OTHER
  ];

  hoveredCategory = signal<ProductType | null>(null);

  ngOnInit(): void {
    this.stockFiltered.set(this.localManagerService.loadStockList());
  }

  // --------------------- MENU STATE ---------------------
  menuOpen = signal(false);
  menuHovering = signal(false);
  private hoverTimeout: any;

  constructor(private host: ElementRef) { }

  // --------------------- LABELS ---------------------
  categoryLabel(type: ProductType): string {
    const map = {
      [ProductType.FRUIT]: 'Frutas',
      [ProductType.VEGETABLE]: 'Vegetales',
      [ProductType.ORTALIZA]: 'Ortalizas',
      [ProductType.OTHER]: 'Otros',
    };
    return map[type] || type;
  }

  productsByCategory(type: ProductType): Product[] {
    return this.products().filter(p => p.type === type);
  }

  // --------------------- MENU LOGIC ---------------------

  toggleMenu() {
    const open = !this.menuOpen();
    this.menuOpen.set(open);
    if (open) {
      // Default hover on first category if opening
      this.hoveredCategory.set(this.categories[0]);
    }
  }

  openMenu() {
    this.menuOpen.set(true);
    if (!this.hoveredCategory()) {
      this.hoveredCategory.set(this.categories[0]);
    }
  }

  enterMenu() {
    clearTimeout(this.hoverTimeout);
    this.menuHovering.set(true);
  }

  leaveMenu() {
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      this.menuHovering.set(false);
      this.menuOpen.set(false);
    }, 120);
  }

  setHoveredCategory(type: ProductType | null) {
    this.hoveredCategory.set(type);
  }

  // --------------------- STOCK ---------------------

  addAllCategoryProduct(type: ProductType) {
    const toAdd = this.products().filter(
      p => p.type === type && !this.stockFiltered().some(s => s.id === p.id)
    );
    if (!toAdd.length) return;
    this.stockFiltered.update(prev => [...prev, ...toAdd]);
    this.localManagerService.saveStockList(this.stockFiltered());
  }

  removeCategoryProduct(type: ProductType) {
    // Remove all products of this type from the filtered list
    this.stockFiltered.update(prev => prev.filter(p => p.type !== type));
    this.localManagerService.saveStockList(this.stockFiltered());
  }

  addOneProduct(product: Product) {
    if (this.stockFiltered().some(p => p.id === product.id)) return;
    this.stockFiltered.update(prev => [...prev, { ...product }]);
    this.localManagerService.saveStockList(this.stockFiltered());
  }

  removeOneProduct(id: string) {
    this.stockFiltered.update(prev => prev.filter(p => p.id !== id));
    this.localManagerService.saveStockList(this.stockFiltered());
  }

  editProduct(product: Product) {
    this.modalService.open(EditComponent, product);
  }

  saveStock() {
    this.modalService.open(SaveStockComponent, this.stockFiltered());
  }

  // --------------------- OUTSIDE CLICK ---------------------

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (!this.menuHovering() && !this.host.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.menuOpen.set(false);
  }
}
