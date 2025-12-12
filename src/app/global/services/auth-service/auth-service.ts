import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { tap } from 'rxjs';

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

  currentUser = signal<any>(null);

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUser.set(JSON.parse(user));
      }
    }
  }

  isLoggedIn() {
    return !!this.currentUser();
  }

  login(credentials: LoginCredentials) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.currentUser.set(response);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response));
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
}
