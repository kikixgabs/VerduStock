import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Product } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = environment.apiUrl;
  http = inject(HttpClient);

  // State
  private productsSignal = signal<Product[]>([]);
  readonly products = this.productsSignal.asReadonly();

  loadProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/stock`).subscribe(this.productsSignal.set);
  }

  getProducts() {
    return this.productsSignal();
  }

  updateProduct(product: Product) {
    // Optimistic update
    this.productsSignal.update(prev =>
      prev.map(p => p.id === product.id ? product : p)
    );
    return this.http.put(`${this.apiUrl}/stock/${product.id}`, product);
  }

  createProduct(product: Product) {
    return this.http.post<Product>(`${this.apiUrl}/stock`, product).pipe(
      tap(newProduct => this.productsSignal.update(prev => [...prev, newProduct]))
    );
  }
}
