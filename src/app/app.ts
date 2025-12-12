import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalManagerService } from './private/services/local-manager-service/local-manager-service';
import { ToastComponent } from './global/components/toast-component/toast-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('VerduStock');

}
