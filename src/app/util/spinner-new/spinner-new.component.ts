import { Component, inject, OnInit } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerNewService } from './spinner-new.service';

@Component({
  selector: 'app-spinner-new',
  templateUrl: './spinner-new.component.html',
  styleUrls: ['./spinner-new.component.scss'],
   imports: [NgxSpinnerModule],
})
export class SpinnerNewComponent  implements OnInit {
   protected spinner = inject(SpinnerNewService);
  constructor() { }

  ngOnInit() {}

}
