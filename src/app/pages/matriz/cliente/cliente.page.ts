import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import * as moment from 'moment';
import { LoadingServicesService } from 'src/app/services/loading-services.service';
import { ImpresoraService } from 'src/app/services/impresora.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class ClientePage implements OnInit {
  private _servicesImpresora = inject(ImpresoraService)
  private subscription: Subscription = new Subscription;
  private navController = inject(NavController)
  private userServices = inject(UsuariosService)
  private loaginServices = inject(LoadingServicesService)
  private alerta = inject(AlertService)
  cedula: any;
  id: string = '';
  alias: string = '';
  public areas: any = [];



  ngOnInit() {
    this.alias = 'Matriz';
    this.id = '10'
    this.cedula = localStorage.getItem('cedula');
    this.listArea()

  }


  listArea(): void {
    this.subscription.add(
      this.userServices.getArea(this.alias, this.id).subscribe(resp => {
        // this.areas = resp
        this.areas = resp.data.slice(0, 2);
        // console.log('data', this.areas)
      })
    )
  }

  back(): void {
    this.navController.back();
  }

  async onCardClick(card: any) {
    await this.loaginServices.show();
    this.subscription.add(
      this.userServices.getCodigo().subscribe(resp => {
        const usuario = {
          tcedula: this.cedula,
          tnombres: '',
          tapellidos: '',
          tcorreo: '',
          idarea: card.aid.toString(),
          idagencia: card.agid.toString(),
          idcodigo: resp.data.cid,
          usocio: 'No'
        };
        this.userServices.crearTurno(usuario).subscribe(async response => {
          if (response.success) {
            await this.loaginServices.hide();
            const area = response.data.AreaNombre.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toUpperCase();
            this._servicesImpresora.impresoraAtencionClienteCredito(response.data.alias, response.data.ccodigo, area, this.formatDate(response.data.fechaHora))
            // this.handleDocumento(response.data.alias, response.data.ccodigo,  area, this.formatDate(response.data.fechaHora))
            this.alerta.presentModal('¡Excelente!', '¡Turno agendado con éxito!. Nos vemos pronto', 'checkmark-circle-outline', 'success');
            this.back()
          }
        }, async error => {
          console.log(error)
          await this.loaginServices.hide();
          this.alerta.presentModal('¡Atención!', error.error.error, 'alert-circle-outline', 'warning');
        })
      })
    )

  }

  formatDate(dateString: string): string {
    return moment.utc(dateString).format('YYYY-MM-DD HH:mm');
  }

  // async handleDocumento(alias: any, turno: any, area: any, fecha: any) {
  //   const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID) ?? '';
  //   const serviceUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_Service_UUID) ?? '';
  //   const characteristicUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_CHARACTERISTIC_UUID) ?? '';
  //   this.handlePrintRecibo(deviceId, serviceUuid, characteristicUuid, alias, turno, area, fecha)
  // }

  //  async handlePrintRecibo(deviceId: string, serviceUuid: string, characteristicUuid: string, alia: string, turno: string, area: string, fecha: string) {
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
