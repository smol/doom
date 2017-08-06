module Wad {

	export class Pname {
		private name: string;
		private graphic : Graphic;

		constructor(offset: number, graphics: Graphic[], data: DataView) {
			this.name = "";

			for (var b = 0; b < 8; b++) {
				this.name += String.fromCharCode(data.getInt8(offset + b));
			}

			for (var i = 0; i < graphics.length; i++){
				if (graphics[i].getName()){
					this.graphic = graphics[i];
					break;
				}		
			}
		}
	}

	export class Pnames extends Lump {
		private pnames: Pname[];

		constructor(lump: any, data: any, graphics : Graphic[]) {
			super(lump, data);

			let count: number = this.dataView.getUint32(0, true);

			this.pnames = [];
			for (var i = 0; i < count; i++) {
				let offset: number = (i * 8) + 4;

				this.pnames.push(new Pname(offset, graphics, this.dataView));
			}
		}

		get(): Pname[] {
			return this.pnames;
		}
	}
}