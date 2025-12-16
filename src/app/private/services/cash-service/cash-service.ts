import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Sell } from '../../models/sells-models';

@Injectable({
  providedIn: 'root',
})
export class CashService {
  private apiUrl = environment.apiUrl;
  http = inject(HttpClient);

  // Añadir Venta: POST /sells
  addSell(sell: Partial<Sell>) {
    return this.http.post<Sell>(`${this.apiUrl}/sells`, sell);
  }

  // Ver Ventas del Día: GET /sells?status=open
  getOpenSells() {
    return this.http.get<Sell[]>(`${this.apiUrl}/sells?status=open`);
  }

  // Ver Ventas Anteriores: GET /sells?status=closed
  getClosedSells() {
    return this.http.get<Sell[]>(`${this.apiUrl}/sells?status=closed`);
  }

  // Editar Venta: PUT /sells/{id}
  updateSell(sell: Sell) {
    return this.http.put<Sell>(`${this.apiUrl}/sells/${sell.id}`, sell);
  }

  // Cerrar Caja: POST /sells/close
  closeCashRegister() {
    return this.http.post(`${this.apiUrl}/sells/close`, {});
  }
}
