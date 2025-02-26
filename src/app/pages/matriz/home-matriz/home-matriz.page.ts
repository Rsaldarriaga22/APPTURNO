import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingServicesService } from 'src/app/services/loading-services.service';
// import { LoadingServicesService } from 'src/app/services/loading-services.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ValidacionCedulaService } from 'src/app/services/validacion-cedula.service';

@Component({
  selector: 'app-home-matriz',
  templateUrl: './home-matriz.page.html',
  styleUrls: ['./home-matriz.page.scss'],
  standalone: false
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
    private validadorCedula: ValidacionCedulaService
  ) { }

  async ngOnInit() {

  }

  agregarNumero(num: string) {
    if (this.inputValue.length < 10) {
      this.inputValue += num;
    }
  }

  async buscar() {
     this.loaginServices.show()
     const vaCedula = this.validadorCedula.validadorDeCedula(this.inputValue)
     if (vaCedula) {
       
       this.userServices.verificar(this.inputValue).subscribe(
         async (resp) => {
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

}
