import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LoadingServicesService } from 'src/app/services/loading-services.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: false
})
export class SpinnerComponent   {
  @Input() title: string = 'Alerta';
  @Input() icon: string = '';
  @Input() message: string = '';
  @Input() color: string = '';

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

 
}
