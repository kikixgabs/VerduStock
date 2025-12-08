import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Measurement } from '@app/private/models/index';
import { ModalService } from '@app/global/services/modal-service/modal-service';
import { LocalManagerService } from '@app/private/services/local-manager-service/local-manager-service';

@Component({
  selector: 'app-edit-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-component.html',
  styleUrl: './edit-component.css',
})
export class EditComponent {

  localManagerService = inject(LocalManagerService);

  constructor(
    @Inject('MODAL_DATA') public data: any,
    private modalService: ModalService
  ) { }

  measurements = Object.values(Measurement);

  close() {
    this.localManagerService.updateProduct(this.data);
    this.modalService.close();
  }
}
