import { Sector } from "./sectors";
import { Linedef } from "./linedef";
import { Lump } from "./lump";

export class Sidedef {
  private x: number;
  private y: number;
  private upper: string;
  private lower: string;
  private middle: string;
  private sector: Sector;
  private linedef: Linedef;
  private sectorIndex: number;

  constructor(offset: number, data: DataView) {
    this.x = data.getInt8(offset + 0);
    this.y = data.getInt8(offset + 2);

    this.upper = "";
    this.lower = "";
    this.middle = "";

    var i = 4;
    for (i = 4; i < 12; i++) {
      let charcode = data.getUint8(offset + i);
      if (charcode == 0) break;

      this.upper += String.fromCharCode(charcode);
    }

    for (i = 12; i < 20; i++) {
      let charcode = data.getUint8(offset + i);
      if (charcode == 0) break;
      this.lower += String.fromCharCode(charcode);
    }

    for (i = 20; i < 28; i++) {
      let charcode = data.getUint8(offset + i);
      if (charcode == 0) break;

      this.middle += String.fromCharCode(charcode);
    }

    this.sectorIndex = data.getInt16(offset + 28, true);
  }

  getSectorIndex(): number {
    return this.sectorIndex;
  }

  getSector(): Sector {
    return this.sector;
  }

  getLower(): string {
    return this.lower;
  }

  getUpper(): string {
    return this.upper;
  }

  getMiddle(): string {
    return this.middle;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  setLinedef(linedef: Linedef) {
    this.linedef = linedef;
  }

  getLinedef(): Linedef {
    return this.linedef;
  }

  setSector(sector: Sector) {
    this.sector = sector;
  }
}

export class Sidedefs extends Lump {
  private sidedefs: Sidedef[];

  constructor(lump: any, data: any, linedefs: Linedef[]) {
    super(lump, data);

    this.sidedefs = [];

    for (var i = 0; i < this.dataView.byteLength; i += 30) {
      let sidedef = new Sidedef(i, this.dataView);

      this.sidedefs.push(sidedef);
    }

    for (var i = 0; i < linedefs.length; i++) {
      var rightIndex: number = linedefs[i].getRight();
      var leftIndex: number = linedefs[i].getLeft();

      linedefs[i].setSidedef(
        this.sidedefs[rightIndex],
        this.sidedefs[leftIndex]
      );
    }
  }

  get(): Sidedef[] {
    return this.sidedefs;
  }
}
