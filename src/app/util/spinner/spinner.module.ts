import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerRoutingModule } from './spinner-routing.module';
import { SpinnerComponent } from './spinner.component';


@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    CommonModule,
    SpinnerRoutingModule
  ],
   exports: [
    SpinnerComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpinnerModule { }
