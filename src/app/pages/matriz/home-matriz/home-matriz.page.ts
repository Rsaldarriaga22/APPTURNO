import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOCAL_STORAGE_KEY } from 'src/app/api/url';
import { AlertService } from 'src/app/services/alert.service';
import { AlertServiceB } from 'src/app/services/bluetooth/alertB.service';
import { BluetoothService } from 'src/app/services/bluetooth/bluetooth.service';
import { LoadingServicesService } from 'src/app/services/loading-services.service';
// import { LoadingServicesService } from 'src/app/services/loading-services.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ValidacionCedulaService } from 'src/app/services/validacion-cedula.service';

@Component({
  selector: 'app-home-matriz',
  templateUrl: './home-matriz.page.html',
  styleUrls: ['./home-matriz.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class HomeMatrizPage implements OnInit {

  SOCIO: any
  inputValue: string = '';
  numeros: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  constructor(
    private _router: Router,
    private userServices: UsuariosService,
    private alerta: AlertService,
     private loaginServices: LoadingServicesService,
    private validadorCedula: ValidacionCedulaService,




        private bluetoothOperationsService: BluetoothService,
        private alertaBluetooth: AlertServiceB,
  ) { }

  async ngOnInit() {

  }

  agregarNumero(num: string) {
    if (this.inputValue.length < 10) {
      this.inputValue += num;
    }
  }

  // 0500008586
  async buscar() {
     this.loaginServices.show()
     const vaCedula = this.validadorCedula.validadorDeCedula(this.inputValue)
     if (vaCedula) {
       this.userServices.verificar(this.inputValue).subscribe(
         async (resp) => {
          console.log('reeer', resp)
           this.loaginServices.hide()
           if (resp.response) {
             localStorage.setItem('cedula', this.inputValue);
             const usuarioString = JSON.stringify(resp.response);
             localStorage.setItem('usuario', usuarioString);
             this._router.navigate(['/socio']);
             this.inputValue = ''
            } else {
              this.loaginServices.hide()
              localStorage.setItem('cedula', this.inputValue);
              this._router.navigate(['/cliente']);
              this.inputValue = ''
            }
          },
          async (error) => {
          console.log('mi id', error)
          this.loaginServices.hide()
        }
      );
    } else {
      this.loaginServices.hide()
      this.alerta.presentModal('¡Atención!', 'Cédula incorrecta. Verifique e intente nuevamente.', 'alert-circle-outline', 'warning');
    }
  }

  borrar() {
    this.inputValue = this.inputValue.slice(0, -1);
  }

  formatDate(dateString?: string): string {
  const date = dateString ? moment.utc(dateString, moment.ISO_8601, true) : moment.utc();
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm') : '';
}


 

}
