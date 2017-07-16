module Wad {
	const flagsType = [
		'Impassible',
		'Block Monster',
		'Two-Sided',
		'Upper Unpegged',
		'Lower Unpegged',
		'Secret',
		'Block Sound',
		'Not on map',
		'Already on map'
	];

	export class Linedefs extends Lump {
		private linedefs : Linedef[];

		constructor(lump: any, data: any){
			super(lump, data);

			this.linedefs = [];

			for (var i = 0; i < this.dataView.byteLength; i += 14){
				this.linedefs.push(new Linedef(lump, data, i));
			}
		}

		get() : Linedef[] {
			return this.linedefs;
		}
	}

	export class Linedef extends Lump {
		private firstVertexIndex : number;
		private secondVertexIndex : number;
		private flagsIndex : number;
		private types : number;
		private tag : number;
		private right : number;
		private left : number;
		private flags : string;

		constructor(lump: any, data: any, offset: number){
			super(lump, data);

			this.firstVertexIndex = this.dataView.getInt16(offset, true);
			this.secondVertexIndex = this.dataView.getInt16(offset + 2, true);
			this.flagsIndex = this.dataView.getInt16(offset + 4, true);
			this.types = this.dataView.getInt16(offset + 6, true);
			this.tag = this.dataView.getInt16(offset + 8, true);
			this.right = this.dataView.getInt16(offset + 10, true);
			this.left = this.dataView.getInt16(offset + 12, true);

			this.flags = 'NOTHING';

			if (this.flagsIndex < flagsType.length){
				this.flags = flagsType[this.flagsIndex];
			}
			// console.warn('linedefs', firstVertexIndex, secondVertexIndex, flagsString, types, tag, right, left);
			
		}

		getFirst() : number {
			return this.firstVertexIndex;
		}

		getSecond() : number {
			return this.secondVertexIndex;
		}

		getFlag() : string {
			return this.flags;
		}
	}
}