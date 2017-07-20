module Wad {
	export class Textures extends Lump {
		private count : number;
		private offset : number;

		private graphics : Graphic[];

		constructor(lump: any, data: any){
			super(lump, data);

			this.count = this.dataView.getUint32(0, true);
			this.offset = this.dataView.getUint32(4, true);

			this.graphics = [];

			console.info('TEXTURE', lump.name, this.count, this.offset);
		}

		push(graphic : Graphic){
			this.count--;
			this.graphics.push(graphic);
		}

		getCount() : number {
			return this.count;
		}

		getGraphics() : Graphic[] {
			return this.graphics;
		}
	}
}