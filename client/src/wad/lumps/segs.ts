module Wad {
	export class Seg {
		private startVertex : number;
		private endVertex : number;
		private angle : number;
		private linedef : number;
		private direction : number;
		private offset : number;

		constructor(offset: number, data: DataView){
			this.startVertex = data.getInt16(offset + 0, true);
			this.endVertex = data.getInt16(offset + 2, true);

			this.angle = data.getInt16(offset + 4, true);
			this.linedef = data.getInt16(offset + 6, true);
			this.direction = data.getInt16(offset + 8, true);
			this.offset = data.getInt16(offset + 10, true);
		}
	}

	export class Segs extends Lump {
		private segs : Seg[];

		constructor(lump: any, data: any){
			super(lump, data);

			this.segs = [];
			for (var i = 0; i < this.dataView.byteLength; i += 12){
				this.segs.push(new Seg(i, this.dataView));
			}
		}

		getSeg(index: number) : Seg {
			return this.segs[index];
		}
	}
}