import { Component, HostListener, ElementRef, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductType, Measurement } from '../../models/index';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { StockService } from '@app/private/services/stock-service/stock-service';
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

  stockService = inject(StockService);
  modalService = inject(ModalService);

  // --------------------- PRODUCTOS ---------------------
  products = this.stockService.products;

  stockFiltered = computed(() => this.products().filter(p => p.loaded));

  // Categorías fijas
  categories = [
    ProductType.FRUIT,
    ProductType.VEGETABLE,
    ProductType.ORTALIZA,
    ProductType.OTHER
  ];

  hoveredCategory = signal<ProductType | null>(null);

  ngOnInit(): void {
    // Data is loaded in MainLayout
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
      p => p.type === type && !p.loaded
    );

    if (!toAdd.length) return;

    // Sync with backend (one by one as per current API)
    toAdd.forEach(p => {
      this.stockService.updateProduct({ ...p, loaded: true }).subscribe();
    });
  }

  removeCategoryProduct(type: ProductType) {
    const toRemove = this.products().filter(
      p => p.type === type && p.loaded
    );

    if (!toRemove.length) return;

    toRemove.forEach(p => {
      this.stockService.updateProduct({ ...p, loaded: false }).subscribe();
    });
  }

  addOneProduct(product: Product) {
    if (product.loaded) return;
    this.stockService.updateProduct({ ...product, loaded: true }).subscribe();
  }

  removeOneProduct(id: string) {
    const product = this.products().find(p => p.id === id);
    if (!product || !product.loaded) return;
    this.stockService.updateProduct({ ...product, loaded: false }).subscribe();
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
