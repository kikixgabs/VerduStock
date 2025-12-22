import { Component, Inject, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, Status } from '../../models/receipts-model';
import { ModalService } from '../../../global/services/modal-service/modal-service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-operation-details-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operation-details-component.html',
  styleUrl: './operation-details-component.css',
})
export class OperationDetailsComponent {
  receipt: Receipt;
  private modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef); // ✅ Inyectamos el detector de cambios

  isGeneratingPdf = false;

  constructor(@Inject('MODAL_DATA') public data: Receipt) {
    this.receipt = data;
  }

  close() {
    this.modalService.close();
  }

  convertToPdf() {
    this.isGeneratingPdf = true;

    // Forzamos detección para que aparezca "Generando..." inmediatamente
    this.cdr.detectChanges();

    const data = document.getElementById('mp-pdf-template');

    if (data) {
      html2canvas(data, {
        scale: 3,
        useCORS: true,
        logging: false
      }).then((canvas) => {

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 10;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`Comprobante-${this.receipt.payment_id}.pdf`);

        // ✅ Desactivamos loading y forzamos la actualización de la vista
        this.isGeneratingPdf = false;
        this.cdr.detectChanges();

      }).catch(err => {
        console.error("Error generando PDF", err);
        this.isGeneratingPdf = false;
        this.cdr.detectChanges(); // ✅ Forzamos update en caso de error también
      });
    } else {
      console.error("No se encontró la plantilla de recibo");
      this.isGeneratingPdf = false;
      this.cdr.detectChanges();
    }
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Status.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case Status.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}