import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast-service/toast-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
})
export class ToastComponent {
  toastService = inject(ToastService);

  get toasts() {
    return this.toastService.toasts();
  }
}
