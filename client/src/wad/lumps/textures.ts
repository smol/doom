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
			console.info('COUNT Texture', this.count, this.getName());
			this.graphics.push(graphic);
		}

		spaceAvailable() : Boolean {
			// console.info('SPACE AVALAIBLE', this.count, this.graphics.length)
			return this.graphics.length < this.count;
		}

		getGraphics() : Graphic[] {
			return this.graphics;
		}
	}
}