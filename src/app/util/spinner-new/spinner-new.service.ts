import { inject, Injectable, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerNewService {

   private _spinner = inject(NgxSpinnerService);
  private message = signal('Cargando...');
  
  constructor() { }

  public setMessage(message: string): void {
    this.message.set(message);
  }

  public getMessage(): string {
    return this.message();
  }

  public show(newMessage: string = 'Cargando...'): void {    
    this.message.set(newMessage);
    this._spinner.show();
  }

  public hide(): void {
    this._spinner.hide();
  }
}
