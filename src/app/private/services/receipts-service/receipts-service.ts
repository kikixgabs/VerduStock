// receipts.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { Receipt, Status } from '../../models/receipts-model';

@Injectable({
  providedIn: 'root',
})
export class ReceiptsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  syncTransfers() {
    return this.http.post<{ message: string, new: number }>(
      `${this.apiUrl}/payments/sync`,
      {},
      { withCredentials: true }
    );
  }

  getReceipts() {
    return this.http.get<any[]>(`${this.apiUrl}/payments`, { withCredentials: true }).pipe(
      map(payments => {
        return payments.map(payment => {

          let status = Status.PENDING;
          if (payment.status === 'approved') status = Status.COMPLETED;
          if (payment.status === 'rejected' || payment.status === 'cancelled') status = Status.CANCELLED;

          // ✅ LÓGICA DE NOMBRE MEJORADA
          // Si el backend nos da un nombre real (payerName), lo usamos.
          // Si no, hacemos fallback al truco del email.
          let displayName = payment.payerName;

          if (!displayName || displayName === 'Desconocido' || displayName.trim() === '') {
            const raw = payment.payerEmail || 'Anónimo';
            displayName = raw.split('@')[0];
          }

          return {
            amount: payment.amount,
            date: payment.receivedAt,
            payment_id: payment.mpPaymentId.toString(),
            operationNumber: 'MP-' + payment.mpPaymentId,
            personData: {
              name: displayName, // ✅ Usamos el nombre inteligente
              email: payment.payerEmail
            },
            status: status
          } as Receipt;
        });
      })
    );
  }
}