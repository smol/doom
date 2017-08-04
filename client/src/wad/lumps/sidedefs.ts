module Wad {
	export class Sidedef {
		private x : number;
		private y : number;
		private upper : string;
		private lower : string;
		private middle : string;
		private sector : Sector;
		private sectorIndex : number;

		constructor(offset: number, data : DataView){
			this.x = data.getInt16(offset + 0, true);
			this.y = data.getInt16(offset + 2, true);

			this.upper = "";
			this.lower = "";
			this.middle = "";

			var i = 4;
			for (; i < 12; i++){
				this.upper += String.fromCharCode(data.getInt8(offset + i));
			}

			for (; i < 20; i++){
				this.lower += String.fromCharCode(data.getInt8(offset + i));
			}

			for (; i < 28; i++){
				this.middle += String.fromCharCode(data.getInt8(offset + i));
			}

			this.sectorIndex = data.getInt16(offset + 28, true);
		}

		getSectorIndex() : number {
			return this.sectorIndex;
		}

		setSector(sector : Sector) {
			this.sector = sector;
		}
	}

	export class Sidedefs extends Lump {
		private sidedefs : Sidedef[];

		constructor(lump: any, data: any){
			super(lump, data);

			this.sidedefs = [];

			console.info(lump.pos);

			for (var i = 0; i < this.dataView.byteLength; i += 30){
				this.sidedefs.push(new Sidedef(i, this.dataView));
			}

			console.info('SIDEDEFS', this.sidedefs);
		}

		get() : Sidedef[] {
			return this.sidedefs;
		}
	}
}