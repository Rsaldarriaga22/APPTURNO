
export interface usuarioModel {
  uid: number,
  ucedula: string,
  unombres: string,
  uapellidos: string,
  ucorreo: string,
  usocio: string,
  ufecha: string,

}




export class usuarioModel {

  constructor(
    public uid: number,
    public ucedula: string,
    public unombres: string,
    public uapellidos: string,
    public ucorreo: string,
    public usocio: string,
    public ufecha: string,

  ) {

    this.uid = uid,
      this.ucedula = ucedula,
      this.unombres = unombres,
      this.uapellidos = uapellidos,
      this.ucorreo = ucorreo,
      this.usocio = usocio,
      this.ufecha = ufecha
  }

}


