import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServicesService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async loadingTrue(message: string = 'Cargando...') {
    if (!this.loading) { // Evitar crear múltiples loadings
      this.loading = await this.loadingController.create({
        message,
        spinner: 'circles'
      });
      await this.loading.present();
    }
  }

  async loadingFalse() {
    console.log('si')
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
      console.log('entro')
    }
  }
}
