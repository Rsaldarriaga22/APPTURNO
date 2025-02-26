import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Cliente } from 'src/app/models/Cliente';
import { Fechac } from 'src/app/models/fechaHora';
import { Horario } from 'src/app/models/Horario';
import { Persona } from 'src/app/models/Persona';
import { Solicitud } from 'src/app/models/Solicitud';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingServicesService } from 'src/app/services/loading-services.service';
import { PeluqueriaService } from 'src/app/services/peluqueria.service';

@Component({
  selector: 'app-odontologia',
  templateUrl: './odontologia.page.html',
  styleUrls: ['./odontologia.page.scss'],
  standalone: false,
})
export class OdontologiaPage implements OnInit {
   nombre: any;
    apellido: any;
    listaUsuario: any = {}
    cedula: any;
    public horariosAll: Horario[] = [];
    public cantidadTurnosAlDia: number = 0;
    public diasDisponibles: any[] = [];
    public tipo: string = '';
    public tipoSeguro: string = '';
    public siTieneSeguroMortuorio: string = '';
    public persona: Persona = new Persona(0, '', '', '', '');
    public cliente: Cliente = new Cliente(0, 0, null);
    public solicitudCreate: Solicitud = new Solicitud(0, 0, 0, 0, 0, '', '', '', 0);
    public solicitudesAlmacenadas: Solicitud[] = [];
    public ultimasolicitudesAlmacenadas: Solicitud = new Solicitud(0, 0, 0, 0, 0, '', '', '', 0, '', '');
    public cantidadNumeroDiaUltimaSolicitud: number = 15;
    selectedDayIndex: number | null = null;
    public turnoSeleccionadoShow: boolean = false;
    public turnosShow: boolean = false;
    public fechaSeleccionada: string = "";
    public horariosDeServicio: Horario[] = [];
    public solicitudesRealizadas: Solicitud[] = [];
    public intervalo: any;
    public turnoSeleccionado: string = '';
    public activeBoton: boolean = false;
    horarioSeleccionado: number | null = null; 
    public emailPersonaConsultada: string = '';
    public nombrePersonaConsultada: string = '';
    public pendiente: boolean = false;

  constructor(    private loaginServices: LoadingServicesService,
       private _servicesPeluqueria: PeluqueriaService,
       private navController: NavController,
       private alerta: AlertService,) { }

  ngOnInit() {
    const usuarioString = localStorage.getItem('usuario');
    this.listaUsuario = usuarioString ? JSON.parse(usuarioString) : null;
    this.cedula = localStorage.getItem('cedula');
    this.nombre = this.listaUsuario.nombres.split(' ')[0].toLowerCase().replace(/^\w/, (c: any) => c.toUpperCase());
    this.apellido = this.listaUsuario.apellidos.split(' ')[0].toLowerCase().replace(/^\w/, (c: any) => c.toUpperCase());

    this.verificarSitieneSeguroMortuorio()
    this.getSeisDias();
    this.getHorariosDiarias();
    this.getCantidadHorarios();
  }

 ngOnDestroy(): void {
    this.loaginServices.hide();  // Aquí destruyes el loading cuando el componente se destruye
  }

  EnviarSolicitud(): void {
    
      if (this.fechaSeleccionada == "" || this.fechaSeleccionada == null) {
        this.alerta.presentModal('¡Atención!', 'Selecciona la día!', 'alert-circle-outline', 'warning');
      } else {
        this.solicitudCreate.FECHATURNO = this.getFechaTurno();
        this.solicitudCreate.FECHA = Fechac.fechaActual() + ' ' + Fechac.horaActual();
        this.solicitudCreate.ESTADO = "Pendiente";
        this.solicitudCreate.IDSERVICIO = 2;
        this.solicitudCreate.IDSUCURSAL = 1
        this.loaginServices.show('Cargando...');
        this._servicesPeluqueria.getIdClientePorIdentificacion(this.cedula).subscribe(
          response => {
            this.loaginServices.hide();
            this.solicitudCreate.IDCLIENTE = response.idcliente;
            this.solicitudCreate.IDPROFESIONAL = 1;
            this._servicesPeluqueria.createSolicitud(this.solicitudCreate).subscribe(
              response => {
                this.enviarNotificacion();
                this.alerta.presentModal('¡Excelente!', '¡Turno agendado con éxito!. Nos vemos pronto', 'checkmark-circle-outline', 'success');
                this.navController.back();
                this.navController.back();
                this.getSolicitudesAlmacenadas()
              }, error => {
                console.log(error);
              }
            )
          }, error => {
            this.loaginServices.hide();
            console.log(error);
          }
        )
      }
    
  }



  enviarNotificacion(): void {
    this.loaginServices.show('Cargando...');
    this._servicesPeluqueria.notificar(this.emailPersonaConsultada, Fechac.fechaActual() + ' ' + Fechac.horaActual(), 'Medicina General', this.nombrePersonaConsultada).subscribe(
      response => {
        this.loaginServices.hide();
      }, error => {
        this.loaginServices.hide();
        console.log(error);
      }
    )
  }


  verificarSitieneSeguroMortuorio(): void {
    this.loaginServices.show('Cargando...');
    this._servicesPeluqueria.verificarSeguroMortuorio(this.cedula).subscribe(
      response => {
      
        this.loaginServices.hide();
        if (response.response == "SI EXISTE") {
          this.actualizarTipoCuentaTipoSeguro(this.cedula, response.TIPOCUENTA, response.TIPO);
          this.tipo = response.TIPO;
          if (response.TIPO == "AHORRO JUNIOR") {
            this.tipoSeguro = "AHORRO JUNIOR";
          } else {
            this.tipoSeguro = response.data.concepto;
            // this.fechaSeguro = response.data.FECHA;
          }
          this.siTieneSeguroMortuorio = "existe";
          this.emailPersonaConsultada = response.data.email;
          this.nombrePersonaConsultada = response.data.NOMBREUNIDO;
          this.VerificarSiExitePersona();
          this.getSolicitudesAlmacenadas();
          // this.actualizarEmail();
          //this.actualizarEmail();
        } else {
          this.siTieneSeguroMortuorio = "noexiste"
          this.loaginServices.hide();
        }
        this.loaginServices.hide();
      }, error => {
        this.loaginServices.hide();
        console.log(error);
      }
    )
  }

  getSolicitudesAlmacenadas(): void {

    this._servicesPeluqueria.getIdClientePorIdentificacion(this.cedula).subscribe(
      response => {
        
        this.solicitudCreate.IDCLIENTE = response.idcliente;
        if (!response.error) {
          this._servicesPeluqueria.getSolicitudPorCliente(response.idcliente, 2).subscribe(
            response => {
              this.solicitudesAlmacenadas = response.response;
              let ultimaSolicitud = this.solicitudesAlmacenadas[this.solicitudesAlmacenadas.length - 1];
              if(ultimaSolicitud.ESTADO == "Pendiente"){
                this.pendiente = true
                }
              if (response.response) {
                this.getUltimaSolicitudEnviada(this.solicitudCreate.IDCLIENTE);
              } else {
                this.cantidadNumeroDiaUltimaSolicitud = 8;
              }
            }, error => {
              console.log(error);
            }
          )
        }
      }, error => {
        console.log(error);
      }
    )
  }

 

  cancelarSolicitud(idsolicitud: number): void {
    this.loaginServices.show('Cargando...');
    this._servicesPeluqueria.deleteSolicitud(idsolicitud).subscribe(
      response => {
        this.loaginServices.hide()
        this.alerta.presentModal('¡Excelente!', 'Solicitud cancelada con exito!!', 'checkmark-circle-outline', 'success');
        this.navController.back();
        this.getSolicitudesAlmacenadas();
      }, error => {
        this.loaginServices.hide()
        console.log(error);
      }
    )
  }

  getUltimaSolicitudEnviada(idcliente: number): void {
    this._servicesPeluqueria.getUltimaSolicitudPorCliente(idcliente, 2).subscribe(
      response => {
        if (response.response) {
          this.ultimasolicitudesAlmacenadas = response.response;
          var diaDIferencia = Fechac.restarFechas(this.ultimasolicitudesAlmacenadas.FECHATURNO, Fechac.fechaActual())
          this.cantidadNumeroDiaUltimaSolicitud = diaDIferencia;
        } else {
          this.cantidadNumeroDiaUltimaSolicitud = 8;
        }
      }, error => {
        console.log(error);
      }
    )
  }

  VerificarSiExitePersona(): void {
    this._servicesPeluqueria.getpersonaPorCedula(this.cedula).subscribe(
      response => {
        if (response.error) {
          this.agregarPersonaCliente();
        } else {
          var idpersona = response.response.IDPERSONA;
          this._servicesPeluqueria.getClientePorId(idpersona).subscribe(
            response => {
              if (response.error) {
                this.agregarCliente(idpersona);
              }
            }, error => {
              console.log(error);
            }
          )
        }
      }, error => {
      
        console.log(error);
      }
    )
  }

  
  agregarPersonaCliente(): void {
    this.loaginServices.show('Cargando...');
    this._servicesPeluqueria.createPersona(this.persona).subscribe(
      response => {
        this.loaginServices.hide();
        this.agregarCliente(response.idpersona);
      }, error => {
        this.loaginServices.hide();
        console.log(error);
      }
    )
  }


  agregarCliente(idpersona: number): void {
    this.cliente.IDPERSONA = idpersona;
    this.cliente.ULTIMAFECHASOLICUTDUD = new Date();
    this.loaginServices.show('Cargando...');
    this._servicesPeluqueria.createCliente(this.cliente).subscribe(
      response => {
        this.loaginServices.hide();
      }, error => {
        this.loaginServices.hide();
        console.log(error);
      }
    )
  }


  actualizarTipoCuentaTipoSeguro(identificacion: string, tipocuenta: string, tiposeguro: string): void {
    this._servicesPeluqueria.actualizarTipocuentaTipoSeguro(identificacion, tipocuenta, tiposeguro).subscribe(
      response => {
      }, error => {
        console.log(error);
      }
    )
  }

  getSeisDias(): void {
    var diaExport = 0; // 11
    var dias = [];
    var nombreDelDia = Fechac.generarNombreDia(Fechac.numeroDia());
    var contador = 0;
    var mes = "";
    var anio = "";
    for (let i = 0; i < 6; i++) {
      if (nombreDelDia == 'sábado' || nombreDelDia == 'domingo') {
        if (nombreDelDia == 'sábado') {
          contador = contador + 2;
          diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
          nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
          mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
          anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
        } else {
          contador = contador + 1;
          diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
          nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
          mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
          anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
        }
      } else {
        if (dias.length == 0) {
          if (Fechac.verificarHora() == false) {
            contador = contador + 1;
            diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
            nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
            mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
            anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
          } else {
            contador = contador + 0;
            diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
            nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
            mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
            anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
          }
        } else {
          if (dias.length > 0) {
            if (nombreDelDia == 'viernes') {
              contador = contador + 3;
            } else {
              contador = contador + 1;
            }
          }
          diaExport = +Fechac.obtenerDiaDelMesMaIncremento(contador)[0];
          nombreDelDia = Fechac.obtenerDiaDelMesMaIncremento(contador)[1];
          mes = Fechac.obtenerDiaDelMesMaIncremento(contador)[2];
          anio = Fechac.obtenerDiaDelMesMaIncremento(contador)[3];
          if (dias.length == 0) {
            contador = contador + 1;
          }
        }
      }
      dias.push({
        dia: diaExport,
        nombre: nombreDelDia,
        mes: mes,
        anio: anio
      });
    }
    this.diasDisponibles = dias;
  }

  getCantidadHorarios(): void {
    this._servicesPeluqueria.getCount(2).subscribe(
      response => {
        this.cantidadTurnosAlDia = response.response.COUNT;
      }, error => {
        console.log(error);
      }
    )
  }

  getHorariosDiarias(): void {
    this._servicesPeluqueria.getall(2).subscribe(
      response => {
        this.horariosAll = response.response;
      }, error => {
        console.log(error);
      }
    )
  }

    back(): void {
    this.navController.back();
  }

  isSelecteda(index: number): boolean {
    return this.selectedDayIndex === index;
  }

  seleccionar(fecha: string, idhorario: number): void {
    clearInterval(this.intervalo)
    this.turnoSeleccionado = fecha;
    this.turnoSeleccionadoShow = true;
    this.turnosShow = false;
    this.activeBoton = true;
    this.solicitudCreate.IDHORARIO = idhorario;
    this.horarioSeleccionado = idhorario;
  }

  toggleActivea(index: number, dia: any): void {
    if (this.selectedDayIndex === index) {
      this.selectedDayIndex = null;
      this.turnoSeleccionadoShow = false;
      clearInterval(this.intervalo)
      this.turnosShow = true;
      this.verificarSolicitudesRealizadas()
      this.intervalo = setInterval(() => {
        this.verificarSolicitudesRealizadas()
      }, 3000);
    } else {
      this.selectedDayIndex = index;

      this.fechaSeleccionada = `${dia.dia}#${dia.nombre}#${dia.mes}#${dia.anio}`;

      this.turnoSeleccionadoShow = false;
      clearInterval(this.intervalo)
      this.turnosShow = true;
      this.verificarSolicitudesRealizadas()
      this.intervalo = setInterval(() => {
        this.verificarSolicitudesRealizadas()
      }, 3000);
    }
  }

  verificarSolicitudesRealizadas(): void {
    var fecha = this.getFechaTurno();
    this._servicesPeluqueria.getSolicitudPorFechaTurno(fecha, 2).subscribe(
      response => {
        this.horariosDeServicio = [];
        this.solicitudesRealizadas = response.response;
        if (response.error) {
          for (let k = 0; k < this.horariosAll.length; k++) {
            if (Fechac.fechaActual() == fecha) {
              var hora = +this.horariosAll[k].HORARIO.split(":")[0];
              var horaSistema = +Fechac.horaActual().split(":")[0]
              if (hora > horaSistema) {
                this.horariosDeServicio.push(this.horariosAll[k]);
              }
            } else {
              this.horariosDeServicio.push(this.horariosAll[k]);
            }
          }
        } else {
          this.horariosDeServicio = [];
          var estado = true;
          for (let k = 0; k < this.horariosAll.length; k++) {
            for (let i = 0; i < this.solicitudesRealizadas.length; i++) {
              if (this.solicitudesRealizadas[i].IDHORARIO == this.horariosAll[k].IDHORARIO) {
                estado = false;
              }
            }
            if (estado == true) {
              if (Fechac.fechaActual() == fecha) {
                var hora = +this.horariosAll[k].HORARIO.split(":")[0];
                var horaSistema = +Fechac.horaActual().split(":")[0];
                if (hora >= horaSistema) {
                  if (this.comparacionHorasDetalladasHorario(this.horariosAll[k].HORARIO.split("-")[0], Fechac.horaActual().split(":")[0] + ':' + Fechac.horaActual().split(":")[1])) {
                    this.horariosDeServicio.push(this.horariosAll[k]);
                  }
                }
              } else {
                this.horariosDeServicio.push(this.horariosAll[k]);
              }
            }
            estado = true;
          }
        }
      }, error => {
        console.log(error)
      }
    )
  }

  comparacionHorasDetalladasHorario(horario: string, horaSistema: string): boolean {
    var respuesta = false;
    if ((+horario.split(':')[0]) == (+horaSistema.split(':')[0])) {
      if ((+horario.split(':')[1]) > (+horaSistema.split(':')[1])) {
        respuesta = true;
      } else {
        respuesta = false;
      }
    } else {
      respuesta = true;
    }
    return respuesta;
  }


  getFechaTurno(): string {
    var partes = this.fechaSeleccionada.split("#");
    var dia = '';
    if (partes[0].length == 1) {
      dia = '0' + partes[0];
    } else {
      dia = partes[0];
    }
    return partes[3] + '-' + Fechac.transformarDeMesAhNumero(partes[2]) + '-' + dia;
  }
}
