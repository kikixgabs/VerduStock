import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { tap, catchError, of, map, Observable, switchMap, finalize } from 'rxjs';
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
  private http = inject(HttpClient);

  currentUser = signal<UserModel | null>(null);
  isCheckingAuth = signal<boolean>(false);

  constructor() {
    // Verificamos si hay sesión en segundo plano al cargar el servicio
    this.checkAuthStatus().subscribe();
  }

  isLoggedIn() {
    return !!this.currentUser();
  }

  // Restauramos getProfile para compatibilidad
  getProfile(): Observable<boolean> {
    return this.checkAuthStatus();
  }

  checkAuthStatus(): Observable<boolean> {
    this.isCheckingAuth.set(true);
    return this.http.get<{ user: UserModel }>(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      map((response: any) => {
        const user = response.user || response;
        this.updateUser(user);
        return true;
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.logout();
        }
        return of(false);
      }),
      finalize(() => this.isCheckingAuth.set(false))
    );
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      switchMap(() => this.checkAuthStatus()),
      catchError((err) => {
        throw err;
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
  }

  private updateUser(user: UserModel) {
    this.currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}