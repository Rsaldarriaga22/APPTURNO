import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { SpinnerComponent } from '../util/spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

 
  constructor(
   
    private modalController: ModalController
  ) {}


  async presentModal(title: string,message: string,icon: string, color:string) {
    const modal = await this.modalController.create({
      component: SpinnerComponent,
      componentProps: { title, message, icon, color },
      cssClass: 'custom-modal-alert'
    });

     await modal.present();
    setTimeout(() => {
      modal.dismiss();
    }, 3000);
  }

  
}
