import { inject, Injectable, OnDestroy } from '@angular/core';
import { BleClient, BleDevice, BleService, textToDataView } from '@capacitor-community/bluetooth-le';
import { LOCAL_STORAGE_KEY } from '../../api/url';
import { ToastService } from './toast.service';
import { AlertServiceB } from './alertB.service';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService implements OnDestroy {
  toastService = inject(ToastService)
  alertaService = inject(AlertServiceB)

  async Initialize() {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });
      this.toastService.presentToast('Bluetooth inicializado', 2000, 'bottom', 'success');
    } catch (error) {
      console.error('Error al inicializar el Bluetooth:', error);
      this.toastService.presentToast('Error al inicializar el Bluetoothrrrrrrrr', 2000, 'bottom', 'danger');
      throw error;
    }
  }

  async Connect(deviceId: string): Promise<boolean> {
    try {
      await BleClient.connect(deviceId);
      this.toastService.presentToast('Dispositivo Conectado', 2000, 'bottom', 'success');
      return true; // Conexión exitosa
    } catch (error) {
      this.toastService.presentToast('Error al conectar el dispositivo', 2000, 'bottom', 'danger');
      return false; // Falló la conexión
    }
  }

  async Disconnect(deviceId: string): Promise<boolean> {
    try {
      await BleClient.disconnect(deviceId);
      // this.toastService.presentToast('Dispositivo Desconectado', 2000, 'bottom', 'success');
      return true; // Desconexión exitosa
    } catch (error) {
      this.toastService.presentToast('Error al desconectar el dispositivo------', 2000, 'bottom', 'danger');
      return false; // Falló la desconexión
    }
  }

  async VerifyAndEnabled() {
    if (!await BleClient.isEnabled()) {
      await BleClient.enable();
      this.toastService.presentToast('Dispositivo Disponible', 2000, 'bottom', 'success');
    }
  }

  async AssignServices() {
    const deviceId = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID);
    let bleService: BleService[] = await BleClient.getServices(deviceId!);

    // Verificar si hay servicios disponibles
    if (bleService.length > 0) {
      let serviceFound = false;

      bleService.forEach(service => {
        // Filtrar características que tienen la propiedad `write` en `true`
        const writableCharacteristics = service.characteristics.filter(characteristic => characteristic.properties.write);

        if (writableCharacteristics.length > 0 && !serviceFound) {
          // Si se encuentra al menos una característica escribible, guardar en localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY.BLUETOOTH_Service_UUID, service.uuid);
          localStorage.setItem(LOCAL_STORAGE_KEY.BLUETOOTH_CHARACTERISTIC_UUID, writableCharacteristics[0].uuid);
          serviceFound = true; // Marcar que ya se encontró un servicio
          console.log(`Service UUID: ${service.uuid}`);
          console.log(`Characteristic UUID: ${writableCharacteristics[0].uuid}`);
        }
      });

      if (!serviceFound) {
        this.toastService.presentToast("No se encontraron servicios con características escribibles.", 2000, 'bottom', 'warning');
      }
      
    } else {
      this.toastService.presentToast("No se encontraron servicios.", 2000, 'bottom', 'warning');
    }
  }

  async Scan() {
    console.log("Escaneando....");
    await this.Initialize();
    await this.VerifyAndEnabled();

    // Verifica si hay un dispositivo ya vinculado
    const storedDeviceId = localStorage.getItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID);

    if (storedDeviceId) {
      // Si hay un dispositivo vinculado, intenta conectarte
      try {
        await this.Connect(storedDeviceId);
        this.toastService.presentToast(`Conectado automáticamente al dispositivo: ${storedDeviceId}`, 2000, 'bottom', 'success');
        await this.AssignServices();
        return; // Salir si se conecta correctamente
      } catch (error) {
        console.warn("Error conectando al dispositivo vinculado:", error);
        this.toastService.presentToast('No se pudo conectar al dispositivo vinculado. Buscando uno nuevo...', 1000, 'bottom', 'warning');
      }
    }

    // Si no hay dispositivo vinculado o no se pudo conectar, busca uno nuevo
    const bleDevices = await BleClient.requestDevice({ allowDuplicates: false });

    if (bleDevices) {
      this.toastService.presentToast(`Dispositivo encontrado: ${bleDevices.name || 'Sin nombre'} - ${bleDevices.deviceId}`, 2000, 'bottom', 'success');
      await this.Connect(bleDevices.deviceId);
      localStorage.setItem(LOCAL_STORAGE_KEY.BLUETOOTH_DEVICE_ID, bleDevices.deviceId);
      await this.AssignServices();
    } else {
      this.toastService.presentToast('No se encontraron dispositivos Bluetooth.', 2000, 'bottom', 'warning');
    }
  }

  // Avance de linea
  async LineFeed(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView((new Uint8Array([10])).buffer));
  }

  // Texto en negrita
  async TurnOnBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOn = new Uint8Array([27, 69, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOn.buffer));
  }

  // Quitar Texto en negrita
  async TurnOffBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOff = new Uint8Array([27, 69, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOff.buffer));
  }

  // Texto a la izquierda
  async FeedLeft(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const left = new Uint8Array([27, 97, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(left.buffer));
  }

  // Texto al centro
  async FeedCenter(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const center = new Uint8Array([27, 97, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(center.buffer));
  }

  // Texto a la derecha
  async FeedRight(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const right = new Uint8Array([27, 97, 2]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(right.buffer));
  }

  // Aumentar tamaño del texto
  async SetTextSize(deviceId: string, serviceUuid: string, characteristicUuid: string, width: number, height: number) {
    // n = 0 para tamaño normal, 1 para 2x, 2 para 3x, etc.
    const sizeCommand = new Uint8Array([29, 33, (width << 4) | height]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(sizeCommand.buffer));
  }

  // Función para convertir texto a un buffer en PC-850
  textToPC850Buffer(text: string): Uint8Array {
    const pc850Map = new Map([
      // Mapea caracteres especiales a sus valores en PC-850
      ['á', 0xE1], // a con tilde
      ['é', 0xE9], // e con tilde
      ['í', 0xED], // i con tilde
      ['ó', 0xF3], // o con tilde
      ['ú', 0xFA], // u con tilde
      ['ñ', 0xF1], // eñe
      ['ü', 0xFC], // u con diaresis
      // Agrega más mapeos según sea necesario
    ]);

    const buffer = new Uint8Array(text.length);

    for (let i = 0; i < text.length; i++) {
      buffer[i] = pc850Map.get(text[i]) || text.charCodeAt(i);
    }

    return buffer;
  }

  // Escribir texto
  async WriteData(deviceId: string, serviceUuid: string, characteristicUuid: string, text: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);

    // Convierte el texto a un buffer en PC-850
    const pc850Buffer = this.textToPC850Buffer(text);

    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(pc850Buffer.buffer));
  }

  // Linea por debajo del texto
  async UnderLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView('-'.repeat(30)));
  }

  // Texto en blanco
  async NewEmptyLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(`${' '.repeat(18)}\n`));
  }

  // async loadImage(imagePath: string): Promise<Uint8Array> {
  //   try {
  //     const response = await fetch(imagePath);
  //     if (!response.ok) {
  //       throw new Error(`Error fetching image: ${response.statusText}`);
  //     }

  //     const blob = await response.blob();
  //     const imageBitmap = await createImageBitmap(blob);

  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d')!;
  //     canvas.width = imageBitmap.width;
  //     canvas.height = imageBitmap.height;
  //     ctx.drawImage(imageBitmap, 0, 0);

  //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //     const data = imageData.data;

  //     // Calcula el ancho en bytes
  //     const width = Math.ceil(canvas.width / 8);
  //     const bitmapData = new Uint8Array((width * canvas.height) + 8);

  //     // Encabezado para la imagen (formato ESC/POS)
  //     const header = new Uint8Array([
  //       0x1D, // ESC
  //       0x76, // m
  //       0x30, // 0
  //       0x00, // 0
  //       width, // Ancho
  //       canvas.height % 256, // Alto (parte baja)
  //       Math.floor(canvas.height / 256) // Alto (parte alta)
  //     ]);

  //     bitmapData.set(header, 0);

  //     // Procesa cada píxel para crear el bitmap
  //     for (let y = 0; y < canvas.height; y++) {
  //       for (let x = 0; x < canvas.width; x++) {
  //         const idx = (y * canvas.width + x) * 4;
  //         const grayscale = (data[idx] + data[idx + 1] + data[idx + 2]) / 3; // Promedia los colores
  //         const bit = grayscale < 128 ? 1 : 0; // Determina si el píxel es negro (1) o blanco (0)

  //         const byteIndex = Math.floor(x / 8) + (y * width) + 8; // +8 para el encabezado
  //         const bitIndex = 7 - (x % 8); // Posición del bit en el byte
  //         if (bit === 1) {
  //           bitmapData[byteIndex] |= (1 << bitIndex); // Establece el bit correspondiente
  //         }
  //       }
  //     }

  //     console.log("bitmapData: ", JSON.stringify(bitmapData)); // Para depuración
  //     return bitmapData;
  //   } catch (error) {
  //     console.error("Error loading image:", error);
  //     throw error; // Manejo del error para que puedas capturarlo más adelante
  //   }
  // }


  // async PrintImage(deviceId: string, serviceUuid: string, characteristicUuid: string, imagePath: string) {
  //   try {
  //     const bitmapData = await this.loadImage(imagePath);
  //     console.log("bitmapData:", bitmapData.buffer); // Verifica el contenido de bitmapData

  //     if (bitmapData.length > 0) {
  //       const dataView = new DataView(bitmapData.buffer, bitmapData.byteOffset, bitmapData.byteLength); // Usa byteOffset y byteLength
  //       console.log("DataView:", dataView);

  //       // Enviar datos a la impresora
  //       await BleClient.write(deviceId, serviceUuid, characteristicUuid, dataView);
  //     } else {
  //       console.error("Error al imprimir: La imagen no contiene datos.");
  //     }
  //   } catch (error) {
  //     console.error("PrintTools: the file doesn't exist", error);
  //   }
  // }

  ngOnDestroy(): void {
  }
}