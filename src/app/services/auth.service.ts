import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { UrlApi } from '../api/url';
import { usuarioModel } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public url: string;
  $loading: WritableSignal<boolean> = signal(false);
  
  constructor(private _http: HttpClient) {
    this.url = UrlApi.url;
  }

  loginCalificar(cedula: string): Observable<any> {
    this.$loading.set(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + 'loginCalificar/' + cedula, { headers }).pipe(
      tap(() => this.$loading.set(true)),
      finalize(() => this.$loading.set(false))
    );
  }

  login(cedula: string): Observable<any> {
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + 'getlogin/' + cedula, { headers })
  }

  getAll(): Observable<usuarioModel> {
    let datos = this.url + 'getlogin';
    return this._http.get<usuarioModel>(datos)
  }






}
