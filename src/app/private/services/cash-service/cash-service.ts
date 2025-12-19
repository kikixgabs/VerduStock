import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Sell } from '../../models/sells-models';
export interface PendingBox {
  date: string;
  totalAmount: number;
  count: number;
  sells: Sell[];
}

@Injectable({
  providedIn: 'root',
})
export class CashService {
  private apiUrl = environment.apiUrl;
  http = inject(HttpClient);

  // 1. Verificar Cajas Pendientes (NUEVO)
  checkPendingBoxes() {
    return this.http.get<PendingBox[]>(`${this.apiUrl}/cash/pending`, { withCredentials: true });
  }

  // 2. Añadir Venta
  addSell(sell: Partial<Sell>) {
    return this.http.post<Sell>(`${this.apiUrl}/sells`, sell, { withCredentials: true });
  }

  // 3. Ver Ventas del Día (Abiertas)
  getOpenSells() {
    return this.http.get<Sell[]>(`${this.apiUrl}/sells?status=open`, { withCredentials: true });
  }

  // 4. Ver Historial (Cerradas)
  getClosedSells() {
    return this.http.get<Sell[]>(`${this.apiUrl}/sells?status=closed`, { withCredentials: true });
  }

  // 5. Editar Venta
  updateSell(sell: Sell) {
    return this.http.put<Sell>(`${this.apiUrl}/sells/${sell.id}`, sell, { withCredentials: true });
  }

  // 6. Cerrar Caja
  closeCashRegister() {
    return this.http.post(`${this.apiUrl}/sells/close`, {}, { withCredentials: true });
  }
}