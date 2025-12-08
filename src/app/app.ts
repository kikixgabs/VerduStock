import { Component, inject, signal } from '@angular/core';
import { MainLayout } from "./private/components/main-layout/main-layout";
import { LocalManagerService } from './private/services/local-manager-service/local-manager-service';
import { ToastComponent } from './global/components/toast-component/toast-component';

@Component({
  selector: 'app-root',
  imports: [MainLayout, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('VerduStock');

}
