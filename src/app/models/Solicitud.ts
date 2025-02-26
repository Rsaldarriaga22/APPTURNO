export class Solicitud {

    public IDSOLICITUD: number;
    public IDPROFESIONAL: number;
    public IDSUCURSAL: number;
    public IDCLIENTE: number;
    public IDSERVICIO: number;
    public FECHA: any;
    public ESTADO: string;
    public FECHATURNO: any;
    public IDHORARIO: number;
    public HORARIO: any;
    public SUCURSAL: any;
    public NOMBRES: any;
    public IDENTIFICACION: any;
  
    constructor(
        IDSOLICITUD: number,
        IDPROFESIONAL: number,
        IDSUCURSAL: number,
        IDCLIENTE: number,
        IDSERVICIO: number,
        FECHA: any,
        ESTADO: string,
        FECHATURNO: any,
        IDHORARIO: number,
        HORARIO ?: any,
        SUCURSAL ?: any,
        NOMBRES ?: any,
        IDENTIFICACION ?: any,
    ){
        this.IDSOLICITUD = IDSOLICITUD;
        this.IDPROFESIONAL = IDPROFESIONAL;
        this.IDSUCURSAL = IDSUCURSAL;
        this.IDCLIENTE = IDCLIENTE;
        this.IDSERVICIO = IDSERVICIO;
        this.FECHA = FECHA;
        this.ESTADO = ESTADO;
        this.FECHATURNO = FECHATURNO;
        this.IDHORARIO = IDHORARIO;
        this.HORARIO = HORARIO;
        this.SUCURSAL = SUCURSAL;
        this.NOMBRES = NOMBRES;
        this.IDENTIFICACION = IDENTIFICACION;
    }
  }
  