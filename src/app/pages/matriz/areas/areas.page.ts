import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE_KEY } from 'src/app/api/url';
import { AlertService } from 'src/app/services/alert.service';
import { AlertServiceB } from 'src/app/services/bluetooth/alertB.service';
import { BluetoothService } from 'src/app/services/bluetooth/bluetooth.service';
import { LoadingServicesService } from 'src/app/services/loading-services.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
// import moment from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.page.html',
  styleUrls: ['./areas.page.scss'],
  standalone: false,
  providers: [DatePipe]
})
export class AreasPage implements OnInit {

  private subscription: Subscription = new Subscription;
  public areas: any = [];
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

  constructor(
    private userServices: UsuariosService,
    private bluetoothOperationsService: BluetoothService,
    private alertaBluetooth: AlertServiceB,
    private alerta: AlertService,
    private navController: NavController,
    private loaginServices: LoadingServicesService,
    private datePipe: DatePipe
  ) { }


  ngOnInit() {

    this.alias = 'Matriz';
    this.id = '10'
    // this.alias = JSON.parse(localStorage.getItem('alias')!);
    // this.id = JSON.parse(localStorage.getItem('id')!);
    const usuarioString = localStorage.getItem('usuario');
    this.listaUsuario = usuarioString ? JSON.parse(usuarioString) : null;
    this.cedula = localStorage.getItem('cedula');
    // this.SOCIO = localStorage.getItem('SOCIO');

    this.listArea()
    this.nombre= this.listaUsuario.nombres.split(' ')[0].toLowerCase().replace(/^\w/, (c:any) => c.toUpperCase()); 
    this.apellido= this.listaUsuario.apellidos.split(' ')[0].toLowerCase().replace(/^\w/, (c:any) => c.toUpperCase()); 
  }


  trunoback(): void {
    this.navController.back();
    this.navController.back();
  }
  back(): void {
    this.navController.back();
  }

  clientye = 5
  CREDITO = 6

  async onCardClick(card: any) {
  
    await this.loaginServices.loadingTrue();
    this.subscription.add(
      this.userServices.getCodigo().subscribe(resp => {
        this.codigoId = resp.data.cid
        const usuario = {
          tcedula: this.cedula,
          tnombres: this.listaUsuario.nombres,
          tapellidos: this.listaUsuario.apellidos,
          tcorreo: this.listaUsuario.email,
          // ttipoturno: 'Turno Normal',
          idarea: card.aid.toString(),
          idagencia: card.agid.toString(),
          idcodigo: this.codigoId,
          usocio: 'Si'
        };
        this.userServices.crearTurno(usuario).subscribe(async response => {
          if (response.success) {
            // console.log('listaaa', response.data)

            // const fecha = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
             const area = response.data.AreaNombre.normalize("NFD") // Descompone caracteres acentuados
             .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (tildes)
             .toUpperCase();
             this.handleDocumento(response.data.alias, response.data.ccodigo , area, this.formatDate(response.data.fechaHora))
            //  this.handleDocumento(response.data.alias, response.data.ccodigo , area, this.formatDate(response.data.fechaHora),response.data.modulo)
            await this.loaginServices.loadingFalse();
            this.alerta.presentModal('¡Excelente!', '¡Turno agendado con éxito!. Nos vemos pronto', 'checkmark-circle-outline', 'success');
            this.back()
          }
        },async error=>{
          console.log(error)
          await this.loaginServices.loadingFalse();
          this.alerta.presentModal('¡Atención!', error.error.error, 'alert-circle-outline', 'warning');
        });

      })
    )

  }
  // para agregar dos cerotoString().padStart(2, '0')
  
  formatDate(dateString: string): string {
    return moment.utc(dateString).format('YYYY-MM-DD HH:mm');
  }
  // 1302374812

  listArea(): void {
    this.subscription.add(
      this.userServices.getArea(this.alias, this.id).subscribe(resp => {
        this.areas = resp
      })
    )
  }



  async handleDocumento(alias:any, turno: any, area:any, fecha: any) {
      const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID) ?? '';
      const serviceUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_Service_UUID) ?? '';
      const characteristicUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_CHARACTERISTIC_UUID) ?? '';
      this.handlePrintRecibo(deviceId, serviceUuid, characteristicUuid, alias, turno, area, fecha)
  }

  async handlePrintRecibo(deviceId: string, serviceUuid: string, characteristicUuid: string, alia: string, turno: string, area:string, fecha: string ) {
    if (deviceId && serviceUuid && characteristicUuid) {
      try {

        await this.bluetoothOperationsService.Connect(deviceId);

        // Imprimir el Logo
        await this.bluetoothOperationsService.TurnOnBold(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 1, 1);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'FUTURO LAMANENSE');
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'COOPERATIVA DE AHORRO Y CREDITO');

        // Imprimir el encabezado
        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 1, 1);
        // await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `MODULO   ${modulo}`);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `TURNO`);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
        await this.bluetoothOperationsService.TurnOffBold(deviceId, serviceUuid, characteristicUuid);

        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 2, 2);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `${alia}${turno}`);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);


        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `TURNO PARA EL AREA DE ${area}`);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, fecha);


        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, '¡Agradecemos tu confianza!');
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'Te esperamos de regreso muy pronto.');

        // Saltos de linea
        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);

      } catch (error) {
        console.error("Error durante la impresión:", error);
        this.alertaBluetooth.sweetAlert('Upps!', 'Hubo un error al imprimir el documento.', 'error')
      } finally {
        await this.bluetoothOperationsService.Disconnect(deviceId);
        console.log("Desconectado del dispositivo:", deviceId);
      }
    } else {
      console.warn('No se encontró información de la impresora.');
      this.alertaBluetooth.sweetAlert('Advertencia', 'No se encontró información de la impresora.', 'warning')
    }
  }














}
