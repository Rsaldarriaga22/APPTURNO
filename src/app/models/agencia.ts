

export interface AgenciaModel {
  agid: number,
  agnombre: number,
  agfecha: number,
}


export class AgenciaModel {

  constructor(
    public agid: number,
    public agnombre: number,
    public agfecha: number,

  ) {

    this.agid = agid,
      this.agnombre = agnombre,
      this.agfecha = agfecha

  }


}


