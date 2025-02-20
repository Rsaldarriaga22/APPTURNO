

export interface codigoModel {
    
  total: number;
  data:  codigo[];
}


export interface codigo {
  ccodigo: string
}

export class codigo {
  constructor(
    public ccodigo: string
  ) {
      this.ccodigo = ccodigo
  }
}


