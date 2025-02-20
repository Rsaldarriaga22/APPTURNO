import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo-usuario',
  templateUrl: './tipo-usuario.page.html',
  styleUrls: ['./tipo-usuario.page.scss'],
  standalone: false
})
export class TipoUsuarioPage implements OnInit {

  constructor( private _router: Router) { }

  ngOnInit() {
  }

  siguienteCliente(){
    localStorage.setItem('SOCIO', 'No');
    this._router.navigateByUrl('/home-matriz');
  }
  siguienteSocio(){
    localStorage.setItem('SOCIO', 'Si');
    this._router.navigateByUrl('/home-matriz');
  }
}
