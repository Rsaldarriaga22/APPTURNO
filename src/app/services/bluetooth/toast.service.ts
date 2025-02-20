import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) { }

  async presentToast(
    message: string,
    duration: number = 2000,
    position: "bottom" | "top" | "middle" = "bottom",
    color: string = 'dark'
  ): Promise<void> { 
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position, // Ahora está definido correctamente
      color: color, // Puedes personalizar el color
      cssClass: 'custom-toast', // Clase CSS opcional para estilos personalizados
    });
    await toast.present();
  }
}
