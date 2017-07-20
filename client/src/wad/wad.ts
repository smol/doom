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

		private textures: Textures[];
		private flats: Flat[];

		private flatsStarted: Boolean = false;

		constructor() {
			this.graphics = [];
			this.maps = [];

			this.flats = [];
			this.textures = [];
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

			if (this.textures !== null && this.textures[this.textures.length - 1].getCount() > 0)
				this.textures[this.textures.length - 1].push(graphic);
			else
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

		setTextures(lump: any, data: any) {
			this.textures.push(new Textures(lump, data));
		}

		getPlaypal(): Playpal { return this.playpal; }
		getColorMap(): ColorMap { return this.colorMap; }
		getEndoom(): Endoom { return this.endoom; }
		getGraphics(): Graphic[] { return this.graphics; }
		getFlats(): Flat[] { return this.flats; }
		getMaps(): Map[] { return this.maps; }
		getTextures() : Textures[] { return this.textures; }
	}
}


