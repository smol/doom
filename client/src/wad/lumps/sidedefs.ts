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

		getSector() : Sector {
			return this.sector;
		}

		getMiddle() : string {
			return this.middle;
		}

		setSector(sector : Sector) {
			this.sector = sector;
		}
	}

	export class Sidedefs extends Lump {
		private sidedefs : Sidedef[];

		constructor(lump: any, data: any, linedefs : Linedef[]){
			super(lump, data);

			this.sidedefs = [];

			for (var i = 0; i < this.dataView.byteLength; i += 30){
				let sidedef = new Sidedef(i, this.dataView);

				this.sidedefs.push(sidedef);
			}

			for (var i = 0; i < linedefs.length; i++){
				var rightIndex : number = linedefs[i].getRight();
				var leftIndex : number = linedefs[i].getLeft();

				linedefs[i].setSidedef(this.sidedefs[rightIndex], this.sidedefs[leftIndex]);
			}
		}

		get() : Sidedef[] {
			return this.sidedefs;
		}
	}
}