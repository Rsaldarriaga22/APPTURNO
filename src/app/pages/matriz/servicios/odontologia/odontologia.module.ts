import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OdontologiaPageRoutingModule } from './odontologia-routing.module';

import { OdontologiaPage } from './odontologia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OdontologiaPageRoutingModule
  ],
  declarations: [OdontologiaPage]
})
export class OdontologiaPageModule {}
