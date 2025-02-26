export class Cliente {

    public IDCLIENTE: number;
    public IDPERSONA: number;
    public ULTIMAFECHASOLICUTDUD: any;
  
    constructor(
      IDCLIENTE: number,
      IDPERSONA: number,
      ULTIMAFECHASOLICUTDUD: any
    ) {
      this.IDCLIENTE = IDCLIENTE;
      this.IDPERSONA = IDPERSONA;
      this.ULTIMAFECHASOLICUTDUD = ULTIMAFECHASOLICUTDUD;
    }
  }
  