import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMatrizPage } from './home-matriz.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMatrizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMatrizPageRoutingModule {}
