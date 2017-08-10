module Wad {

	export class Pname {
		private name: string;
		private graphic: Graphic;

		constructor(offset: number, data: DataView) {
			this.name = "";

			for (var b = 0; b < 8; b++) {
				this.name += String.fromCharCode(data.getInt8(offset + b));
			}

			// console.info(graphics);
			// for (var i = 0; i < graphics.length; i++){
			// 	if (graphics[i].getName()){
			// 		this.graphic = graphics[i];
			// 		break;
			// 	}
			// }
		}

		getName(): string {
			return this.name;
		}

		setGraphic(graphic: Graphic) {
			this.graphic = graphic;
		}

		getGraphics(): Graphic {
			return this.graphic;
		}
	}

	export class Pnames extends Lump {
		private pnames: Pname[];

		constructor(lump: any, data: any, textures: Textures[]) {
			super(lump, data);

			let count: number = this.dataView.getUint32(0, true);

			this.pnames = [];
			for (var i = 0; i < count; i++) {
				let offset: number = (i * 8) + 4;

				this.pnames.push(new Pname(offset, this.dataView));
			}

			textures.forEach(textures => {
				textures.getTextures().forEach(texture => {
					texture.getPatches().forEach(patch => {
						patch.pname = this.pnames[patch.pnameIndex];
					})
				});
			});
		}

		setGraphic(graphic: Graphic) {
			this.pnames.forEach(pname => {

				if (graphic.getName() == pname.getName()) {
					

					pname.setGraphic(graphic);

					if (graphic.getName() === 'DOOR3_6') {
						console.info(graphic.getName(), pname.getName(), pname);
					}
					return
				}
			});
		}

		get(): Pname[] {
			return this.pnames;
		}
	}
}