import { Lump } from './lump';
import { Seg, Segs } from './segs';

export class Subsector {
  private segsCount: number;
  private segsOffset: number;

  private segs: Seg[];

  constructor(offset: number, data: DataView, segs: Segs) {
    this.segsCount = data.getUint16(offset, true);
    this.segsOffset = data.getUint16(offset + 2, true);
    // console.info(this);
    this.segs = [];

    for (var i = 0; i < this.segsCount; i++) {
      this.segs.push(segs.getSeg(i + this.segsOffset));
    }
  }

  getSegs(): Seg[] {
    return this.segs;
  }
}

export class Subsectors extends Lump {
  private subsectors: Subsector[];

  constructor(lump: any, data: any, segs: Segs) {
    super(lump, data);

    this.subsectors = [];
    for (var i = 0; i < this.dataView.byteLength; i += 4) {
      this.subsectors.push(new Subsector(i, this.dataView, segs));
    }
  }

  getSubsector(index: number): Subsector {
    return this.subsectors[index];
  }

  get(): Subsector[] {
    return this.subsectors;
  }
}
