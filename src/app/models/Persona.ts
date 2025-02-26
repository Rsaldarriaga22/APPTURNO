export class Persona {

    public IDPERSONA: number;
    public NOMBRES: string;
    public IDENTIFICACION: string;
    public CELULAR: string;
    public EMAIL: string;
  
    constructor(
      IDPERSONA: number,
      NOMBRES: string,
      IDENTIFICACION: string,
      CELULAR: string,
      EMAIL: string
    ) {
      this.IDPERSONA = IDPERSONA;
      this.NOMBRES = NOMBRES;
      this.IDENTIFICACION = IDENTIFICACION;
      this.CELULAR = CELULAR;
      this.EMAIL = EMAIL;
    }
  }
  