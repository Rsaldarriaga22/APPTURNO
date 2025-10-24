import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApi } from '../api/url';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Persona } from '../models/Persona';
import { Cliente } from '../models/Cliente';
import { Solicitud } from '../models/Solicitud';
import { LoadingController } from '@ionic/angular';
import { finalize, tap } from 'rxjs/operators';
import { LoadingServicesService } from './loading-services.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class PeluqueriaService {
  public urlGo: string;
  public cargando: any = null;

  constructor(
    private spinner: NgxSpinnerService,
    private loaginServices: LoadingServicesService,
    private _http: HttpClient,
    private loadingController: LoadingController
  ) {
    this.urlGo = UrlApi.base_url_api_go_turnos;
  }


  async cargarDatos() {
    this.cargando = await this.loadingController.create({
      message: 'Cargandoh...',
      spinner: 'circles',
    });
    try {

      console.log('ddservicio')

    } catch (error) {
      console.error(error);
    } finally {
      this.cargando.dismiss();
    }
  }

  verificarSeguroMortuorio(identificacion: string): Observable<any> {
    return this._http.get(this.urlGo + 'verificar-seguro-mortuorio/' + identificacion);
  }

  actualizarTipocuentaTipoSeguro(identificacion: string, tipocuenta: string, tiposeguro: any): Observable<any> {
    return this._http.get(this.urlGo + 'actualizar-tipo-cuenta/' + identificacion + '/' + tipocuenta + '/' + tiposeguro);
  }

  getpersonaPorCedula(identificacion: string): Observable<any> {
    return this._http.get(this.urlGo + 'persona-por-cedula/' + identificacion);
  }

  createPersona(data: Persona): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.urlGo + 'persona', params, { headers: headers });
  }
  createCliente(data: Cliente): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.urlGo + 'cliente', params, { headers: headers });
  }
  getClientePorId(idpersona: number): Observable<any> {
    return this._http.get(this.urlGo + 'cliente-one/' + idpersona);
  }
  getIdClientePorIdentificacion(identificacion: string): Observable<any> {
    return this._http.get(this.urlGo + 'cliente-id-poridentificacion/' + identificacion);
  }
  getSolicitudPorCliente(idcliente: number, idservicio: number): Observable<any> {
    return this._http.get(this.urlGo + 'solicitudes-por-cliente/' + idcliente + '/' + idservicio);
  }

  getUltimaSolicitudPorCliente(idcliente: number, idservicio: number): Observable<any> {
    return this._http.get(this.urlGo + 'ultima-solicitud-cliente/' + idcliente + '/' + idservicio);
  }

  getAllPeluqueria(): Observable<any> {
    return this._http.get(this.urlGo + 'sucursales-peluqueria');
  }

  getSolicitudPorFechaTurno(fechaturno: string, idservicio: number): Observable<any> {
    return this._http.get(this.urlGo + 'solicitudes-por-fecha/' + fechaturno + '/' + idservicio);
  }

  getCount(idservicio: number): Observable<any> {
    //  this.loaginServices.loadingTrue();
    return this._http.get(this.urlGo + 'horarios-count/' + idservicio)

  }
  deleteSolicitud(idsolicitud: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete(this.urlGo + 'eliminar-solicitud/' + idsolicitud, { headers: headers });
  }

  createSolicitud(data: Solicitud): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.urlGo + 'solicitud', params, { headers: headers });
  }
  notificar(email: string, fecha: string, servicio: string, nombres: string): Observable<any> {
    return this._http.get(this.urlGo + 'enviar-email/' + email + '/' + fecha + '/' + servicio + '/' + nombres);
  }

  getall(idservicio: number): Observable<any> {
    return this._http.get(this.urlGo + 'horarios/' + idservicio)
  }

  suspenderDias(idServicio: number): Observable<any> {
     return this._http.get(this.urlGo + 'dias-no-laborables/' + idServicio)
  }


  // private nume = [23]

  // suspenderDias(): Observable<any> {
  //      return of(this.nume)
  // }
    









}
