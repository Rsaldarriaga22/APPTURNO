export class Horario {

    public IDHORARIO: number;
    public IDSERVICIO: number;
    public HORARIO: string;
  
    constructor(
      IDHORARIO: number,
      IDSERVICIO: number,
      HORARIO: string
    ) {
      this.IDHORARIO = IDHORARIO;
      this.IDSERVICIO = IDSERVICIO;
      this.HORARIO = HORARIO;
    }
  }
  