import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
@Component({
  selector: 'app-mp-callback',
  imports: [],
  templateUrl: './mp-callback.html',
  styleUrl: './mp-callback.css',
})
export class MpCallback implements OnInit {

  private environment = environment;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  status: 'loading' | 'success' | 'error' = 'loading';
  errorMessage?: string;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const error = params['error'];

      if (code) {
        this.sendCodeToBackend(code);
      } else if (error) {
        this.status = 'error';
        this.errorMessage = 'Cancelaste la vinculacion';
      } else {
        this.status = 'error';
        this.errorMessage = 'No se proporciono un codigo valido';
      }
    })
  }

  sendCodeToBackend(code: string) {
    const url = `${environment.apiUrl}/user/mercadopago/link`
    this.http.post(url, { code }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.status = 'success';
      },
      error: (err: any) => {
        this.status = 'error';
        this.errorMessage = err.error.message || 'Error al vincular Mercado Pago';
      }
    });
  }

  goHome() {
    this.router.navigate(['/private']);
  }

}
