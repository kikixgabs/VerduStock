import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './global/interceptors/auth.interceptor';
import { loadingInterceptor } from './global/interceptors/loading.interceptor';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthService } from '@app/global/services/auth-service/auth-service';

// Función factoría para el inicializador
export function initializeApp(authService: AuthService) {
  return () => authService.checkAuthStatus(); // Devuelve el Observable
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, loadingInterceptor])),
    provideRouter(routes, withHashLocation()),
    provideClientHydration(withEventReplay()),

    // ✅ INYECTOR DE INICIO: Restaura la sesión al recargar F5
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService], // Inyecta AuthService en la función
    },
  ]
};