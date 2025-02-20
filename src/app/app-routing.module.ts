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
    path: 'areas',
    loadChildren: () => import('./pages/matriz/areas/areas.module').then( m => m.AreasPageModule)
  },
  {
    path: 'tipo-usuario',
    loadChildren: () => import('./pages/matriz/tipo-usuario/tipo-usuario.module').then( m => m.TipoUsuarioPageModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./pages/matriz/cliente/cliente.module').then( m => m.ClientePageModule)
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
