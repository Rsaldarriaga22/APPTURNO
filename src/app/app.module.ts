import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AgenciaService } from './services/agencia.service';
import { UsuariosService } from './services/usuarios.service';
import { HttpClientModule } from '@angular/common/http';
import { LoadingServicesService } from './services/loading-services.service';
import { AlertService } from './services/alert.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    AlertService,
  LoadingServicesService,
  AgenciaService,
  UsuariosService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
