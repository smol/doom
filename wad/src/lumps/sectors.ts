/*
	 0  00  -       Normal, no special characteristic.
	 1  01  Light   random off
	 2  02  Light   blink 0.5 second
	 3  03  Light   blink 1.0 second
	 4  04  Both    -10/20% health AND light blink 0.5 second
	 5  05  Damage  -5/10% health
	 7  07  Damage  -2/5% health
	 8  08  Light   oscillates
	 9  09  Secret  a player must stand in this sector to get credit for
			  finding this secret. This is for the SECRETS ratio
			  on inter-level screens.
	10  0a  Door    30 seconds after level start, ceiling closes like a door.
	11  0b  End     -10/20% health. If a player's health is lowered to less
			  than 11% while standing here, then the level ends! Play
			  proceeds to the next level. If it is a final level
			  (levels 8 in DOOM 1, level 30 in DOOM 2), the game ends!
	12  0c  Light   blink 0.5 second, synchronized
	13  0d  Light   blink 1.0 second, synchronized
	14  0e  Door    300 seconds after level start, ceiling opens like a door.
	16  10  Damage  -10/20% health
	
	  The following value can only be used in versions 1.666 and up, it will
	cause an error and exit to DOS in version 1.2 and earlier:
	
	17  11  Light   flickers on and off randomly
	
	  All other values cause an error and exit to DOS. This includes these
	two values which were developed and are quoted by id as being available,
	but are not actually implemented in DOOM.EXE (as of version 1.666):
	
	 6  06  -       crushing ceiling
	15  0f  -       ammo creator
	
	  What a shame! The "ammo creator" sounds especially interesting!
	*/

import { Lump } from './lump';
import { Sidedef } from './sidedefs';
import { Linedef } from './linedef';

export class Sector {
  private floorHeight: number;
  private ceilingHeight: number;
  private floorTexture: string;
  private ceilingTexture: string;

  private lightLevel: number;
  private specialSector: number;
  private linedefsTag: number;

  private sidedefs: Sidedef[];
  private linedefs: Linedef[];

  constructor(offset: number, dataView: DataView) {
    this.floorHeight = dataView.getInt16(0 + offset, true);
    this.ceilingHeight = dataView.getInt16(2 + offset, true);

    this.floorTexture = '';
    this.ceilingTexture = '';
    for (var i = 0; i < 8; i++) {
      let floorCharcode = dataView.getUint8(i + 4 + offset);
      let ceilingCharCode = dataView.getUint8(i + 12 + offset);

      if (floorCharcode != 0)
        this.floorTexture += String.fromCharCode(floorCharcode);
      if (ceilingCharCode != 0)
        this.ceilingTexture += String.fromCharCode(ceilingCharCode);
    }

    this.lightLevel = dataView.getInt16(20 + offset, true);
    this.specialSector = dataView.getInt16(22 + offset, true);
    this.linedefsTag = dataView.getInt16(24 + offset, true);
    this.sidedefs = [];
    this.linedefs = [];
  }

  getCeilingTextureName(): string {
    return this.ceilingTexture;
  }

  getFloorTextureName(): string {
    return this.floorTexture;
  }

  getCeilingHeight(): number {
    return this.ceilingHeight;
  }

  getFloorHeight(): number {
    return this.floorHeight;
  }

  getSidedefs(): Sidedef[] {
    return this.sidedefs;
  }

  getLinedefs(): Linedef[] {
    return this.linedefs;
  }

  getTag(): number {
    return this.linedefsTag;
  }

  setLinedef(linedef: Linedef) {
    this.linedefs.push(linedef);
  }

  setSidedef(sidedef: Sidedef) {
    this.sidedefs.push(sidedef);
  }
}

export class Sectors extends Lump {
  private sectors: Sector[];

  constructor(lump: any, data: any, sidedefs: Sidedef[], linedefs: Linedef[]) {
    super(lump, data);

    this.sectors = [];
    for (var i = 0; i < this.dataView.byteLength; i += 26) {
      let sector = new Sector(i, this.dataView);
      this.sectors.push(sector);
    }

    linedefs.forEach(linedef => {
      this.sectors.forEach(sector => {
        if (sector.getTag() === linedef.getSectorTag()) {
          sector.setLinedef(linedef);
        }
      });
    });

    sidedefs.forEach(sidedef => {
      this.sectors[sidedef.getSectorIndex()].setSidedef(sidedef);
      sidedef.setSector(this.sectors[sidedef.getSectorIndex()]);
    });
  }

  get(): Sector[] {
    return this.sectors;
  }
}
