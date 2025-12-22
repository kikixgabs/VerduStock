import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // ✅ Importamos Router
import { StockService } from '@app/private/services/stock-service/stock-service';
import { AuthService } from '@app/global/services/auth-service/auth-service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private stockService = inject(StockService);
  private authService = inject(AuthService);
  private router = inject(Router); // ✅ Inyectamos el Router

  mercadoPagoConnected = computed(() => {
    const user = this.authService.currentUser();
    return !!user?.mpAccountConnected;
  });

  ngOnInit() {
    this.stockService.loadProducts();
  }

  connectMercadoPago() {
    const clientID = '8365811410735376';
    const redirectURI = 'https://kikixgabs.github.io/VerduStock/callback.html';
    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${clientID}&response_type=code&platform_id=mp&redirect_uri=${redirectURI}`;
    window.location.href = authUrl;
  }

  // ✅ Nueva función de Logout
  logout() {
    this.authService.logout(); // Limpia la sesión
    this.router.navigate(['/login']); // Redirige al login
  }
}