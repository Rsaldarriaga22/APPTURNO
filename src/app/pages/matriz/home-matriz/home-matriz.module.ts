import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMatrizPageRoutingModule } from './home-matriz-routing.module';

import { HomeMatrizPage } from './home-matriz.page';

import { SpinnerModule } from 'src/app/util/spinner/spinner.module';
import { RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomeMatrizPageRoutingModule,
    RouterOutlet,
    
    // BrowserAnimationsModule,
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomeMatrizPage]
})
export class HomeMatrizPageModule {}
