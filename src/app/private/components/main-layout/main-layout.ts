// main-layout.ts (Versión limpia)
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StockService } from '@app/private/services/stock-service/stock-service';
import { AuthService } from '@app/global/services/auth-service/auth-service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private stockService = inject(StockService);
  private authService = inject(AuthService);

  // Este computed es reactivo: Si authService.currentUser cambia (login/logout/checkStatus),
  // esto se actualiza solo.
  mercadoPagoConnected = computed(() => {
    const user = this.authService.currentUser();
    return !!user?.mpAccountConnected;
  });

  ngOnInit() {
    this.stockService.loadProducts();
    // No hace falta llamar a getProfile() aquí, el APP_INITIALIZER ya lo hizo al arrancar la app.
  }

  connectMercadoPago() {
    const clientID = '8365811410735376';
    // Asegúrate de que esta URL sea correcta para tu entorno (dev vs prod)
    const redirectURI = 'https://kikixgabs.github.io/VerduStock/callback.html';
    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${clientID}&response_type=code&platform_id=mp&redirect_uri=${redirectURI}`;
    window.location.href = authUrl;
  }
}