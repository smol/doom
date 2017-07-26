// import Playpal from './lumps/Playpal';
// import ColorMap from './lumps/ColorMap';
// import Endoom from './lumps/Endoom';

// import Map from './lumps/Map';
// import Graphic from './lumps/Graphic';

/// <reference path="./lumps/playpal.ts" />
/// <reference path="./lumps/colormap.ts" />
/// <reference path="./lumps/endoom.ts" />
/// <reference path="./lumps/map.ts" />
/// <reference path="./lumps/graphic.ts" />


module Wad {
	export class Wad {
		private playpal: Playpal;
		private colorMap: ColorMap;
		private endoom: Endoom;

		private maps: Map[];

		private graphics: Graphic[];
		private musics : Music[];

		private textures: Textures[];
		private flats: Flat[];

		private flatsStarted: Boolean = false;

		constructor() {
			this.graphics = [];
			this.maps = [];

			this.flats = [];
			this.textures = [];
			this.musics = [];
		}

		setPlaypal(lump: any, data: any) {
			this.playpal = new Playpal(lump, data);
		}

		setColorMap(lump: any, data: any) {
			this.colorMap = new ColorMap(this.playpal, lump, data);
		}

		setEndoom(lump: any, data: any) {
			this.endoom = new Endoom(lump, data);
		}

		setGraphic(lump: any, data: any) {
			let graphic = new Graphic(this.playpal, lump, data);

			for (var i = 0; i < this.textures.length; i++){
				let texture = this.textures[i].getTextureByName(lump.name);

				if (texture !== null){
					texture.setGraphic(graphic);
					return;
				}
			}

			this.graphics.push(graphic);
		}

		setFlat(lump: any, data: any) {
			if (this.flatsStarted)
				this.flats.push(new Flat(this.playpal, lump, data));
		}

		setMap(lump: any, data: any) {
			this.maps.push(new Map(lump, data));
		}

		setStartFlats(started: Boolean) {
			this.flatsStarted = started;
		}

		setMusic(lump: any, data: any){
			this.musics.push(new Music(lump, data));
		}

		setTextures(parser: Parser, lump: any, data: any) {
			let textures : Textures = new Textures(parser, this.playpal, lump, data);

			for (var i = 0; i < this.graphics.length; i++){
				let texture : Texture = textures.getTextureByName(this.graphics[i].getName());

				if (texture !== null){
					texture.setGraphic(this.graphics[i]);

					this.graphics = this.graphics.splice(i, 1);
					break;
				}
			}

			// console.info(textures.getTextures());
			this.textures.push(textures);
		}

		getPlaypal(): Playpal { return this.playpal; }
		getColorMap(): ColorMap { return this.colorMap; }
		getEndoom(): Endoom { return this.endoom; }
		getGraphics(): Graphic[] { return this.graphics; }
		getFlats(): Flat[] { return this.flats; }
		getMaps(): Map[] { return this.maps; }
		getTextures() : Textures[] { return this.textures; }
		getMusics() : Music[] { return this.musics; }
	}
}


