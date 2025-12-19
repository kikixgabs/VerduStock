import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, Status } from '../../models/receipts-model';
import { ModalService } from '../../../global/services/modal-service/modal-service';

// 1. Importamos librerías
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

  // Estado para el botón
  isGeneratingPdf = false;

  constructor(@Inject('MODAL_DATA') public data: Receipt) {
    this.receipt = data;
  }

  close() {
    this.modalService.close();
  }

  convertToPdf() {
    this.isGeneratingPdf = true;

    // 2. Buscamos la PLANTILLA FANTASMA por su ID
    const data = document.getElementById('mp-pdf-template');

    if (data) {
      // 3. Renderizamos el elemento oculto
      html2canvas(data, {
        scale: 3, // Alta calidad
        useCORS: true,
        logging: false
      }).then((canvas) => {

        const imgWidth = 210; // A4 ancho mm
        const pageHeight = 297; // A4 alto mm

        // Calculamos altura proporcional
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');

        // Un pequeño margen superior
        const position = 10;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`Comprobante-${this.receipt.payment_id}.pdf`);

        this.isGeneratingPdf = false;
      }).catch(err => {
        console.error("Error generando PDF", err);
        this.isGeneratingPdf = false;
      });
    } else {
      console.error("No se encontró la plantilla de recibo");
      this.isGeneratingPdf = false;
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