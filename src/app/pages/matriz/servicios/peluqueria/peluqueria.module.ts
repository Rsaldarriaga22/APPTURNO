import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeluqueriaPageRoutingModule } from './peluqueria-routing.module';

import { PeluqueriaPage } from './peluqueria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeluqueriaPageRoutingModule
  ],
  declarations: [PeluqueriaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PeluqueriaPageModule {}
