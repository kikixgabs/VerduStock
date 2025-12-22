import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { tap, catchError, of, map, Observable } from 'rxjs'; // Importamos operadores RxJS necesarios
import { UserModel } from '@app/private/models/index';

interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  http = inject(HttpClient);

  // Signal principal del usuario
  currentUser = signal<UserModel | null>(null);

  // Signal para saber si estamos verificando sesión (útil para spinners de carga inicial)
  isCheckingAuth = signal<boolean>(true);

  constructor() {
    // Ya no dependemos de localStorage para la persistencia crítica,
    // pero podemos mantenerlo como respaldo visual rápido si quieres.
    // La verdad verdadera vendrá de checkAuthStatus()
  }

  isLoggedIn() {
    return !!this.currentUser();
  }

  // ✅ NUEVO MÉTODO CRÍTICO: Verifica si hay cookie válida al iniciar la app
  checkAuthStatus(): Observable<boolean> {
    this.isCheckingAuth.set(true);
    return this.http.get<{ user: UserModel }>(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      map((response) => {
        if (response && response.user) {
          // Si el backend dice OK, guardamos el usuario
          this.updateUser(response.user);
          return true;
        }
        return false;
      }),
      catchError(() => {
        // Si falla (401), limpiamos todo por seguridad
        this.logout();
        return of(false);
      }),
      tap(() => this.isCheckingAuth.set(false))
    );
  }

  getProfile() {
    return this.http.get<{ user: UserModel }>(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      tap((response: any) => {
        const user = response.user || response;
        this.updateUser(user);
      })
    );
  }

  login(credentials: LoginCredentials) {
    // Importante: withCredentials: true para que la cookie se guarde
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        // Al loguear, hacemos un fetch inmediato del perfil completo para tener el estado de MP
        // O si el login ya devuelve el user completo, úsalo.
        // Por seguridad, llamamos a checkAuthStatus tras el login exitoso
        this.checkAuthStatus().subscribe();
      })
    );
  }

  logout() {
    // 1. Limpieza local inmediata (para que la UI reaccione rápido)
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
      // Token ya no se usa en local, es cookie httpOnly
    }

    // 2. Avisar al backend para borrar la cookie
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
  }

  private updateUser(user: UserModel) {
    this.currentUser.set(user);
    // Guardar en localStorage solo como caché visual, no como fuente de verdad
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}