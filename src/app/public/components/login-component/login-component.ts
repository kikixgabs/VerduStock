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
  // ✅ Nueva señal para controlar el estado de carga
  isLoading = signal<boolean>(false);

  async onSubmit() {
    this.loginError.set(false);
    if (this.loginForm.invalid) return;

    // Activamos carga
    this.isLoading.set(true);

    try {
      await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));
      this.router.navigate(['/stock-control']);
      // No hace falta poner false aquí porque navegamos a otra página
    } catch (error: any) {
      // Si falla, desactivamos carga para que pueda intentar de nuevo
      this.isLoading.set(false);

      if (error.status === 401) {
        this.loginError.set(true);
      }
      console.log(error);
    }
  }
}