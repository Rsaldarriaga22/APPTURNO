import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeluqueriaPage } from './peluqueria.page';

const routes: Routes = [
  {
    path: '',
    component: PeluqueriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeluqueriaPageRoutingModule {}
