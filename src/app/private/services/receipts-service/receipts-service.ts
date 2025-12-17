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

  getReceipts() {
    return this.http.get<any[]>(`${this.apiUrl}/payments`, { withCredentials: true }).pipe(
      map(payments => {
        // Transformamos el dato crudo del Backend (Go) al modelo visual del Frontend (Receipt)
        return payments.map(payment => {

          // Mapeo de estados de MP a tus estados visuales
          let status = Status.PENDING;
          if (payment.status === 'approved') status = Status.COMPLETED;
          if (payment.status === 'rejected' || payment.status === 'cancelled') status = Status.CANCELLED;

          return {
            amount: payment.amount,
            date: payment.receivedAt,
            payment_id: payment.mpPaymentId.toString(),
            operationNumber: 'MP-' + payment.mpPaymentId, // Generamos un nro de op visual
            personData: {
              // MP a veces no manda nombre en transferencias, usamos el email como fallback
              name: payment.payerEmail.split('@')[0],
              email: payment.payerEmail
            },
            status: status
          } as Receipt;
        });
      })
    );
  }
}
