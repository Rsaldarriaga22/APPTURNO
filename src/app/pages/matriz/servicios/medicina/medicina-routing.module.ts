import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicinaPage } from './medicina.page';

const routes: Routes = [
  {
    path: '',
    component: MedicinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicinaPageRoutingModule {}
