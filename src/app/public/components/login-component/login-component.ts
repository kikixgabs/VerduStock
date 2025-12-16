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

  async onSubmit() {
    this.loginError.set(false);
    if (this.loginForm.invalid) return;

    try {
      await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));
      this.router.navigate(['/stock-control']);
    } catch (error: any) {
      if (error.status === 401) {
        this.loginError.set(true);
      }
      console.log(error);
    }
  }

}
