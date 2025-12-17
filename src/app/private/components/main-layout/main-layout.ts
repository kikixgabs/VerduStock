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
    const clientID = '8365811410735376'
    const redirectURI = 'https://kikixgabs.github.io/VerduStock/callback'
    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${clientID}&response_type=code&platform_id=mp&redirect_uri=${redirectURI}`;
    window.location.href = authUrl;
    this.mercadoPagoConnected.set(true);
  }

  constructor() {
    this.stockService.loadProducts();
  }
}
