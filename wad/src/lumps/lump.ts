var groups: { [name: string]: string } = {
  'D_.*': 'D_s',
  'E\\dM\\d': 'ExMx',
  'DEMO\\d': 'Demos',
  'END\\d': 'ENDs',
  'AMMNUM\\d': 'AMMNUMs',
  'STG.*': 'STGs',
  'STT.*': 'STTs',
  'WIA\\d': 'WIAs',
  'STCFN\\d': 'STCFNs',
  'STKEYS\\d': 'STKEYs',
  'DP.*': 'DPs',
  'DS.*': 'DSs'
};

export class LumpData {
  public name : string;
  public pos : number;
  public size : number;
}

export class Lump {
  protected lump: LumpData;
  protected data: any;
  protected dataView: DataView;

  constructor(lump: LumpData, data: any) {
    this.lump = lump;
    this.data = data;

    this.dataView = new DataView(this.data);
  }

  getName(): string {
    if (this.lump === null) return 'NOTHING';
    return this.lump.name;
  }
}
