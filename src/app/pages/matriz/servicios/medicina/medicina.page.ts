import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Cliente } from 'src/app/models/Cliente';
import { Fechac } from 'src/app/models/fechaHora';
import { Horario } from 'src/app/models/Horario';
import { Persona } from 'src/app/models/Persona';
import { Solicitud } from 'src/app/models/Solicitud';
import { AlertService } from 'src/app/services/alert.service';
import { ImpresoraService } from 'src/app/services/impresora.service';
import { PeluqueriaService } from 'src/app/services/peluqueria.service';
import { SpinnerNewService } from 'src/app/util/spinner-new/spinner-new.service';

@Component({
  selector: 'app-medicina',
  templateUrl: './medicina.page.html',
  styleUrls: ['./medicina.page.scss'],
  standalone: false,
})
export class MedicinaPage implements OnInit {
  private _servicesImpresora = inject(ImpresoraService)
  private _spinner = inject(SpinnerNewService);
  private _servicesPeluqueria = inject(PeluqueriaService)
  private navController = inject(NavController)
  private alerta = inject(AlertService)

  activeButtom: boolean = true;
  public ultimoTurno: any;

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
  public cantidadNumeroDiaUltimaSolicitud: number = 2;
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
  public diasAExcluir: number[] = [];

  ngOnInit() {
    const usuarioString = localStorage.getItem('usuario');
    this.listaUsuario = usuarioString ? JSON.parse(usuarioString) : null;
    this.cedula = localStorage.getItem('cedula');
    this.nombre = this.listaUsuario.nombres.split(' ')[0].toLowerCase().replace(/^\w/, (c: any) => c.toUpperCase());
    this.apellido = this.listaUsuario.apellidos.split(' ')[0].toLowerCase().replace(/^\w/, (c: any) => c.toUpperCase());
    this.suspendirDias()
  }


  // Convierte  en un objeto Date del día actual
  convertirHora(horaStr: string): Date {
    const [time, meridiem] = horaStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (meridiem.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (meridiem.toLowerCase() === 'am' && hours === 12) hours = 0;

    const fecha = new Date();
    fecha.setHours(hours, minutes, 0, 0);
    return fecha;
  }


  EnviarSolicitud(): void {
    if (this.fechaSeleccionada == "" || this.fechaSeleccionada == null) {
      this.alerta.presentModal('¡Atención!', 'Selecciona la día!', 'alert-circle-outline', 'warning');
    } else {
      this.solicitudCreate.FECHATURNO = this.getFechaTurno();
      this.solicitudCreate.FECHA = Fechac.fechaActual() + ' ' + Fechac.horaActual();
      this.solicitudCreate.ESTADO = "Pendiente";
      this.solicitudCreate.IDSERVICIO = 3;
      this.solicitudCreate.IDSUCURSAL = 1
      this._spinner.show();
      this._servicesPeluqueria.getIdClientePorIdentificacion(this.cedula).subscribe(
        response => {
          this.solicitudCreate.IDCLIENTE = response.idcliente;
          this.solicitudCreate.IDPROFESIONAL = 3;
          this._servicesPeluqueria.createSolicitud(this.solicitudCreate).pipe(
            finalize(() => this._spinner.hide())
          ).subscribe(
            response => {
              this._servicesImpresora.ImprimirOtrosServices(this.listaUsuario.nombres, this.listaUsuario.apellidos, this.solicitudCreate.FECHATURNO, this.turnoSeleccionado, 'MEDICINA G.')
              this.enviarNotificacion();
              this.alerta.presentModal('¡Excelente!', '¡Turno agendado con éxito!. Nos vemos pronto', 'checkmark-circle-outline', 'success');
              // this.navController.back();
              // this.navController.back();
              this.getSolicitudesAlmacenadas()
              this.navController.navigateRoot('/home-matriz');
            }
          )
        }
      )
    }
  }

  enviarNotificacion(): void {
    this._spinner.show();
    this._servicesPeluqueria.notificar(this.emailPersonaConsultada, Fechac.fechaActual() + ' ' + Fechac.horaActual(), 'Medicina General', this.nombrePersonaConsultada).pipe(
      finalize(() => this._spinner.hide())
    ).subscribe()
  }

  verificarSitieneSeguroMortuorio(): void {
    this._spinner.show();
    this.getSeisDias();
    this._servicesPeluqueria.verificarSeguroMortuorio(this.cedula).pipe(
      finalize(() => this._spinner.hide())
    ).subscribe(
      response => {
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
        } else {
          this.siTieneSeguroMortuorio = "noexiste"
          this._spinner.hide();
        }
      }
    )
  }

  getSolicitudesAlmacenadas() {
    this._servicesPeluqueria.getIdClientePorIdentificacion(this.cedula).subscribe(
      async response => {
        this.solicitudCreate.IDCLIENTE = response.idcliente;
        if (!response.error) {
          this._servicesPeluqueria.getSolicitudPorCliente(response.idcliente, 3).subscribe(
            response => {
              this.solicitudesAlmacenadas = response.response;
              // Acceder al último objeto en el arreglo
              let ultimaSolicitud = this.solicitudesAlmacenadas[this.solicitudesAlmacenadas.length - 1];

              this.ultimoTurno = ultimaSolicitud

              if (this.ultimoTurno.ESTADO == 'Ausente') {
                this.cantidadNumeroDiaUltimaSolicitud
              } else {
                this.controlar5Minutos(ultimaSolicitud.FECHA)

                if (ultimaSolicitud.ESTADO == "Pendiente") {
                  this.pendiente = true
                }
                if (response.response) {
                  this.getUltimaSolicitudEnviada(this.solicitudCreate.IDCLIENTE);
                } else {
                  this.cantidadNumeroDiaUltimaSolicitud = 15;
                }
              }

            }, error => {
              console.log(error);
            }
          )
        }
      }, async error => {
        console.log(error);
      }
    )
  }

  controlar5Minutos(fecha: string) {
    const horaBaseStr = fecha;
    const horaBase = new Date(horaBaseStr.replace(' ', 'T'));
    const horaLimite = new Date(horaBase.getTime() + 5 * 60 * 1000);
    this.intervalo = setInterval(() => {
      const ahora = new Date();
      if (ahora >= horaLimite) {
        this.activeButtom = false
        clearInterval(this.intervalo);
      } else {
        this.activeButtom = true
      }
    }, 300)
  }

  cancelarSolicitud(idsolicitud: number): void {
    this._spinner.show();
    this._servicesPeluqueria.deleteSolicitud(idsolicitud).pipe(
      finalize(() => this._spinner.hide())
    ).subscribe(() => {
      this.alerta.presentModal('¡Excelente!', 'Solicitud cancelada con exito!!', 'checkmark-circle-outline', 'success');
      this.navController.back();
      this.getSolicitudesAlmacenadas();
    }
    )
  }

  getUltimaSolicitudEnviada(idcliente: number): void {
    this._servicesPeluqueria.getUltimaSolicitudPorCliente(idcliente, 3).subscribe(
      async response => {
        if (response.response) {
          this.ultimasolicitudesAlmacenadas = response.response;
          var diaDIferencia = Fechac.restarFechas(this.ultimasolicitudesAlmacenadas.FECHATURNO, Fechac.fechaActual())
          this.cantidadNumeroDiaUltimaSolicitud = diaDIferencia;
        } else {
          this.cantidadNumeroDiaUltimaSolicitud = 8;
        }
      }, async error => {
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
    this._servicesPeluqueria.createPersona(this.persona).subscribe(
      response => {
        this.agregarCliente(response.idpersona);
      }, error => {
        console.log(error);
      }
    )
  }


  agregarCliente(idpersona: number): void {
    this.cliente.IDPERSONA = idpersona;
    this.cliente.ULTIMAFECHASOLICUTDUD = new Date();
    this._spinner.show();
    this._servicesPeluqueria.createCliente(this.cliente).pipe(
      finalize(() => this._spinner.hide())
    ).subscribe()
  }


  actualizarTipoCuentaTipoSeguro(identificacion: string, tipocuenta: string, tiposeguro: string): void {
    this._servicesPeluqueria.actualizarTipocuentaTipoSeguro(identificacion, tipocuenta, tiposeguro).subscribe()
  }

  getSeisDias(): Promise<void> {
    return new Promise((resolve) => {
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
        if (nombreDelDia != 'sabado') {
          if (nombreDelDia != 'domingo') {
            dias.push({
              dia: diaExport,
              nombre: nombreDelDia,
              mes: mes,
              anio: anio
            });
          }
        }
      }
      // suspender dias
      if (this.diasAExcluir && this.diasAExcluir.length > 0) {
        dias = dias.filter(d => !this.diasAExcluir.includes(d.dia));
      }
      this.diasDisponibles = dias;
    })
  }

  suspendirDias() {
    this._spinner.show()
    this._servicesPeluqueria.suspenderDias(3).subscribe({
      next: (res) => {
        this.diasAExcluir = res.data
        this.getSeisDias();
        this.verificarSitieneSeguroMortuorio()
        this.getHorariosDiarias();
        this.getCantidadHorarios();
      }
    })
  }

  getCantidadHorarios(): void {
    this._spinner.show()
    this._servicesPeluqueria.getCount(3).pipe(
      finalize(() => this._spinner.hide())
    ).subscribe(
      response => {
        this.cantidadTurnosAlDia = response.response.COUNT;
      }
    )
  }

  getHorariosDiarias(): void {
    this._servicesPeluqueria.getall(3).subscribe(
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
    this._servicesPeluqueria.getSolicitudPorFechaTurno(fecha, 3).subscribe(
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

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}
