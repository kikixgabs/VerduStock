import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@app/global/services/auth-service/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', { nonNullable: true, validators: [Validators.email, Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  loginError = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.loginError.set(false);
    this.isLoading.set(true);

    try {
      // firstValueFrom esperará a que el login Y el perfil estén listos
      const success = await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));

      if (success) {
        await this.router.navigate(['/stock-control']);
      }
    } catch (error: any) {
      this.isLoading.set(false);
      if (error.status === 401) {
        this.loginError.set(true);
      } else {
        console.error('Error de conexión:', error);
      }
    }
  }
}