import { Component, inject } from '@angular/core';
import { AgenciaService } from '../services/agencia.service';
import { Subscription } from 'rxjs';
import { AgenciaModel } from '../models/agencia';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingServicesService } from '../services/loading-services.service';
import { BluetoothService } from '../services/bluetooth/bluetooth.service';
import { AlertService } from '../services/alert.service';
import { AlertServiceB } from '../services/bluetooth/alertB.service';
import { LOCAL_STORAGE_KEY } from '../api/url';
import { ToastService } from '../services/bluetooth/toast.service';
import { BleClient } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  toastService = inject(ToastService)
  constructor(
    private _router: Router,

    private bluetoothOperationsService: BluetoothService,
    private alertaBluetooth: AlertServiceB,

  ) {

  }


  isListVisible = false; // Estado para mostrar u ocultar la lista
  dataList = ['Dato 1', 'Dato 2', 'Dato 3', 'Dato 4']; // Datos para la lista

  toggleList() {
    this.isListVisible = !this.isListVisible;
  }

  ngOnInit(): void {

    // this.connectToPrinter()

  }

  navegar() {
    this._router.navigateByUrl('/home-matriz');
    localStorage.setItem('alias', JSON.stringify('Matriz'));
    localStorage.setItem('id', JSON.stringify('1'));
  }




}
