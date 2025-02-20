
export interface areaModel {
  auid: number,
  anombre: String
}

export class areaModel {

  constructor(
    public auid: number,
    public anombre: String
  ) {

    this.auid = auid,
      this.anombre = anombre

  }


}


