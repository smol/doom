module Wad {
	export class Reject {
		constructor(offset: number, size: number, data: DataView){

		}
	}

	export class Rejects extends Lump {
		private rejects : Reject[];

		constructor(lump: any, data: any, sectors : Sectors){
			super(lump, data);

			this.rejects = [];
			let size : number = Math.round((sectors.get().length << 1) / 8);

			for (var i = 0; i < this.dataView.byteLength; i += size){
				this.rejects.push(new Reject(i, size, this.dataView));
			}

		}
	}
}