import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingServicesService } from 'src/app/services/loading-services.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ValidacionCedulaService } from 'src/app/services/validacion-cedula.service';

@Component({
  selector: 'app-home-matriz',
  templateUrl: './home-matriz.page.html',
  styleUrls: ['./home-matriz.page.scss'],
  standalone: false
})
export class HomeMatrizPage implements OnInit {

  // searchForm: FormGroup;
  // mensaje= '';
  // usuarios: any[] = [];
  // ucedula: string = '';
  // isLoadingRegister = false;
  // boolUrl = false


  SOCIO: any

  inputValue: string = '';
  numeros: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];



  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private userServices: UsuariosService,
    private auth: AuthService,
    private alerta: AlertService,
    private loaginServices: LoadingServicesService,
    private navController: NavController,
    private modalController: ModalController,
    private validadorCedula: ValidacionCedulaService
  ) {
    // this.searchForm = this.fb.group({
    //   cedula: ['1314880749', [Validators.required, this.cedulaValidator]],
    // });
  }

  async ngOnInit() {

    this.loaginServices.loadingFalse();
    // this.SOCIO = localStorage.getItem('SOCIO');
  }

  cedulaValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && control.value.length !== 10) {
      return { 'cedulaInvalida': true }; // La cédula no tiene 10 dígitos
    }
    return null; // La cédula es válida
  }




  agregarNumero(num: string) {
    if (this.inputValue.length < 10) {
      this.inputValue += num;
    }
  }
  back(): void {
    this.navController.back();
  }




  async buscar() {
   
  
    await this.loaginServices.loadingTrue();

    const vaCedula = this.validadorCedula.validadorDeCedula(this.inputValue)

    if (vaCedula) {

      this.userServices.verificar(this.inputValue).subscribe(
        async (resp) => {
          if (resp.response) {
            console.log(resp.response)
            localStorage.setItem('cedula', this.inputValue);
            const usuarioString = JSON.stringify(resp.response);
            localStorage.setItem('usuario', usuarioString);
            this._router.navigate(['/areas']);
            await this.loaginServices.loadingFalse();
            this.inputValue = ''
          } else {
            console.log(this.inputValue)
            await this.loaginServices.loadingFalse();
            localStorage.setItem('cedula', this.inputValue);
            this._router.navigate(['/cliente']);
            this.inputValue = ''
          }
        },
        async (error) => {
          await this.loaginServices.loadingFalse();
        }
      );
    } else {
      await this.loaginServices.loadingFalse();
      this.alerta.presentModal('¡Atención!', 'Cédula incorrecta. Verifique e intente nuevamente.', 'alert-circle-outline', 'warning');
    }


  }

  // async buscar() {
  //    await this.loaginServices.loadingTrue();
  //     this.userServices.verificar(this.inputValue).subscribe(
  //     async (resp) => {
  //       if (resp.response) {
  //         localStorage.setItem('cedula', this.inputValue);
  //         const usuarioString = JSON.stringify(resp.response);
  //         localStorage.setItem('usuario', usuarioString);
  //         this._router.navigate(['/areas']);
  //         this.inputValue = ''
  //         await this.loaginServices.loadingFalse();
  //       } else {

  //         await this.loaginServices.loadingFalse();
  //         // this.alerta.presentModal('¡Atención!', 'Cédula incorrecta. Verifique e intente nuevamente.', 'alert-circle-outline', 'warning');
  //       }
  //     },
  //     async (error) => {
  //       await this.loaginServices.loadingFalse();
  //     }
  //   );


  // }


  borrar() {
    this.inputValue = this.inputValue.slice(0, -1);
  }









}
