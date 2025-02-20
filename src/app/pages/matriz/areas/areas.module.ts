import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreasPageRoutingModule } from './areas-routing.module';

import { AreasPage } from './areas.page';
import { SpinnerModule } from 'src/app/util/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreasPageRoutingModule,
    //  SpinnerModule,
  ],
  declarations: [AreasPage]
})
export class AreasPageModule {}
