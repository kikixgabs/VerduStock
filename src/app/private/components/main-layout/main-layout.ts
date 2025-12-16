import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { StockService } from '@app/private/services/stock-service/stock-service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  stockService = inject(StockService);
  mercadoPagoConnected = signal(false); // Initial state: not connected

  connectMercadoPago() {
    // TODO: Implement actual OAuth flow with Mercado Pago
    // For demonstration, we'll just toggle it to true to show the 'Connected' state
    this.mercadoPagoConnected.set(true);
    alert('Simulación: Mercado Pago conectado exitosamente');
  }

  constructor() {
    this.stockService.loadProducts();
  }
}
