import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AlertService } from 'src/app/services/alert.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ValidacionCedulaService } from 'src/app/services/validacion-cedula.service';
import { finalize } from 'rxjs';
import { SpinnerNewService } from 'src/app/util/spinner-new/spinner-new.service';


@Component({
  selector: 'app-home-matriz',
  templateUrl: './home-matriz.page.html',
  styleUrls: ['./home-matriz.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class HomeMatrizPage implements OnInit {
  private spinner = inject(SpinnerNewService);
  private _router = inject(Router)
  private userServices = inject(UsuariosService)
  private alerta = inject(AlertService)
  private validadorCedula = inject(ValidacionCedulaService)
  SOCIO: any
  inputValue: string = '';
  numeros: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  async ngOnInit() { }

  agregarNumero(num: string) {
    if (this.inputValue.length < 10) {
      this.inputValue += num;
    }
  }
  // 0500008586
  async buscar() {
    this.spinner.show()
    const vaCedula = this.validadorCedula.validadorDeCedula(this.inputValue)
    if (vaCedula) {
      this.userServices.verificar(this.inputValue).pipe(
        finalize(() => this.spinner.hide())
      ).subscribe(
        async (resp) => {
          if (resp.response) {
            localStorage.setItem('cedula', this.inputValue);
            const usuarioString = JSON.stringify(resp.response);
            localStorage.setItem('usuario', usuarioString);
            this._router.navigate(['/socio']);
            this.inputValue = ''
          } else {
            localStorage.setItem('cedula', this.inputValue);
            this._router.navigate(['/cliente']);
            this.inputValue = ''
          }
        }
      );
    } else {
      this.spinner.hide()
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
