import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { tap } from 'rxjs';
import { UserModel } from '@app/private/models/index'; // Asegúrate de importar tu interfaz

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

  // Usamos tu interfaz UserModel para tener autocompletado
  currentUser = signal<UserModel | null>(null);

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          if (parsedUser && typeof parsedUser === 'object') {
            this.currentUser.set(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing user from local storage', error);
          localStorage.removeItem('user');
        }
      }
    }
  }

  isLoggedIn() {
    return !!this.currentUser();
  }

  // ✅ NUEVO: Método para refrescar los datos del usuario desde el backend
  // Se llama al iniciar la app y cuando vuelves de Mercado Pago
  getProfile() {
    // Asumiendo que tu backend responde esto en /auth/me
    return this.http.get<{ user: UserModel }>(`${this.apiUrl}/auth/me`).pipe(
      tap((response: any) => {
        // A veces el backend devuelve { user: ... } o directo el objeto. Ajusta según tu backend.
        // Basado en tu código Go anterior: c.JSON(200, gin.H{"user": ...})
        const user = response.user || response;

        this.updateUser(user);
      })
    );
  }

  login(credentials: LoginCredentials) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Ajusta si tu login devuelve { user: ..., token: ... }
        const user = response.user || response;
        this.updateUser(user);
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
      // También borramos el token si lo guardaras aparte
      localStorage.removeItem('token');
    }
  }

  // Helper privado para no repetir código
  private updateUser(user: UserModel) {
    this.currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}