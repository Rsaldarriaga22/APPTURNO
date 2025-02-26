import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OdontologiaPage } from './odontologia.page';

const routes: Routes = [
  {
    path: '',
    component: OdontologiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OdontologiaPageRoutingModule {}
