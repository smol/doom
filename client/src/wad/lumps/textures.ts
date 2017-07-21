module Wad {
	export class Textures extends Lump {
		private count : number;
		private offset : number;

		private textures : Texture[];

		constructor(parser : Parser, playpal : Playpal, lump: any, data: any){
			super(lump, data);

			this.count = this.dataView.getUint32(0, true);
			this.offset = this.dataView.getUint32(4, true);

			this.textures = [];

			var tempOffset : number = this.offset + lump.pos;

			console.info('OFFSET', tempOffset);

			for (var i = 0; i < this.count; i++){

				var data = parser.getDataByOffset(tempOffset, 5000);
				let texture = new Texture(playpal, data);
				this.textures.push(texture);
				
				tempOffset += texture.getSize();
			}

			console.info('TEXTURE', lump.name, this.count, this.offset);
		}

		// push(graphic : Graphic){
		// 	console.info('COUNT Texture', this.count, this.getName());
		// 	this.graphics.push(graphic);
		// }

		getTextures() : Texture[] {
			return this.textures;
		}
	}
}