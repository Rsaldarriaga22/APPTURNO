import { ChangeDetectorRef, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServicesService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async show(message: string = 'Cargando...') {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'circles', // Puedes cambiarlo a 'dots', 'crescent', etc.
        translucent: true,
        backdropDismiss: false,
      });
      await this.loading.present();
    }
  }
  async hide() {
    setTimeout( async ()=>{

      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
      }
    }, 1000)
  }
}
