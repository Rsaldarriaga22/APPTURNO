import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceB {

  constructor(private alertController: AlertController) {}

  async showAlert(header: string, subHeader: string, message: string, buttons: AlertButton[]) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons
    });

    await alert.present();

    // Espera a que se cierre el alert y luego devuelve el valor del botón que fue presionado
    return new Promise<string>(resolve => {
      alert.onDidDismiss().then(({ role }) => {
        resolve(role!);
      });
    });
  }

  async sweetAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question', showCancel: boolean = false) {
    // Obtener el color del icono basado en el tipo

    const result = await Swal.fire({
      title: title,
      html: text,
      icon: icon,
      iconColor: icon == 'success' ? '#77b735' : icon == 'info' ? '#203b79' : '',
      showCancelButton: showCancel,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#203b79',
      // width: '100%',
      heightAuto: false, // Impide que ajuste la altura automáticamente
    });
    return result;
  }

  async sweetAlertImage(title: string, text: string, urlImg: string, widthImg: number, heightImg: number, altImg: string, showCancel: boolean = false) {
    const result = await Swal.fire({
      title: title,
      html: text,
      imageUrl: urlImg,
      imageWidth: widthImg,
      imageHeight: heightImg,
      imageAlt: altImg,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#203b79',
      showCancelButton: showCancel,
      // width: '100%',
      heightAuto: false
    });
    return result;
  }

}
