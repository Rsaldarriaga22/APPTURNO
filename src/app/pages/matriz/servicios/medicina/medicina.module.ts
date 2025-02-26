import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicinaPageRoutingModule } from './medicina-routing.module';

import { MedicinaPage } from './medicina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicinaPageRoutingModule
  ],
  declarations: [MedicinaPage]
})
export class MedicinaPageModule {}
