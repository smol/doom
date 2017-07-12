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

		constructor() {
			this.graphics = [];
			this.maps = [];

			console.warn('test');
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
			this.graphics.push(new Graphic(this.playpal, lump, data));
		}

		setMap(lump: any, data: any) {
			this.maps.push(new Map(lump, data));
		}

		getPlaypal(): Playpal { return this.playpal; }
		getColorMap(): ColorMap { return this.colorMap; }
		getEndoom(): Endoom { return this.endoom; }
		getGraphics(): Graphic[] { return this.graphics; }
		getMaps(): Map[] { return this.maps; }
	}
}


