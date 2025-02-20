import { Component } from '@angular/core';
import { BluetoothService } from './services/bluetooth/bluetooth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
 
})
export class AppComponent {
  constructor( private blutt: BluetoothService) {
     this.blutt.Scan();
  }


 
  
}
