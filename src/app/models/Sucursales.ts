export class Sucursal {

    public IDSUCURSAL: number;
    public IDCANTON: number;
    public SUCURSAL: string;
  
    constructor(
      IDSUCURSAL: number,
      IDCANTON: number,
      SUCURSAL: string
    ) {
      this.IDSUCURSAL = IDSUCURSAL;
      this.IDCANTON = IDCANTON;
      this.SUCURSAL = SUCURSAL;
    }
  }
  