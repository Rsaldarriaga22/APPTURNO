import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { UrlApi } from '../api/url';
import { finalize, Observable, tap } from 'rxjs';
import { areaModel } from '../models/area';
import { codigoModel } from '../models/codigo';
import { ApiCorreo } from '../models/correoapi';
import { usuarioModel } from '../models/users';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  $loading: WritableSignal<boolean> = signal(false);
  $loadingGenerarTurno: WritableSignal<boolean> = signal(false);
  public url: string;


  constructor(private _http: HttpClient) {
    this.url = UrlApi.url;
  }
  

  listarArea(agid: string): Observable<any> {
    let datos = this.url + `listaArea/${agid}`;
    return this._http.get<areaModel>(datos)
  }

  getArea(agnombre: string, agid: string): Observable<any> {

    let datos = this.url + `getArea/${agnombre}/${agid}`;
    return this._http.get<areaModel>(datos)
    
  }


  verificarCorreo(): Observable<any> {
    let datos = `https://sistemflm.futurolamanense.fin.ec:8088/api/get-cliente-si-existe/`;
    return this._http.get<ApiCorreo>(datos)
  }



  verificar(cedula: any): Observable<any> {
    let datos = `https://sistemflm.futurolamanense.fin.ec:8088/api/get-cliente-si-existe/${cedula}`;
    return this._http.get<ApiCorreo>(datos)
  }


  verificarCliente(cedula: any): Observable<any> {
    let datos = `https://sistemflm.futurolamanense.fin.ec:8088/api/get-cliente-si-existe/${cedula}`;
    return this._http.get<ApiCorreo>(datos)
  }

  getCodigo(): Observable<any> {
    let datos = this.url + 'getCodigo';
   
    return this._http.get<codigoModel>(datos)
  }

  crearTurno(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'createTurno', data, { headers })

  }

  updateCalificacion(nombre: any, id: any): Observable<any> {
    return this._http.post(this.url + 'updateCalificacion/' + nombre + '/' + id,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  createCalificacionEmail(nombre: string, id: string): Observable<any> {
    return this._http.post(this.url + 'createCalificacionEmail/' + nombre + '/' + id,
      {
        headers: {
         "Content-Type": "application/json",
        }
      }
    )
  }

  createUsuario(data: usuarioModel): Observable<any> {
    this.$loading.set(true);
    return this._http.post(this.url + 'create', data,
    ).pipe(tap(() => this.$loading.set(true)),
      finalize(() => this.$loading.set(false))
    );
  }
}
