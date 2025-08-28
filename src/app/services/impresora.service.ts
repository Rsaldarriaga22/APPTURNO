import { inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEY } from 'src/app/api/url';
import { BluetoothService } from './bluetooth/bluetooth.service';
import { AlertServiceB } from './bluetooth/alertB.service';
@Injectable({
  providedIn: 'root'
})
export class ImpresoraService {
  private bluetoothOperationsService = inject(BluetoothService)
  private alertaBluetooth = inject(AlertServiceB)

  constructor() { }

  async ImprimirOtrosServices(nombres: string, apellidos: string, fecha: any, horario: any, area: string) {
    const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID) ?? '';
    const serviceUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_Service_UUID) ?? '';
    const characteristicUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_CHARACTERISTIC_UUID) ?? '';
    this.handlePrintRecibo(deviceId, serviceUuid, characteristicUuid, nombres, apellidos, fecha, horario, area)
  }

async handlePrintRecibo(
  deviceId: string,
  serviceUuid: string,
  characteristicUuid: string,
  nombres: string,
  apellidos: string,
  fecha: string,
  horario: string,
  area: string
) {
  if (deviceId && serviceUuid && characteristicUuid) {
    try {
      await this.bluetoothOperationsService.Connect(deviceId);

      // 🔹 Encabezado
      await this.bluetoothOperationsService.TurnOnBold(deviceId, serviceUuid, characteristicUuid);
      await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
      await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 1, 1);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'FUTURO LAMANENSE');
      await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'COOPERATIVA DE AHORRO Y CREDITO');
      await this.bluetoothOperationsService.TurnOffBold(deviceId, serviceUuid, characteristicUuid);
      
      // 🔹 Espacio
      await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
      
      // 🔹 Mensaje bonito
      await this.bluetoothOperationsService.TurnOnBold(deviceId, serviceUuid, characteristicUuid);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `Estimado/a`);
      await this.bluetoothOperationsService.TurnOffBold(deviceId, serviceUuid, characteristicUuid);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `${nombres}`);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `${apellidos}.`);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `Le confirmamos que su turno ha`);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `sido registrado con exito.`);
      
      await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
      
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `SERVICIO: ${area}`);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `FECHA: ${fecha}`);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `HORA: ${horario}`);

      await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);

      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `Le recomendamos llegar con`);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `10 minutos de anticipacion para`);
      await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `brindarle una mejor atencion.`);

      await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);

      // await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
      // await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `¡Gracias por confiar en nosotros!`);

      // 🔹 Espacios finales
      await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
      await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);

    } catch (error) {
      console.error("Error durante la impresión:", error);
      this.alertaBluetooth.sweetAlert('Upps!', 'Hubo un error al imprimir el documento.', 'error');
    } finally {
      await this.bluetoothOperationsService.Disconnect(deviceId);
      console.log("Desconectado del dispositivo:", deviceId);
    }
  } else {
    console.warn('No se encontró información de la impresora.');
    this.alertaBluetooth.sweetAlert('Advertencia', 'No se encontró información de la impresora.', 'warning');
  }
}


  // IMPRESORA PARA ATENCION AL CLIENTE Y CREDITO
  async impresoraAtencionClienteCredito(alias: any, turno: any, area: any, fecha: any) {
    const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID) ?? '';
    const serviceUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_Service_UUID) ?? '';
    const characteristicUuid = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_CHARACTERISTIC_UUID) ?? '';
    this.configuracionImpresora(deviceId, serviceUuid, characteristicUuid, alias, turno, area, fecha)
  }

  async configuracionImpresora(deviceId: string, serviceUuid: string, characteristicUuid: string, alia: string, turno: string, area: string, fecha: string) {
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
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 1, 1);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `${alia}${turno}`);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);


        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `TURNO PARA EL AREA DE`);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, `${area}`);
        await this.bluetoothOperationsService.SetTextSize(deviceId, serviceUuid, characteristicUuid, 0, 0);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, fecha);


        await this.bluetoothOperationsService.NewEmptyLine(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.FeedCenter(deviceId, serviceUuid, characteristicUuid);
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, '¡Agradecemos tu confianza!');
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'Te esperamos de regreso muy');
        await this.bluetoothOperationsService.WriteData(deviceId, serviceUuid, characteristicUuid, 'pronto.');

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
