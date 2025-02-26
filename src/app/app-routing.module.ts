import { NgModule } from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  {
    path: '',
    redirectTo: 'home-matriz',
    pathMatch: 'full'
  },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    path: 'home-matriz',
    loadChildren: () => import('./pages/matriz/home-matriz/home-matriz.module').then( m => m.HomeMatrizPageModule)
  },
  {
    path: 'socio',
    loadChildren: () => import('./pages/matriz/socio/socio.module').then( m => m.SocioPageModule)
  },

  {
    path: 'cliente',
    loadChildren: () => import('./pages/matriz/cliente/cliente.module').then( m => m.ClientePageModule)
  },
  {
    path: 'peluqueria',
    loadChildren: () => import('./pages/matriz/servicios/peluqueria/peluqueria.module').then( m => m.PeluqueriaPageModule)
  },
  {
    path: 'medicina',
    loadChildren: () => import('./pages/matriz/servicios/medicina/medicina.module').then( m => m.MedicinaPageModule)
  },
  {
    path: 'odontologia',
    loadChildren: () => import('./pages/matriz/servicios/odontologia/odontologia.module').then( m => m.OdontologiaPageModule)
  },
 
 
  
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
