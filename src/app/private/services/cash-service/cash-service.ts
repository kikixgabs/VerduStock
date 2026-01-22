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

  checkPendingBoxes() {
    return this.http.get<PendingBox[]>(`${this.apiUrl}/cash/pending`, { withCredentials: true });
  }
  addSell(sell: Partial<Sell>) {
    return this.http.post<Sell>(`${this.apiUrl}/sells`, sell, { withCredentials: true });
  }

  getOpenSells() {
    return this.http.get<Sell[]>(`${this.apiUrl}/sells?status=open`, { withCredentials: true });
  }
  getClosedSells() {
    return this.http.get<Sell[]>(`${this.apiUrl}/sells?status=closed`, { withCredentials: true });
  }

  updateSell(sell: Sell) {
    return this.http.put<Sell>(`${this.apiUrl}/sells/${sell.id}`, sell, { withCredentials: true });
  }
  closeCashRegister() {
    return this.http.post(`${this.apiUrl}/sells/close`, {}, { withCredentials: true });
  }
}