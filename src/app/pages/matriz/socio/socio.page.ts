import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { finalize, Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ImpresoraService } from 'src/app/services/impresora.service';
import { SpinnerNewService } from 'src/app/util/spinner-new/spinner-new.service';

@Component({
  selector: 'app-socio',
  templateUrl: './socio.page.html',
  styleUrls: ['./socio.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class SocioPage implements OnInit {
  private _servicesImpresora = inject(ImpresoraService)
  private userServices = inject(UsuariosService)
  private navController = inject(NavController)
  private _spinner = inject(SpinnerNewService);
  private alerta = inject(AlertService)
  private _router = inject(Router)

  private subscription: Subscription = new Subscription;
  public areas: any = [];
  public service: any = [];
  aid: string = '';
  agid: string = '';

  listaUsuario: any = {}
  id: string = '';
  alias: string = '';
  cedula: any;
  SOCIO: any;
  tipoTurno = false;
  codigoId: any;
  nombre: any;
  apellido: any;

  ngOnInit() {
    this.alias = 'Matriz';
    this.id = '10'
    const usuarioString = localStorage.getItem('usuario');
    this.listaUsuario = usuarioString ? JSON.parse(usuarioString) : null;
    this.cedula = localStorage.getItem('cedula');
    this.listArea()
    this.nombre = this.listaUsuario.nombres.split(' ')[0].toLowerCase().replace(/^\w/, (c: any) => c.toUpperCase());
    this.apellido = this.listaUsuario.apellidos.split(' ')[0].toLowerCase().replace(/^\w/, (c: any) => c.toUpperCase());
  }

  back(): void {
    this.navController.back();
  }


  async onCardClick(card: any) {
    if (card.aid == '19') {
      this._router.navigate(['/peluqueria']);

    } else if (card.aid == '20') {
      this._router.navigate(['/medicina']);
    } else if (card.aid == '21') {
      this._router.navigate(['/odontologia']);
    } else {
      this._spinner.show();   
      this.userServices.getCodigo().subscribe(resp => {
          this.codigoId = resp.data.cid
          
          const usuario = {
            tcedula: this.cedula,
            tnombres: this.listaUsuario.nombres,
            tapellidos: this.listaUsuario.apellidos,
            tcorreo: this.listaUsuario.email,
            idarea: card.aid.toString(),
            idagencia: card.agid.toString(),
            idcodigo: this.codigoId,
            usocio: 'Si'
          };
          this.userServices.crearTurno(usuario).pipe(
            finalize(()=>this._spinner.hide())
          ).subscribe(async response => {
            if (response.success) {
              const area = response.data.AreaNombre.normalize("NFD") // Descompone caracteres acentuados
                .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (tildes)
                .toUpperCase();

              this.alerta.presentModal('¡Excelente!', '¡Turno agendado con éxito!. Nos vemos pronto', 'checkmark-circle-outline', 'success');
              //Espera un poquito antes de conectar e imprimir

              await this.delay(300);
              this._servicesImpresora.impresoraAtencionClienteCredito(response.data.alias, response.data.ccodigo, area, this.formatDate(response.data.fechaHora))
              //Esperar un poco para asegurar que la impresión termine

              await this.delay(1000)
              this.back()

            }
          }, async error => {
            this.alerta.presentModal('¡Atención!', error.error.error, 'alert-circle-outline', 'warning');
          });
      })
  
    }
  }

    private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatDate(dateString: string): string {
    return moment.utc(dateString).format('YYYY-MM-DD HH:mm');
  }

  listArea(): void {
    this._spinner.show()
      this.userServices.getArea(this.alias, this.id).pipe(
        finalize(()=>this._spinner.hide())
      ).subscribe(resp => {
        this.areas = resp.data.slice(0, 2)
        this.service = resp.data.slice(2)
      })
  }


  // listArea(): void {
  //   this.subscription.add(
  //     this.userServices.getArea(this.alias, this.id).subscribe(resp => {
  //       this.areas = resp.data.slice(0, 2)
  //       this.service = resp.data.slice(2)
  //     })
  //   )
  // }

  // impresora
  // async handleDocumento(alias: any, turno: any, area: any, fecha: any) {
  //   const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID) ?? '';
  //   const serviceUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_Service_UUID) ?? '';
  //   const characteristicUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_CHARACTERISTIC_UUID) ?? '';
  //   this.handlePrintRecibo(deviceId, serviceUuid, characteristicUuid, alias, turno, area, fecha)
  // }

  // async handlePrintRecibo(deviceId: string, serviceUuid: string, characteristicUuid: string, alia: string, turno: string, area: string, fecha: string) {
  //   if (deviceId && serviceUuid && characteristicUuid) {
  //     try {
  //       await this.bluetoothOperationsService.Connect(deviceId);
  //       // Imprimir el Logo
  //       await this.bluetoothOperationsService.TurnOnBold(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 1, 1);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'FUTURO LAMANENSE');
  //       await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'COOPERATIVA DE AHORRO Y CREDITO');

  //       // Imprimir el encabezado
  //       await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 1, 1);
  //       // await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `MODULO   ${modulo}`);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `TURNO`);
  //       await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
  //       await this.bluetoothOperationsService.TurnOffBold(deviceId, serviceUuid, characteristicUuid);

  //       await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 1, 1);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `${alia}${turno}`);
  //       await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);


  //       await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `TURNO PARA EL AREA DE`);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `${area}`);
  //       await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, fecha);


  //       await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, '¡Agradecemos tu confianza!');
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'Te esperamos de regreso muy');
  //       await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'pronto.');

  //       // Saltos de linea
  //       await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
  //       await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);

  //     } catch (error) {
  //       console.error("Error durante la impresión:", error);
  //       this.alertaBluetooth.sweetAlert('Upps!', 'Hubo un error al imprimir el documento.', 'error')
  //     } finally {
  //       await this.bluetoothOperationsService.Disconnect(deviceId);
  //       console.log("Desconectado del dispositivo:", deviceId);
  //     }
  //   } else {
  //     console.warn('No se encontró información de la impresora.');
  //     this.alertaBluetooth.sweetAlert('Advertencia', 'No se encontró información de la impresora.', 'warning')
  //   }
  // }

}
