import { Component, computed, inject, OnInit } from '@angular/core'; // Importar computed y OnInit
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StockService } from '@app/private/services/stock-service/stock-service';
import { AuthService } from '@app/global/services/auth-service/auth-service'; // Importar AuthService

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private stockService = inject(StockService);
  private authService = inject(AuthService); // Inyectamos AuthService

  // ✅ CORRECCIÓN: Usamos computed()
  // "Si el usuario cambia en authService, recalculame esta variable automáticamente"
  mercadoPagoConnected = computed(() => {
    const user = this.authService.currentUser();
    // Asegúrate que tu interfaz UserModel tenga 'mpAccountConnected'
    return !!user?.mpAccountConnected;
  });

  ngOnInit() {
    this.stockService.loadProducts();

    // ✅ CLAVE: Pedimos los datos frescos al iniciar
    // Esto asegura que si recargas la página, verifiquemos en la base de datos si ya está conectado
    this.authService.getProfile().subscribe();
  }

  connectMercadoPago() {
    const clientID = '8365811410735376';
    // ✅ Apuntamos al archivo HTML puente
    const redirectURI = 'https://kikixgabs.github.io/VerduStock/callback.html';

    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${clientID}&response_type=code&platform_id=mp&redirect_uri=${redirectURI}`;
    window.location.href = authUrl;
  }
}