import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { UrlApi } from '../api/url';
import { finalize, Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AgenciaService {

  $loading: WritableSignal<boolean> = signal(false);
  public url: string;
  
  constructor(private _http: HttpClient) {
    this.url = UrlApi.url;
  }

  listaAgencia(): Observable<any> {
    this.$loading.set(true);
    let datos = this.url + 'listaAgencia';
    return this._http.get(datos).pipe(
      tap(() => this.$loading.set(true)),
      finalize(() => this.$loading.set(false))
    );
  }


  postAgencias(agnombre: string, agid: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post<any>(`${this.url}/getAgencia/${agnombre}/${agid}`, null, { headers: headers });
  }
}
